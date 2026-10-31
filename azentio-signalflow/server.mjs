import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 4173);
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MAX_BODY_BYTES = 2048;
const API_TIMEOUT_MS = 10000;
const PUBLIC_FILES = new Set(['index.html', 'app.js', 'style.css', 'manus-routes.json']);
const ALLOWED_RECOMMENDATIONS = new Set([
  'Escalate for enhanced due diligence',
  'Close as low-confidence activity',
  'Request supporting context before disposition',
]);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

// The API accepts only an ID from this server-owned fictional fixture set.
// Caller-supplied names, evidence, scores, and free text are never forwarded to a model.
const SYNTHETIC_CASES = Object.freeze({
  'ALT-24081': Object.freeze({ id: 'ALT-24081', score: 79, tags: ['velocity', 'new beneficiary', 'cross-border'], evidence: [{ title: 'Velocity spike' }] }),
  'ALT-24079': Object.freeze({ id: 'ALT-24079', score: 68, tags: ['cash intensity', 'seasonal variance'], evidence: [{ title: 'Cash concentration' }] }),
  'ALT-24074': Object.freeze({ id: 'ALT-24074', score: 92, tags: ['name match', 'sanctions', 'manual gate'], evidence: [{ title: 'Potential name match' }] }),
  'ALT-24068': Object.freeze({ id: 'ALT-24068', score: 54, tags: ['trade-based AML', 'invoice variance'], evidence: [{ title: 'Invoice variance' }] }),
  'ALT-24061': Object.freeze({ id: 'ALT-24061', score: 32, tags: ['dormant', 'low confidence'], evidence: [{ title: 'Dormancy break' }] }),
});

const SECURITY_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
};

function send(response, status, body, contentType = 'application/json; charset=utf-8') {
  response.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': contentType });
  response.end(body);
}

function sendJson(response, status, data) {
  send(response, status, JSON.stringify(data));
}

function failure(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const declaredLength = Number(request.headers['content-length'] || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      request.resume();
      reject(failure('Request body too large', 413));
      return;
    }

    const chunks = [];
    let bytes = 0;
    let rejected = false;
    request.on('data', (chunk) => {
      if (rejected) return;
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        rejected = true;
        chunks.length = 0;
        request.resume();
        reject(failure('Request body too large', 413));
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      if (rejected) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(failure('Invalid JSON body', 400));
      }
    });
    request.on('error', (error) => {
      if (!rejected) reject(error);
    });
  });
}

function fallback(caseData) {
  const high = caseData.score >= 75;
  const low = caseData.score < 50;
  return {
    id: caseData.id,
    recommendation: high ? 'Escalate for enhanced due diligence' : low ? 'Close as low-confidence activity' : 'Request supporting context before disposition',
    rationale: high
      ? `The strongest synthetic signal is ${caseData.evidence[0].title.toLowerCase()}. The demo links ${caseData.tags.length} indicators; keep the case in the human review lane.`
      : low
        ? 'The activity is unusual but aligns with the fictional customer peer profile. An analyst must document any review decision.'
        : 'The activity is above the synthetic baseline, but demo context is incomplete. Request supporting context before disposition.',
    confidence: high ? 0.91 : low ? 0.86 : 0.74,
    engine: 'demo-rules',
  };
}

function validateModelResult(candidate, caseId) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null;
  if (candidate.id !== caseId || !ALLOWED_RECOMMENDATIONS.has(candidate.recommendation)) return null;
  if (typeof candidate.rationale !== 'string' || candidate.rationale.length < 1 || candidate.rationale.length > 600) return null;
  if (candidate.confidence !== undefined && (!Number.isFinite(candidate.confidence) || candidate.confidence < 0 || candidate.confidence > 1)) return null;
  return {
    id: caseId,
    recommendation: candidate.recommendation,
    rationale: candidate.rationale,
    confidence: candidate.confidence ?? null,
    engine: 'model',
  };
}

async function modelInvestigation(caseData) {
  const localResult = fallback(caseData);
  if (!process.env.OPENAI_API_KEY) return localResult;

  const prompt = `You are an AML investigation copilot. Analyze this fixed synthetic demo case only. Do not infer guilt or invent facts. Return JSON with keys id, recommendation, rationale, confidence. Recommendation must be one of: ${[...ALLOWED_RECOMMENDATIONS].join('; ')}. Keep rationale under 80 words, state uncertainty, and preserve human approval. Case: ${JSON.stringify(caseData)}`;
  try {
    const response = await fetch(`${process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Produce concise, evidence-limited JSON for a fictional demo case. The analyst always makes the final decision.' },
          { role: 'user', content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (!response.ok) return localResult;
    const payload = await response.json();
    const parsed = JSON.parse(payload.choices?.[0]?.message?.content || 'null');
    return validateModelResult(parsed, caseData.id) || localResult;
  } catch {
    return localResult;
  }
}

async function handleInvestigation(request, response) {
  const contentType = request.headers['content-type'] || '';
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    sendJson(response, 415, { error: 'Content-Type must be application/json' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some((key) => key !== 'case')) {
      sendJson(response, 400, { error: 'Expected an object containing only a case ID' });
      return;
    }
    const caseObject = body.case;
    if (!caseObject || typeof caseObject !== 'object' || Array.isArray(caseObject) || Object.keys(caseObject).length !== 1 || typeof caseObject.id !== 'string') {
      sendJson(response, 400, { error: 'Expected case: { id: string }' });
      return;
    }
    const canonicalCase = SYNTHETIC_CASES[caseObject.id];
    if (!canonicalCase) {
      sendJson(response, 404, { error: 'Unknown synthetic demo case' });
      return;
    }
    sendJson(response, 200, await modelInvestigation(canonicalCase));
  } catch (error) {
    sendJson(response, error.status || 400, { error: error.status === 413 ? 'Request body too large' : 'Invalid request' });
  }
}

const server = http.createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  } catch {
    send(response, 400, 'Bad request', 'text/plain; charset=utf-8');
    return;
  }

  if (request.method === 'POST' && pathname === '/api/investigate') {
    await handleInvestigation(request, response);
    return;
  }
  if (pathname.startsWith('/api/')) {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    send(response, 405, 'Method not allowed', 'text/plain; charset=utf-8');
    return;
  }

  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (!PUBLIC_FILES.has(relativePath)) {
    send(response, 404, 'Not found', 'text/plain; charset=utf-8');
    return;
  }
  try {
    const content = await readFile(join(ROOT, relativePath));
    const contentType = MIME[extname(relativePath)] || 'application/octet-stream';
    if (request.method === 'HEAD') {
      response.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': contentType });
      response.end();
      return;
    }
    send(response, 200, content, contentType);
  } catch {
    send(response, 404, 'Not found', 'text/plain; charset=utf-8');
  }
});

server.requestTimeout = 15000;
server.headersTimeout = 10000;
server.listen(PORT, '127.0.0.1', () => console.log(`SignalFlow local demo at http://127.0.0.1:${PORT}`));

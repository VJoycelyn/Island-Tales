import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
let localService;
let mockApi;
let mockApiPort;
let mockCalls = [];
let mockStatus = 200;
let mockCandidate = {
  id: 'ALT-24081',
  recommendation: 'Escalate for enhanced due diligence',
  rationale: 'The synthetic sample includes a strong velocity signal; analyst review remains required.',
  confidence: 0.89,
};

async function reservePort() {
  const probe = net.createServer();
  await new Promise((resolve, reject) => probe.once('error', reject).listen(0, '127.0.0.1', resolve));
  const { port } = probe.address();
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function stopProcess(child) {
  if (!child || child.exitCode !== null) return;
  child.kill('SIGTERM');
  await Promise.race([new Promise((resolve) => child.once('exit', resolve)), sleep(2000)]);
}

async function launchDemoServer(env = {}) {
  const port = await reservePort();
  const child = spawn(process.execPath, [join(ROOT, 'server.mjs')], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), OPENAI_API_KEY: '', ...env },
    stdio: 'ignore',
  });
  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Demo server exited with ${child.exitCode}`);
    try {
      const response = await fetch(`${baseUrl}/`, { signal: AbortSignal.timeout(300) });
      if (response.ok) return { child, baseUrl };
    } catch {
      await sleep(100);
    }
  }
  await stopProcess(child);
  throw new Error('Demo server did not become ready');
}

before(async () => {
  mockApi = http.createServer((request, response) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => {
      try { mockCalls.push(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { mockCalls.push(null); }
      response.writeHead(mockStatus, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify(mockCandidate) } }] }));
    });
  });
  await new Promise((resolve, reject) => mockApi.once('error', reject).listen(0, '127.0.0.1', resolve));
  mockApiPort = mockApi.address().port;
  localService = await launchDemoServer();
});

after(async () => {
  await stopProcess(localService?.child);
  if (mockApi?.listening) await new Promise((resolve) => mockApi.close(resolve));
});

async function postJson(baseUrl, path, body) {
  return fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('serves the app and adds security headers', async () => {
  const response = await fetch(`${localService.baseUrl}/`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-security-policy') || '', /default-src 'self'/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.match(await response.text(), /SignalFlow/);
});

test('serves only the explicit public asset allowlist', async () => {
  for (const asset of ['app.js', 'style.css', 'manus-routes.json']) {
    const response = await fetch(`${localService.baseUrl}/${asset}`);
    assert.equal(response.status, 200, asset);
  }
  for (const path of ['/server.mjs', '/README.md', '/.env.example', '/%2e%2e/server.mjs']) {
    const response = await fetch(`${localService.baseUrl}${path}`);
    assert.equal(response.status, 404, path);
  }
});

test('returns a deterministic result for a known server-owned synthetic case', async () => {
  const response = await postJson(localService.baseUrl, '/api/investigate', { case: { id: 'ALT-24081' } });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.id, 'ALT-24081');
  assert.equal(result.engine, 'demo-rules');
  assert.equal(result.recommendation, 'Escalate for enhanced due diligence');
  assert.match(result.rationale, /synthetic/i);
});

test('optional model path sends only canonical fixture data and validates structured output', async () => {
  mockCalls = [];
  mockStatus = 200;
  mockCandidate = {
    id: 'ALT-24081',
    recommendation: 'Escalate for enhanced due diligence',
    rationale: 'The fictional sample shows an elevated velocity pattern; an analyst should verify the evidence.',
    confidence: 0.89,
  };
  const service = await launchDemoServer({
    OPENAI_API_KEY: 'test-only-not-a-real-secret',
    OPENAI_API_BASE: `http://127.0.0.1:${mockApiPort}/v1`,
    OPENAI_MODEL: 'mock-model',
  });
  try {
    const response = await postJson(service.baseUrl, '/api/investigate', { case: { id: 'ALT-24081' } });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.engine, 'model');
    assert.equal(result.confidence, 0.89);
    assert.equal(mockCalls.length, 1);
    const sent = JSON.stringify(mockCalls[0]);
    assert.match(sent, /ALT-24081/);
    assert.match(sent, /Velocity spike/);
    assert.doesNotMatch(sent, /Nadia Rahman|184,200|Sensitive name/);
  } finally {
    await stopProcess(service.child);
  }
});

test('falls back when the model returns invalid structured output', async () => {
  mockCandidate = {
    id: 'ALT-24081',
    recommendation: '<script>alert(1)</script>',
    rationale: 'malformed recommendation',
    confidence: 9,
  };
  const service = await launchDemoServer({
    OPENAI_API_KEY: 'test-only-not-a-real-secret',
    OPENAI_API_BASE: `http://127.0.0.1:${mockApiPort}/v1`,
    OPENAI_MODEL: 'mock-model',
  });
  try {
    const response = await postJson(service.baseUrl, '/api/investigate', { case: { id: 'ALT-24081' } });
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.engine, 'demo-rules');
    assert.doesNotMatch(result.recommendation, /<script/i);
  } finally {
    await stopProcess(service.child);
  }
  mockCandidate = {
    id: 'ALT-24081',
    recommendation: 'Escalate for enhanced due diligence',
    rationale: 'The synthetic sample includes a strong velocity signal; analyst review remains required.',
    confidence: 0.89,
  };
});

test('rejects unrecognized IDs and caller-supplied case details', async () => {
  const unknown = await postJson(localService.baseUrl, '/api/investigate', { case: { id: 'NOT-A-DEMO-CASE' } });
  assert.equal(unknown.status, 404);
  const extraCaseFields = await postJson(localService.baseUrl, '/api/investigate', { case: { id: 'ALT-24081', customer: 'Sensitive name' } });
  assert.equal(extraCaseFields.status, 400);
  const extraBodyFields = await postJson(localService.baseUrl, '/api/investigate', { case: { id: 'ALT-24081' }, prompt: 'untrusted' });
  assert.equal(extraBodyFields.status, 400);
});

test('rejects malformed, wrong-content-type, and oversized requests', async () => {
  const wrongType = await fetch(`${localService.baseUrl}/api/investigate`, { method: 'POST', body: '{"case":{"id":"ALT-24081"}}' });
  assert.equal(wrongType.status, 415);
  const malformed = await fetch(`${localService.baseUrl}/api/investigate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(malformed.status, 400);
  const oversized = await fetch(`${localService.baseUrl}/api/investigate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ case: { id: 'ALT-24081' }, padding: 'x'.repeat(4096) }) });
  assert.equal(oversized.status, 413);
});

test('rejects write verbs on static routes and has no API CORS grant', async () => {
  const put = await fetch(`${localService.baseUrl}/`, { method: 'PUT' });
  assert.equal(put.status, 405);
  assert.equal(put.headers.get('access-control-allow-origin'), null);
});

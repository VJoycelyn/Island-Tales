import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 4173);
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const MIME = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.mjs':'text/javascript; charset=utf-8' };

function fallback(c) {
  const high = Number(c.score) >= 75; const low = Number(c.score) < 50;
  return { id:c.id, recommendation: high ? 'Escalate for enhanced due diligence' : low ? 'Close as low-confidence activity' : 'Request supporting context before disposition', rationale: high ? `The strongest signal is ${String(c.evidence?.[0]?.title || 'the primary trigger').toLowerCase()}. The graph links ${c.tags?.length || 0} risk indicators, so the case should remain in the human review lane.` : low ? 'The activity is unusual but aligns with the customer’s peer profile and stated behavior. Preserve the evidence and close with a documented rationale.' : 'The activity exceeds a normal baseline, but available context is incomplete. Request a source-of-funds document before escalating.', confidence: high ? 0.91 : low ? 0.86 : 0.74, steps:['done','done','done','done'] };
}
async function modelInvestigation(c) {
  if (!process.env.OPENAI_API_KEY) return fallback(c);
  const prompt = `You are an AML investigation copilot. Analyze this synthetic alert only. Do not invent facts. Return JSON with keys id, recommendation, rationale, confidence, steps. Recommendation must be one of: "Escalate for enhanced due diligence", "Close as low-confidence activity", "Request supporting context before disposition". Keep rationale under 45 words, state uncertainty, and preserve a human approval gate. Case: ${JSON.stringify(c)}`;
  const response = await fetch(`${process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'}/chat/completions`, { method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`}, body:JSON.stringify({ model:MODEL, temperature:0.1, response_format:{type:'json_object'}, messages:[{role:'system',content:'You produce concise, auditable JSON for financial crime investigators.'},{role:'user',content:prompt}] }) });
  if (!response.ok) return fallback(c);
  const payload = await response.json(); const content = payload.choices?.[0]?.message?.content; if (!content) return fallback(c);
  try { return {...fallback(c), ...JSON.parse(content), steps:['done','done','done','done']}; } catch (_) { return fallback(c); }
}
function send(res, status, body, type='application/json; charset=utf-8') { res.writeHead(status, {'Content-Type':type,'Cache-Control':'no-store','Access-Control-Allow-Origin':'*'}); res.end(body); }
const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '');
  if (req.method === 'POST' && req.url === '/api/investigate') {
    let raw=''; req.on('data', chunk => raw += chunk); req.on('end', async () => { try { const data=JSON.parse(raw); const result=await modelInvestigation(data.case || {}); send(res,200,JSON.stringify(result)); } catch (_) { send(res,400,JSON.stringify({error:'Invalid case payload'})); } }); return;
  }
  const requestPath = req.url === '/' ? '/index.html' : req.url.split('?')[0]; const safePath = normalize(requestPath).replace(/^\.\.(\/|\\|$)/,'');
  try { const file = await readFile(join(ROOT, safePath)); send(res,200,file,MIME[extname(safePath)] || 'application/octet-stream'); } catch (_) { send(res,404,'Not found','text/plain; charset=utf-8'); }
});
server.listen(PORT, '0.0.0.0', () => console.log(`SignalFlow running at http://0.0.0.0:${PORT}`));

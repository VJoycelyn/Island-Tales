const CASES = [
  { id: 'ALT-24081', customer: 'Nadia Rahman', initials: 'NR', segment: 'Retail banking · Premium', country: 'AE', trigger: 'Rapid movement of funds', score: 79, risk: 'high', status: 'Needs review', age: '12m ago', tags: ['velocity', 'new beneficiary', 'cross-border'], amount: 'AED 184,200', analyst: 'Unassigned', evidence: [{ title: 'Velocity spike', body: '8 outbound transfers in 22 minutes — 6.4× the customer\'s 90-day baseline.' }, { title: 'New beneficiary cluster', body: 'Three beneficiaries were added within the same session from a new device.' }, { title: 'Cross-border corridor', body: 'Funds moved AE → GB → TR, matching a known layering corridor pattern.' }], timeline: [['Alert created', '09:42:18'], ['Transaction graph built', '09:42:20'], ['Peer profile matched', '09:42:22']] },
  { id: 'ALT-24079', customer: 'Khaled & Sons Trading', initials: 'KS', segment: 'SME banking · Wholesale', country: 'BH', trigger: 'Unusual cash deposits', score: 68, risk: 'medium', status: 'Needs review', age: '31m ago', tags: ['cash intensity', 'seasonal variance'], amount: 'BHD 42,800', analyst: 'Unassigned', evidence: [{ title: 'Cash concentration', body: 'Deposit volume is above the peer group but consistent with the customer\'s annual Ramadan pattern.' }, { title: 'No watchlist match', body: 'Entity and directors cleared against configured screening lists.' }], timeline: [['Alert created', '09:23:44'], ['Watchlist screen complete', '09:23:46']] },
  { id: 'ALT-24074', customer: 'Maya Okafor', initials: 'MO', segment: 'Retail banking · Standard', country: 'NG', trigger: 'Sanctions name similarity', score: 92, risk: 'high', status: 'Escalated', age: '1h ago', tags: ['name match', 'sanctions', 'manual gate'], amount: 'USD 9,600', analyst: 'R. Patel', evidence: [{ title: 'Potential name match', body: 'Name similarity to a sanctions record is 92%; date of birth is unavailable.' }, { title: 'Geography mismatch', body: 'Customer address and transaction corridor require enhanced due diligence.' }], timeline: [['Alert created', '08:58:10'], ['Escalated to senior analyst', '09:03:41']] },
  { id: 'ALT-24068', customer: 'Sundar Import Export', initials: 'SI', segment: 'Commercial banking', country: 'IN', trigger: 'Trade finance anomaly', score: 54, risk: 'medium', status: 'Needs review', age: '2h ago', tags: ['trade-based AML', 'invoice variance'], amount: 'INR 2,480,000', analyst: 'Unassigned', evidence: [{ title: 'Invoice variance', body: 'Declared unit value is 31% above the customer\'s six-month corridor baseline.' }, { title: 'Port pattern', body: 'Counterparty and port combination has appeared in 2 prior low-confidence alerts.' }], timeline: [['Alert created', '07:41:02'], ['Trade document parsed', '07:41:08']] },
  { id: 'ALT-24061', customer: 'Amina Yusuf', initials: 'AY', segment: 'Retail banking · Standard', country: 'KE', trigger: 'Dormant account reactivation', score: 32, risk: 'low', status: 'Needs review', age: '3h ago', tags: ['dormant', 'low confidence'], amount: 'KES 185,000', analyst: 'Unassigned', evidence: [{ title: 'Dormancy break', body: 'Account reactivated after 14 months with one inbound transfer.' }, { title: 'Expected peer behavior', body: 'Activity matches the customer\'s stated seasonal remittance pattern.' }], timeline: [['Alert created', '06:58:12'], ['Peer profile matched', '06:58:14']] }
];

let selectedCase = CASES[0];
let investigation = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function statusClass(status) { return status === 'Escalated' ? 'escalated' : status === 'Resolved' ? 'resolved' : investigation?.id === selectedCase?.id ? 'investigating' : 'review'; }
function caseRow(item) {
  return `<div class="queue-row" role="row" data-case-id="${item.id}">
    <div class="case-name"><span class="case-symbol">${item.initials}</span><div><b>${item.customer}</b><small>${item.id} · ${item.country}</small></div></div>
    <div class="trigger">${item.trigger}<small>${item.age}</small></div>
    <div class="risk-score ${item.risk}">${item.score}<small> / 100</small></div>
    <span class="status-chip ${statusClass(item.status)}">${investigation?.id === item.id ? 'Investigating' : item.status}</span><span class="row-arrow">›</span>
  </div>`;
}
function renderQueue() { $('#case-list').innerHTML = CASES.map(caseRow).join(''); }
function openCase(id) {
  selectedCase = CASES.find(item => item.id === id) || CASES[0];
  investigation = null;
  renderDrawer();
  $('#case-drawer').classList.add('open');
  $('#case-drawer').setAttribute('aria-hidden', 'false');
}
function evidenceMarkup(item) { return item.evidence.map((e, index) => `<div class="evidence-item"><span class="evidence-icon">${index === 0 ? '↗' : index === 1 ? '◎' : '⌁'}</span><div><b>${e.title}</b><p>${e.body}</p></div></div>`).join(''); }
function timelineMarkup(item) { return item.timeline.map(event => `<div class="timeline-item"><div class="timeline-rail"><span class="timeline-dot"></span><span class="timeline-line"></span></div><div><b>${event[0]}</b><small>${event[1]} · system event</small></div></div>`).join(''); }
function renderDrawer() {
  const c = selectedCase;
  const scoreColor = c.risk === 'low' ? 'var(--green)' : c.risk === 'medium' ? 'var(--amber)' : 'var(--red)';
  $('#drawer-content').innerHTML = `<div class="drawer-eyebrow">CASE WORKSPACE · ${c.id}</div><h2 class="drawer-title">${c.customer}</h2><p class="drawer-subtitle">${c.segment} · ${c.country} · ${c.amount}</p><div class="drawer-tags">${c.tags.map(tag => `<span class="drawer-tag">${tag}</span>`).join('')}</div>
    <div class="case-score"><div class="score-ring" style="background:radial-gradient(circle at center,#0b1b2d 57%,transparent 59%),conic-gradient(${scoreColor} 0 ${c.score}%,rgba(255,255,255,.08) ${c.score}%)">${c.score}</div><div><b>Composite risk score</b><p>Model confidence is <strong style="color:${scoreColor}">${c.score > 80 ? 'high' : c.score > 55 ? 'moderate' : 'low'}</strong>. Human review is required before any disposition.</p></div></div>
    <div class="drawer-section"><h4>WHY THIS CASE?</h4><div class="evidence-list">${evidenceMarkup(c)}</div></div>
    <div class="drawer-section"><h4>EVENT TRACE</h4><div class="timeline">${timelineMarkup(c)}</div></div>
    <div class="investigation-box"><div class="investigation-head"><b>Investigation copilot</b><span class="ai-badge">AGENT GRAPH · v0.1</span></div><p style="font-size:10px;color:var(--muted);line-height:1.55;margin-bottom:10px">Four specialized agents will gather context, test policy, explain the signal and prepare a reviewable recommendation.</p><button id="run-investigation" class="run-button">Run explainable investigation →</button><div class="agent-steps"><div class="agent-step" data-step="0"><span class="step-dot"></span>Context agent · customer & peer profile</div><div class="agent-step" data-step="1"><span class="step-dot"></span>Pattern agent · transaction graph</div><div class="agent-step" data-step="2"><span class="step-dot"></span>Policy agent · rule & jurisdiction check</div><div class="agent-step" data-step="3"><span class="step-dot"></span>Decision agent · recommendation + rationale</div></div>${investigationMarkup()}</div>
    <div class="copilot"><span class="copilot-label">ASK THE COPILOT</span><div class="copilot-row"><input id="copilot-input" placeholder="Why is this alert high risk?" /><button id="copilot-submit">Ask</button></div><div id="copilot-answer" class="copilot-answer"></div></div>`;
  if (investigation) applyInvestigationState();
}
function investigationMarkup() { if (!investigation) return ''; return `<div class="analysis-result"><div class="recommendation"><span class="rec-icon">✦</span><div><b>${investigation.recommendation}</b><p>${investigation.rationale}</p></div></div><div class="next-actions"><button class="action-button primary" data-action="escalate">Escalate case</button><button class="action-button" data-action="resolve">Mark reviewed</button></div></div>`; }
function applyInvestigationState() { investigation.steps.forEach((state, index) => { const el = $(`.agent-step[data-step="${index}"]`); if (el) el.classList.add(state); }); const button = $('#run-investigation'); if (button) { button.textContent = 'Investigation complete'; button.disabled = true; } }
function localInvestigation(c) { const high = c.score >= 75; const low = c.score < 50; return { id: c.id, recommendation: high ? 'Escalate for enhanced due diligence' : low ? 'Close as low-confidence activity' : 'Request supporting context before disposition', rationale: high ? `The strongest signal is ${c.evidence[0].title.toLowerCase()}. The graph links ${c.tags.length} risk indicators, so the case should remain in the human review lane.` : low ? 'The activity is unusual but aligns with the customer’s peer profile and stated behavior. Preserve the evidence and close with a documented rationale.' : 'The activity exceeds a normal baseline, but available context is incomplete. Request a source-of-funds document before escalating.', confidence: high ? 0.91 : low ? 0.86 : 0.74, steps: ['done', 'done', 'done', 'done'] }; }
async function runInvestigation() {
  const button = $('#run-investigation'); if (!button || button.disabled) return;
  button.disabled = true; button.textContent = 'Running agent graph…'; selectedCase.status = 'Investigating'; renderQueue();
  const steps = $$('.agent-step'); steps.forEach(s => s.classList.remove('done', 'current'));
  for (let i = 0; i < steps.length; i++) { steps[i].classList.add('current'); await new Promise(resolve => setTimeout(resolve, 430)); steps[i].classList.remove('current'); steps[i].classList.add('done'); }
  try { const response = await fetch('/api/investigate', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ case: selectedCase }) }); investigation = response.ok ? await response.json() : localInvestigation(selectedCase); } catch (_) { investigation = localInvestigation(selectedCase); }
  investigation.steps = ['done', 'done', 'done', 'done']; renderDrawer(); renderQueue(); showToast('Investigation complete · human review required');
}
function closeDrawer() { $('#case-drawer').classList.remove('open'); $('#case-drawer').setAttribute('aria-hidden', 'true'); }
function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function setView(view) { $$('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.view === view)); $$('.view').forEach(item => item.classList.toggle('active-view', item.id === `view-${view}`)); }
function askCopilot() { const input = $('#copilot-input'); const answer = $('#copilot-answer'); if (!input || !answer) return; const question = input.value.trim().toLowerCase(); const c = selectedCase; let text = question.includes('why') || question.includes('risk') ? `This case is scored ${c.score}/100 because ${c.evidence[0].title.toLowerCase()} and ${c.evidence[1].title.toLowerCase()} are both above the customer’s peer baseline. The score is a prioritization aid, not a finding of misconduct.` : question.includes('next') || question.includes('action') ? `Recommended next step: ${c.score > 75 ? 'enhanced due diligence with source-of-funds evidence' : 'request supporting context and re-check the peer profile'}. Keep the decision with a named analyst.` : `I found ${c.evidence.length} evidence items for ${c.id}. Ask “why is this high risk?” or “what is the next action?” for a grounded answer.`; answer.textContent = text; answer.classList.add('show'); }

document.addEventListener('DOMContentLoaded', () => {
  renderQueue();
  document.addEventListener('click', (event) => {
    const row = event.target.closest('[data-case-id]'); if (row) return openCase(row.dataset.caseId);
    const nav = event.target.closest('[data-view]'); if (nav) return setView(nav.dataset.view);
    if (event.target.id === 'close-drawer' || event.target.id === 'case-drawer') return closeDrawer();
    if (event.target.id === 'run-investigation') return runInvestigation();
    if (event.target.id === 'copilot-submit') return askCopilot();
    const action = event.target.closest('[data-action]'); if (action) { if (action.dataset.action === 'escalate') { selectedCase.status = 'Escalated'; showToast(`${selectedCase.id} escalated to senior review`); } else { selectedCase.status = 'Resolved'; showToast(`${selectedCase.id} marked reviewed with audit note`); } renderDrawer(); renderQueue(); }
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDrawer(); if (event.key === 'Enter' && document.activeElement?.id === 'copilot-input') askCopilot(); });
});

const CASES = [
  {
    id: 'ALT-24081', customer: 'Nadia Rahman', initials: 'NR', segment: 'Retail banking · Premium', country: 'AE',
    trigger: 'Rapid movement of funds', score: 79, risk: 'high', status: 'Needs review', age: '12m ago', ageMinutes: 12,
    tags: ['velocity', 'new beneficiary', 'cross-border'], amount: 'AED 184,200', analyst: 'Unassigned',
    evidence: [
      { title: 'Velocity spike', body: '8 outbound transfers in 22 minutes — 6.4× the customer\'s 90-day baseline.' },
      { title: 'New beneficiary cluster', body: 'Three beneficiaries were added within the same session from a new device.' },
      { title: 'Cross-border corridor', body: 'Funds moved AE → GB → TR, matching a known layering corridor pattern.' },
    ],
    timeline: [['Alert created', '09:42:18'], ['Transaction graph built', '09:42:20'], ['Peer profile matched', '09:42:22']],
  },
  {
    id: 'ALT-24079', customer: 'Khaled & Sons Trading', initials: 'KS', segment: 'SME banking · Wholesale', country: 'BH',
    trigger: 'Unusual cash deposits', score: 68, risk: 'medium', status: 'Needs review', age: '31m ago', ageMinutes: 31,
    tags: ['cash intensity', 'seasonal variance'], amount: 'BHD 42,800', analyst: 'Unassigned',
    evidence: [
      { title: 'Cash concentration', body: 'Deposit volume is above the peer group but consistent with the customer\'s annual Ramadan pattern.' },
      { title: 'No watchlist match', body: 'Entity and directors cleared against configured screening lists.' },
    ],
    timeline: [['Alert created', '09:23:44'], ['Watchlist screen complete', '09:23:46']],
  },
  {
    id: 'ALT-24074', customer: 'Maya Okafor', initials: 'MO', segment: 'Retail banking · Standard', country: 'NG',
    trigger: 'Sanctions name similarity', score: 92, risk: 'high', status: 'Escalated', age: '1h ago', ageMinutes: 60,
    tags: ['name match', 'sanctions', 'manual gate'], amount: 'USD 9,600', analyst: 'R. Patel',
    evidence: [
      { title: 'Potential name match', body: 'Name similarity to a sanctions record is 92%; date of birth is unavailable.' },
      { title: 'Geography mismatch', body: 'Customer address and transaction corridor require enhanced due diligence.' },
    ],
    timeline: [['Alert created', '08:58:10'], ['Escalated to senior analyst', '09:03:41']],
  },
  {
    id: 'ALT-24068', customer: 'Sundar Import Export', initials: 'SI', segment: 'Commercial banking', country: 'IN',
    trigger: 'Trade finance anomaly', score: 54, risk: 'medium', status: 'Needs review', age: '2h ago', ageMinutes: 120,
    tags: ['trade-based AML', 'invoice variance'], amount: 'INR 2,480,000', analyst: 'Unassigned',
    evidence: [
      { title: 'Invoice variance', body: 'Declared unit value is 31% above the customer\'s six-month corridor baseline.' },
      { title: 'Port pattern', body: 'Counterparty and port combination has appeared in 2 prior low-confidence alerts.' },
    ],
    timeline: [['Alert created', '07:41:02'], ['Trade document parsed', '07:41:08']],
  },
  {
    id: 'ALT-24061', customer: 'Amina Yusuf', initials: 'AY', segment: 'Retail banking · Standard', country: 'KE',
    trigger: 'Dormant account reactivation', score: 32, risk: 'low', status: 'Needs review', age: '3h ago', ageMinutes: 180,
    tags: ['dormant', 'low confidence'], amount: 'KES 185,000', analyst: 'Unassigned',
    evidence: [
      { title: 'Dormancy break', body: 'Account reactivated after 14 months with one inbound transfer.' },
      { title: 'Expected peer behavior', body: 'Activity matches the customer\'s stated seasonal remittance pattern.' },
    ],
    timeline: [['Alert created', '06:58:12'], ['Peer profile matched', '06:58:14']],
  },
];

const STEP_LABELS = [
  'Context stage · customer & peer profile',
  'Pattern stage · transaction graph',
  'Policy stage · rule & jurisdiction check',
  'Decision stage · recommendation + rationale',
];
const ALLOWED_RECOMMENDATIONS = new Set([
  'Escalate for enhanced due diligence',
  'Close as low-confidence activity',
  'Request supporting context before disposition',
]);

let selectedCase = CASES[0];
let lastFocusedElement = null;
let lastFocusedCaseId = null;
let riskFilter = 'all';
let oldestFirst = false;
const investigations = new Map();
const activeRuns = new Map();
const auditEvents = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));
const isTerminal = (status) => status === 'Escalated' || status === 'Resolved';
const safeClone = (value) => JSON.parse(JSON.stringify(value));

function statusClass(status, caseId) {
  if (status === 'Escalated') return 'escalated';
  if (status === 'Resolved') return 'resolved';
  if (activeRuns.has(caseId)) return 'investigating';
  return 'review';
}

function caseRow(item) {
  const displayedStatus = activeRuns.has(item.id) ? 'Investigating' : item.status;
  return `<button type="button" class="queue-row" data-case-id="${escapeHTML(item.id)}" aria-haspopup="dialog" aria-label="Open case ${escapeHTML(item.id)}, ${escapeHTML(item.customer)}, risk ${item.score} out of 100, status ${escapeHTML(displayedStatus)}">
    <span class="case-name"><span class="case-symbol" aria-hidden="true">${escapeHTML(item.initials)}</span><span><b>${escapeHTML(item.customer)}</b><small>${escapeHTML(item.id)} · ${escapeHTML(item.country)}</small></span></span>
    <span class="trigger">${escapeHTML(item.trigger)}<small>${escapeHTML(item.age)}</small></span>
    <span class="risk-score ${escapeHTML(item.risk)}">${item.score}<small> / 100</small></span>
    <span class="status-chip ${statusClass(item.status, item.id)}">${escapeHTML(displayedStatus)}</span><span class="row-arrow" aria-hidden="true">›</span>
  </button>`;
}

function renderQueue() {
  const list = $('#case-list');
  if (!list) return;
  const visible = CASES.filter((item) => riskFilter === 'all' || item.risk === riskFilter);
  visible.sort((a, b) => oldestFirst ? b.ageMinutes - a.ageMinutes : a.ageMinutes - b.ageMinutes);
  list.innerHTML = visible.length
    ? visible.map((item) => `<li>${caseRow(item)}</li>`).join('')
    : '<li class="queue-empty">No synthetic alerts match this risk filter.</li>';
  const riskButton = $('[data-filter="risk"]');
  const sortButton = $('[data-filter="sort"]');
  const queueCount = $('.nav-item[data-view="queue"] em');
  if (queueCount) queueCount.textContent = String(visible.length);
  if (riskButton) {
    const riskLabel = riskFilter === 'all' ? 'All risk' : `${riskFilter[0].toUpperCase()}${riskFilter.slice(1)} risk`;
    riskButton.innerHTML = `${riskLabel} <span aria-hidden="true">⌄</span>`;
    riskButton.setAttribute('aria-label', `Risk filter: ${riskLabel}; activate to cycle`);
  }
  if (sortButton) {
    const sortLabel = oldestFirst ? 'Oldest' : 'Newest';
    sortButton.innerHTML = `${sortLabel} <span aria-hidden="true">⌄</span>`;
    sortButton.setAttribute('aria-label', `Sort order: ${sortLabel}; activate to toggle`);
  }
}

function evidenceMarkup(item) {
  return item.evidence.map((e, index) => `<div class="evidence-item"><span class="evidence-icon" aria-hidden="true">${index === 0 ? '↗' : index === 1 ? '◎' : '⌁'}</span><div><b>${escapeHTML(e.title)}</b><p>${escapeHTML(e.body)}</p></div></div>`).join('');
}

function timelineMarkup(item) {
  return item.timeline.map((event) => `<div class="timeline-item"><div class="timeline-rail"><span class="timeline-dot"></span><span class="timeline-line"></span></div><div><b>${escapeHTML(event[0])}</b><small>${escapeHTML(event[1])} · synthetic demo event</small></div></div>`).join('');
}

function investigationMarkup(item) {
  const result = investigations.get(item.id);
  if (!result) return '';
  const terminal = isTerminal(item.status);
  const actionMarkup = terminal
    ? `<p class="disposition-note">Human disposition in this demo session: <strong>${escapeHTML(item.status)}</strong>. No source-system case was changed.</p>`
    : '<div class="next-actions"><button class="action-button primary" data-action="escalate">Escalate case</button><button class="action-button" data-action="resolve">Mark reviewed</button></div>';
  return `<div class="analysis-result"><div class="recommendation"><span class="rec-icon" aria-hidden="true">✦</span><div><span class="engine-badge">${result.engine === 'model' ? 'MODEL-ASSISTED DRAFT' : 'DETERMINISTIC DEMO'}</span><b>${escapeHTML(result.recommendation)}</b><p>${escapeHTML(result.rationale)}</p><small>Suggested next step only · analyst decision required</small></div></div>${actionMarkup}</div>`;
}

function renderDrawer() {
  const c = selectedCase;
  if (!c) return;
  const scoreColor = c.risk === 'low' ? 'var(--green)' : c.risk === 'medium' ? 'var(--amber)' : 'var(--red)';
  const run = activeRuns.get(c.id);
  const result = investigations.get(c.id);
  const terminal = isTerminal(c.status);
  const buttonText = run ? 'Investigation running…' : result ? 'Investigation complete' : terminal ? `Already ${c.status.toLowerCase()}` : 'Run explainable investigation →';
  $('#drawer-content').innerHTML = `<div class="drawer-eyebrow">CASE WORKSPACE · ${escapeHTML(c.id)}</div>
    <h2 id="drawer-title" class="drawer-title">${escapeHTML(c.customer)}</h2>
    <p class="drawer-subtitle">${escapeHTML(c.segment)} · ${escapeHTML(c.country)} · ${escapeHTML(c.amount)}</p>
    <div class="drawer-tags">${c.tags.map((tag) => `<span class="drawer-tag">${escapeHTML(tag)}</span>`).join('')}</div>
    <div class="case-score"><div class="score-ring" style="--score:${c.score}%;--score-color:${scoreColor}">${c.score}</div><div><b>Composite risk score</b><p>Prioritization signal: <strong style="color:${scoreColor}">${c.risk === 'high' ? 'high' : c.risk === 'medium' ? 'moderate' : 'low'}</strong>. It is not a finding of misconduct. Human review is required.</p></div></div>
    <div class="drawer-section"><h4>WHY THIS CASE?</h4><div class="evidence-list">${evidenceMarkup(c)}</div></div>
    <div class="drawer-section"><h4>EVENT TRACE</h4><div class="timeline">${timelineMarkup(c)}</div></div>
    <div class="investigation-box"><div class="investigation-head"><b>Investigation copilot</b><span class="ai-badge">SYNTHETIC CASE · v0.2</span></div>
      <p class="demo-disclosure">The public GitHub Pages demo uses deterministic demo rules. The optional model-backed endpoint is available only when you run the repository server with a configured key. Never enter real customer data.</p>
      <button id="run-investigation" class="run-button" ${run || result || terminal ? 'disabled' : ''}>${buttonText}</button>
      <div class="agent-steps">${STEP_LABELS.map((label, index) => {
        let stateClass = '';
        if (result || (run && index < run.current)) stateClass = 'done';
        else if (run && index === run.current) stateClass = 'current';
        return `<div class="agent-step ${stateClass}" data-step="${index}"><span class="step-dot"></span>${escapeHTML(label)}</div>`;
      }).join('')}</div>
      ${investigationMarkup(c)}
    </div>
    <div class="copilot"><label class="copilot-label" for="copilot-input">CASE-GROUNDED DEMO Q&amp;A</label><div class="copilot-row"><input id="copilot-input" aria-describedby="copilot-disclosure" placeholder="Why was this alert prioritized?" /><button id="copilot-submit" type="button">Ask</button></div><p id="copilot-disclosure" class="demo-disclosure">Answers use a deterministic pattern against this fictional case; they are not live AI advice.</p><div id="copilot-answer" class="copilot-answer" role="status" aria-live="polite"></div></div>`;
}

function recordAudit(caseId, event, detail) {
  const item = CASES.find((entry) => entry.id === caseId);
  auditEvents.unshift({ at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), caseId, customer: item?.customer ?? 'Unknown case', event, detail });
  if (auditEvents.length > 100) auditEvents.pop();
  if ($('#view-audit')?.classList.contains('active-view')) renderAudit();
}

function renderAudit() {
  const host = $('#audit-events');
  if (!host) return;
  host.innerHTML = auditEvents.length
    ? `<div class="audit-feed">${auditEvents.map((event) => `<article class="audit-event"><time>${escapeHTML(event.at)}</time><div><b>${escapeHTML(event.event)}</b><p>${escapeHTML(event.caseId)} · ${escapeHTML(event.customer)} — ${escapeHTML(event.detail)}</p></div></article>`).join('')}</div>`
    : '<div class="empty-message"><b>No actions yet in this tab.</b><p>Open a synthetic case and run a demo investigation to see session events here.</p></div>';
}

function renderInsights() {
  const host = $('#insights-content');
  if (!host) return;
  const counts = CASES.reduce((totals, item) => ({ ...totals, [item.risk]: totals[item.risk] + 1 }), { high: 0, medium: 0, low: 0 });
  const tagCounts = new Map();
  CASES.forEach((item) => item.tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)));
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  host.innerHTML = `<div class="insight-cards"><article><small>HIGH PRIORITY</small><strong>${counts.high}</strong><p>of ${CASES.length} synthetic examples</p></article><article><small>MEDIUM PRIORITY</small><strong>${counts.medium}</strong><p>of ${CASES.length} synthetic examples</p></article><article><small>LOW PRIORITY</small><strong>${counts.low}</strong><p>of ${CASES.length} synthetic examples</p></article></div><div class="insight-panel"><h3>Example trigger tags</h3><p>Counts below are calculated from the fictional queue, not operational monitoring data.</p><div class="tag-counts">${topTags.map(([tag, count]) => `<span>${escapeHTML(tag)} <b>${count}</b></span>`).join('')}</div></div>`;
}

function setView(view) {
  $$('.nav-item').forEach((item) => {
    const active = item.dataset.view === view;
    item.classList.toggle('active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  $$('.view').forEach((item) => item.classList.toggle('active-view', item.id === `view-${view}`));
  if (view === 'audit') renderAudit();
  if (view === 'insights') renderInsights();
}

function openCase(id) {
  selectedCase = CASES.find((item) => item.id === id) || CASES[0];
  lastFocusedElement = document.activeElement;
  lastFocusedCaseId = lastFocusedElement?.closest('[data-case-id]')?.dataset.caseId ?? null;
  renderDrawer();
  $('#case-drawer').classList.add('open');
  $('#case-drawer').setAttribute('aria-hidden', 'false');
  $('.app-shell').inert = true;
  $('#close-drawer').focus();
  recordAudit(selectedCase.id, 'Case opened', 'Synthetic case details viewed');
}

function closeDrawer() {
  const backdrop = $('#case-drawer');
  if (!backdrop.classList.contains('open')) return;
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  $('.app-shell').inert = false;
  const replacementRow = lastFocusedCaseId ? $('#case-list')?.querySelector(`[data-case-id="${lastFocusedCaseId}"]`) : null;
  const focusTarget = lastFocusedElement?.isConnected ? lastFocusedElement : replacementRow;
  if (focusTarget && !focusTarget.closest('[hidden]')) focusTarget.focus();
}

function localInvestigation(item) {
  const high = item.score >= 75;
  const low = item.score < 50;
  return {
    id: item.id,
    recommendation: high ? 'Escalate for enhanced due diligence' : low ? 'Close as low-confidence activity' : 'Request supporting context before disposition',
    rationale: high
      ? `The strongest signal is ${item.evidence[0]?.title?.toLowerCase() ?? 'the primary trigger'}. The demo links ${item.tags.length} indicators; keep the case in the human review lane.`
      : low
        ? 'The activity is unusual but aligns with the fictional customer peer profile. Preserve the evidence and have an analyst document any review decision.'
        : 'The activity is above the synthetic baseline, but the available demo context is incomplete. Request supporting context before disposition.',
    confidence: high ? 0.91 : low ? 0.86 : 0.74,
    engine: 'demo-rules',
  };
}

function validateInvestigation(candidate, caseId) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null;
  if (candidate.id !== caseId || !ALLOWED_RECOMMENDATIONS.has(candidate.recommendation)) return null;
  if (typeof candidate.rationale !== 'string' || candidate.rationale.length < 1 || candidate.rationale.length > 600) return null;
  if (candidate.confidence !== undefined && (!Number.isFinite(candidate.confidence) || candidate.confidence < 0 || candidate.confidence > 1)) return null;
  return {
    id: caseId,
    recommendation: candidate.recommendation,
    rationale: candidate.rationale,
    confidence: candidate.confidence ?? null,
    engine: candidate.engine === 'model' ? 'model' : 'demo-rules',
  };
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function runInvestigation() {
  const caseAtStart = safeClone(selectedCase);
  const caseId = caseAtStart.id;
  if (activeRuns.has(caseId) || investigations.has(caseId) || isTerminal(caseAtStart.status)) return;

  const token = `${caseId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const previousStatus = caseAtStart.status;
  activeRuns.set(caseId, { token, current: -1 });
  selectedCase.status = 'Investigating';
  recordAudit(caseId, 'Investigation started', 'Four bounded demo stages started; no source case changed');
  renderDrawer();
  renderQueue();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (let index = 0; index < STEP_LABELS.length; index += 1) {
    const active = activeRuns.get(caseId);
    if (!active || active.token !== token) return;
    active.current = index;
    if (selectedCase.id === caseId && $('#case-drawer').classList.contains('open')) renderDrawer();
    if (!reducedMotion) await delay(430);
  }

  let result = null;
  try {
    const response = await fetch(new URL('api/investigate', document.baseURI), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case: { id: caseId } }),
      signal: AbortSignal.timeout(10000),
    });
    if (response.ok) result = validateInvestigation(await response.json(), caseId);
  } catch (_) {
    // The public static deployment intentionally has no model server; use the explicit demo fallback.
  }
  if (!result) result = localInvestigation(caseAtStart);

  const active = activeRuns.get(caseId);
  if (!active || active.token !== token) return;
  activeRuns.delete(caseId);
  investigations.set(caseId, result);
  const originalCase = CASES.find((item) => item.id === caseId);
  if (originalCase?.status === 'Investigating') originalCase.status = previousStatus === 'Investigating' ? 'Needs review' : previousStatus;
  recordAudit(caseId, 'Investigation completed', result.engine === 'model' ? 'Validated model-assisted draft returned' : 'Deterministic synthetic fallback returned');
  renderQueue();
  if (selectedCase.id === caseId && $('#case-drawer').classList.contains('open')) renderDrawer();
  showToast(`${caseId} · ${result.engine === 'model' ? 'model-assisted draft' : 'demo rules'} · human review required`);
}

function askCopilot() {
  const input = $('#copilot-input');
  const answer = $('#copilot-answer');
  if (!input || !answer) return;
  const question = input.value.trim().toLowerCase();
  if (!question) {
    answer.textContent = 'Enter a question about the visible synthetic case.';
    answer.classList.add('show');
    input.focus();
    return;
  }
  const item = selectedCase;
  const evidenceA = item.evidence[0]?.title ?? 'the primary trigger';
  const evidenceB = item.evidence[1]?.title ?? evidenceA;
  let text;
  if (question.includes('why') || question.includes('risk')) {
    text = `This fictional case is prioritized at ${item.score}/100. The visible evidence includes ${evidenceA.toLowerCase()} and ${evidenceB.toLowerCase()}. A score is not proof of misconduct.`;
  } else if (question.includes('next') || question.includes('action')) {
    text = `The demo suggests: ${item.score >= 75 ? 'review source-of-funds evidence and consider enhanced due diligence' : item.score < 50 ? 'check whether the activity matches the stated customer profile' : 'request relevant supporting context before disposition'}. A named analyst must decide.`;
  } else {
    text = `I found ${item.evidence.length} synthetic evidence items for ${item.id}. Try asking “why was this prioritized?” or “what is the next action?”`;
  }
  answer.textContent = text;
  answer.classList.add('show');
  recordAudit(item.id, 'Demo question answered', 'Deterministic case-grounded response shown; question text not retained');
}

function applyDisposition(action) {
  if (!investigations.has(selectedCase.id) || isTerminal(selectedCase.status)) return;
  if (action === 'escalate') {
    selectedCase.status = 'Escalated';
    recordAudit(selectedCase.id, 'Human escalation recorded', 'Analyst selected escalate in this browser session; no source system updated');
    showToast(`${selectedCase.id} marked escalated in this demo session`);
  } else if (action === 'resolve') {
    selectedCase.status = 'Resolved';
    recordAudit(selectedCase.id, 'Human review recorded', 'Analyst marked reviewed in this browser session; no source system updated');
    showToast(`${selectedCase.id} marked reviewed in this demo session`);
  }
  renderDrawer();
  renderQueue();
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function handleFilter(filter) {
  if (filter === 'risk') {
    const levels = ['all', 'high', 'medium', 'low'];
    riskFilter = levels[(levels.indexOf(riskFilter) + 1) % levels.length];
  } else if (filter === 'sort') {
    oldestFirst = !oldestFirst;
  }
  renderQueue();
}

function trapDialogFocus(event) {
  if (event.key !== 'Tab' || !$('#case-drawer').classList.contains('open')) return;
  const focusable = $$('#case-drawer button:not([disabled]), #case-drawer input:not([disabled])');
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderQueue();
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const row = target.closest('[data-case-id]');
    if (row) return openCase(row.dataset.caseId);
    const nav = target.closest('[data-view]');
    if (nav) return setView(nav.dataset.view);
    const open = target.closest('[data-open-case]');
    if (open) return openCase(open.dataset.openCase);
    const filter = target.closest('[data-filter]');
    if (filter) return handleFilter(filter.dataset.filter);
    if (target.id === 'close-drawer' || target.id === 'case-drawer') return closeDrawer();
    if (target.id === 'run-investigation') return runInvestigation();
    if (target.id === 'copilot-submit') return askCopilot();
    const action = target.closest('[data-action]');
    if (action) return applyDisposition(action.dataset.action);
  });
  document.addEventListener('keydown', (event) => {
    trapDialogFocus(event);
    if (event.key === 'Escape') closeDrawer();
    if (event.key === 'Enter' && document.activeElement?.id === 'copilot-input') askCopilot();
  });
});

# SignalFlow — synthetic AML investigation copilot demo

**Project demo:** https://vjoycelyn.github.io/Island-Tales/signalflow/
**Source:** https://github.com/VJoycelyn/Island-Tales/tree/main/signalflow
**Current event context:** Global AI Hackathon by Geek Room. The exact problem statement/track must be selected and incorporated after the official release; see [`HACKATHON_READINESS.md`](./HACKATHON_READINESS.md) and [`GLOBAL_AI_HACKATHON_SUBMISSION.md`](./GLOBAL_AI_HACKATHON_SUBMISSION.md).

SignalFlow is a fictional-data prototype that helps an AML investigator review an alert, inspect supporting evidence, and see a suggested next review step. It demonstrates an evidence-first interface and a human approval gate. It is not an official Azentio product, an operational AML platform, or a validated compliance decision service.

## Current demo

The public GitHub Pages site is a static deployment. It runs in the browser against fictional cases and deterministic demo rules; it does not contact a model service. The Demo Data view supports adding, editing, and removing examples, and restoring the built-in sample. Changes persist in this browser’s localStorage and update the queue totals and risk insights. User-entered examples are never sent to a model endpoint. The app also has a risk filter and queue sort, case workspace, staged investigation display, case-grounded deterministic Q&A, human escalate/review actions, an illustrative playbook, and a session-only in-memory event view. The event view is cleared on refresh and is not an immutable audit trail.

The optional model-backed endpoint is available only when running the Node server locally with an explicitly supplied API key. That endpoint accepts only a server-owned synthetic case ID and ignores caller-supplied case facts. It makes one structured-output model request for a draft recommendation. The four visible investigation stages are a sequence visualization; they are not four separate AI agents. The Q&A widget is deterministic in both the public site and local demo.

## Run locally

Requires Node.js 18 or newer. There are no installed npm runtime dependencies.

```bash
cd signalflow
npm run dev
# open http://127.0.0.1:4173
```

Run `npm test` for automated HTTP/security smoke tests. They exercise the model path against a local mock provider and make no paid external model call or use of a real API key.

For optional model-backed investigation, provide an approved OpenAI-compatible key in the environment before starting the server:

```bash
OPENAI_API_KEY=your_key OPENAI_MODEL=gpt-4o-mini npm run dev
```

The key is read by the local server and is never included in static page assets. The demo server binds to loopback (`127.0.0.1`). Do not expose it to a public network. Never commit API keys or use real customer/production data.

## Technology and AI disclosure

The interface uses HTML, CSS, and vanilla JavaScript. The optional local service uses Node.js built-in HTTP and file-system modules. The AI adapter accepts an OpenAI-compatible chat-completions endpoint; `gpt-4o-mini` is the default model name if a key is configured. If there is no key, if a model request fails, or if a response fails validation, the server uses deterministic fictional-case rules. The static GitHub Pages demo always uses the deterministic fallback.

Manus AI was used as a coding assistant to develop the prototype. The page loads Manrope and DM Mono using Google Fonts. The Node runtime has no third-party package dependency. Update the disclosure if additional team members use other AI models, agents, APIs, or coding tools for the final submission.

## Safety and limitations

All case names, amounts, scores, evidence, timelines, metrics, and charts are synthetic. Risk scores are prioritization examples, not findings of misconduct. Model text is a draft suggestion only. Human users retain the final decision. The session log exists only in browser memory and does not write to an AML source system. The optional server is a local hackathon demo and lacks production SSO, tenant isolation, durable storage, enterprise audit, and deployment controls.

Do not enter or upload real customer, financial, or other confidential data into the public site or an unapproved model service. Any production use would require approved source interfaces, identity/authorization, retention and data-residency decisions, security review, model governance, evaluation, and AML-owner approval.

## Hackathon materials

- [`GLOBAL_AI_HACKATHON_SUBMISSION.md`](./GLOBAL_AI_HACKATHON_SUBMISSION.md) — draft description, problem framing, and AI/tool disclosure; add the exact released prompt and actual team contributions before submitting.
- [`HACKATHON_READINESS.md`](./HACKATHON_READINESS.md) — requirement mapping, open eligibility points, and official sources.
- [`HACKATHON_SUBMISSION.md`](./HACKATHON_SUBMISSION.md) — original Azentio Build Labs concept narrative, retained as provenance and not a Global AI final submission.
- [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) — concise, accurate demo walkthrough.
- [`proposal/AML_Architecture_Tech_Stack_Proposal.md`](./proposal/AML_Architecture_Tech_Stack_Proposal.md) — production architecture proposal; not the running implementation.

## Source structure

- `index.html` — dashboard, responsive case queue, views, and accessible case dialog.
- `style.css` — dark control-room presentation, mobile navigation, focus states, and reduced-motion behavior.
- `app.js` — synthetic case validation/persistence, data CRUD, queue/insight updates, per-case run state, deterministic fallback, demo Q&A, filters, dispositions, and session events.
- `server.mjs` — loopback-only static server and optional synthetic-ID model endpoint with bounded requests and allowlisted files.
- `tests/server.test.mjs` — dependency-free API and static-server tests.
- `manus-routes.json` — static page route declaration.

## Build and reuse note

The initial SignalFlow prototype was built for the separate Azentio.ai Build Labs project in October 2026, before the Global AI Hackathon problem statement release. The event rules expect the core project to be substantially developed during the official event and require original or properly licensed components. The prior prototype is disclosed; confirm reuse eligibility and the required level of new work with organizers, then make a substantive adaptation to the released challenge before submission. Do not claim the existing prototype was newly created after the challenge statement became available.

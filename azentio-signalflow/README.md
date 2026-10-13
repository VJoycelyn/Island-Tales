# SignalFlow — explainable AI for AML investigations

**Hackathon concept for Azentio.ai Build Labs 2026**

SignalFlow is an investigation layer for AML operations. It turns a noisy alert into a reviewable case by combining customer context, peer behavior, transaction patterns, and policy checks, then produces a concise recommendation with evidence and a named human approval gate.

> SignalFlow does not decide that a customer is suspicious. It helps an investigator decide what to review next, why it matters, and what evidence is still missing.

## Why this wedge

The published hackathon brief asks for a working AI-powered solution to a real Azentio problem and evaluates solution quality, technical implementation, innovation, business relevance, and functional demonstration. The specific problem statements are still marked “revealing soon”, so this prototype targets a public Azentio workflow rather than claiming access to private challenge data.

Azentio publicly describes AMLOCK as an AI-powered financial crime and compliance platform spanning KYC, screening, monitoring, risk management, investigations, and regulatory reporting. Its transaction-monitoring materials emphasize reducing false positives and streamlining investigations. SignalFlow is a focused, additive copilot layer for the investigation moment: it makes the reasoning visible, preserves auditability, and keeps the analyst in control.

## Demo flow

1. Open the **Review queue** and select `ALT-24081 — Nadia Rahman`.
2. Show the evidence cards: velocity spike, new beneficiary cluster, and cross-border corridor.
3. Click **Run explainable investigation**. The four-agent trace animates through context, pattern, policy, and decision.
4. Point out the recommendation: **Escalate for enhanced due diligence**. The rationale is short, evidence-linked, and explicitly not an automatic finding.
5. Ask the Copilot: “Why is this alert high risk?” The answer references only the visible case evidence.
6. Click **Escalate case** to show the human gate and audit-friendly disposition.
7. Return to the queue and open the lower-scoring case to show that the same workflow can recommend closure or a request for more context.

## Architecture

```text
Synthetic alert / AMLOCK event
          |
          v
  Case normalizer + evidence store
          |
          v
  Agent graph
  ├── Context agent: customer and peer profile
  ├── Pattern agent: velocity, graph and corridor signals
  ├── Policy agent: rule and jurisdiction checks
  └── Decision agent: explanation + next best action
          |
          v
  Analyst workspace → human disposition → immutable audit event
```

The browser prototype uses synthetic, embedded cases so it is safe to demo without customer data. When run through `server.mjs` with `OPENAI_API_KEY`, the same flow can call an OpenAI-compatible model for the final structured recommendation. If no key is configured, the transparent local fallback runs deterministically; the demo remains functional offline.

## AI and safety disclosure

- **Model role:** summarize evidence and recommend a next review action, not approve/decline a customer or file a regulatory report.
- **Grounding:** the prompt passes the selected synthetic case only. The model is instructed not to invent facts and to state uncertainty.
- **Human-in-the-loop:** every path ends in a named analyst action: escalate, request context, or mark reviewed.
- **Data boundary:** all included records are fictional. Do not upload Azentio or customer-confidential information to public AI services.
- **Auditability:** the UI exposes the evidence, agent stages, recommendation, confidence, and resulting disposition.
- **Production path:** replace the synthetic case adapter with AMLOCK event/API contracts, add tenant-scoped storage, RBAC, policy versioning, model evaluation, PII redaction, and signed audit events.

## Run locally

```bash
cd azentio-signalflow
npm run dev
# open http://localhost:4173
```

Optional model-backed mode:

```bash
OPENAI_API_KEY=your_key OPENAI_MODEL=gpt-4o-mini npm run dev
```

Never commit keys. The app still works without one.

## Files

- `index.html` — dashboard and case workspace markup.
- `style.css` — responsive dark control-room UI.
- `app.js` — queue state, investigation animation, local fallback, Copilot, and human actions.
- `server.mjs` — static server and optional model-backed `/api/investigate` endpoint.
- `package.json` — zero-dependency Node run script.
- `HACKATHON_SUBMISSION.md` — concise submission narrative and judging alignment.
- `DEMO_SCRIPT.md` — 3-minute presenter script.

## Important positioning

This is a hackathon prototype and is **not an official Azentio product**. It uses public product context and synthetic demo data. Claims about business impact are hypotheses to validate with Azentio domain experts and controlled evaluation data; the demo does not claim production readiness or regulatory compliance.

## Sources

- Hackathon brief: https://hackculture.io/hackathons/azentio-ai-build-labs
- Azentio risk and compliance portfolio: https://www.azentio.com/risk-compliance
- Azentio transaction monitoring: https://www.azentio.com/risk-compliance/transaction-monitoring
- Azentio AI-powered AMLOCK announcement: https://www.azentio.com/insights/news-and-announcements/ai-powered-amlock-aml-solution-for-compliance

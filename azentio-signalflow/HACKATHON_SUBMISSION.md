# SignalFlow — submission narrative

## One-line pitch

**SignalFlow is an explainable AI investigation copilot that helps AML analysts move from alert to defensible next action without removing human judgment.**

## The problem

AML teams must investigate large volumes of alerts while preserving evidence, consistency, and regulatory defensibility. A score alone is not enough: analysts need to understand the signal, see what context is missing, and document why a case was escalated or closed. The cost of a weak workflow is not only analyst time; it is inconsistent decisions, repeated work, and harder audits.

## The solution

SignalFlow is a focused investigation layer. It receives an alert and builds a small agent graph:

- **Context agent** assembles customer and peer-profile context.
- **Pattern agent** explains velocity, network, corridor, or document anomalies.
- **Policy agent** checks the relevant rule and jurisdiction context.
- **Decision agent** produces a grounded next-best action with uncertainty.

The analyst sees the evidence and agent trace, asks a case-grounded question, and makes the final disposition. Each action becomes an auditable event.

## What is novel

Most “AI for AML” demos stop at a risk score or a chatbot. SignalFlow is deliberately narrower and more operational: it makes the investigation chain visible. Its value is not autonomous enforcement. Its value is reducing the time between “this alert fired” and “a qualified human can explain what happens next.”

## Working prototype

The prototype includes:

- Prioritized AML review queue with risk, trigger, status, and synthetic customer context.
- Case workspace with evidence cards and event trace.
- Animated multi-agent investigation graph.
- Evidence-grounded Copilot Q&A.
- Human approval gate with Escalate and Mark reviewed actions.
- Local deterministic fallback for safe offline demos.
- Optional OpenAI-compatible structured-output endpoint for model-backed mode.

## Business relevance

SignalFlow is designed to complement the public AMLOCK workflow areas of transaction monitoring, advanced analytics, investigations, and regulatory reporting. It can be introduced as a thin experience layer over existing alerts and case data, avoiding a rip-and-replace implementation. The first measurable pilot hypotheses are:

1. Reduce median alert-to-disposition time.
2. Increase the percentage of decisions with evidence-linked rationale.
3. Reduce avoidable escalations without suppressing high-confidence cases.
4. Improve analyst consistency across similar cases.

These are hypotheses, not claimed production results.

## Technical approach

The demo is zero-dependency HTML/CSS/JavaScript with a Node server. The case adapter is intentionally replaceable. In production, the adapter would read AMLOCK events, retrieve tenant-scoped customer context, call a policy service, and write signed audit events. The model endpoint is constrained to structured JSON, low temperature, synthetic case grounding, and a human review requirement.

## Security and responsible AI

The demo contains no real customer data. The proposed production design includes tenant isolation, field-level redaction, role-based access, prompt-injection filtering on retrieved text, policy-version logging, model/evidence traceability, confidence thresholds, and mandatory human approval for material actions.

## Judging alignment

- **Problem understanding:** targets the operational investigation bottleneck, not “AI” as a novelty.
- **Technical implementation:** functional queue, case graph, optional model endpoint, local fallback, and explicit contracts.
- **Innovation:** transparent agent handoff and evidence-first explanation layer.
- **Business relevance:** aligns with Azentio’s public AML, risk, investigation, and compliance portfolio.
- **Usability:** one focused 3-minute flow for an investigator.
- **Scalability:** replaceable adapter and policy/model boundaries support multiple jurisdictions and workflows.
- **Integrity:** synthetic data, public-source positioning, no claim of official Azentio affiliation.

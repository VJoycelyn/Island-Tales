# SignalFlow — 3-minute demo script

## 0:00–0:25 — Frame the problem

“AML systems are good at surfacing signals. The operational bottleneck is what happens next: an analyst has to reconstruct context, explain the alert, and decide whether the case is worth escalating. SignalFlow is an explainable investigation layer. It does not replace the analyst; it compresses the path to a defensible next action.”

Keep the dashboard visible. Point to the metric cards, especially **18m median time to decision** and the explicit **Human gate active** label. Clarify that metrics are synthetic demo values.

## 0:25–1:00 — Pick a real-looking case

“Let’s open ALT-24081. The alert fired because of rapid movement of funds. Instead of asking the analyst to interpret a single score, SignalFlow presents three evidence threads: a velocity spike, a new beneficiary cluster, and a cross-border corridor.”

Click `Nadia Rahman`. Point to the 79/100 score and say: “This is a prioritization signal, not a finding of misconduct. The human gate is visible before we run anything.”

## 1:00–1:55 — Run the agent graph

Click **Run explainable investigation**.

“As the investigation runs, four specialized steps make the reasoning inspectable: context, pattern, policy, and decision. This is intentionally not one opaque chatbot response.”

When the result appears:

“The recommendation is to escalate for enhanced due diligence. The rationale stays short and links back to the visible evidence. The model is not allowed to invent customer facts, and the final action still belongs to the analyst.”

## 1:55–2:25 — Ask a grounded question

In the Copilot field, type: `Why is this alert high risk?`

“The Copilot answers from this case, not from a generic knowledge base. It explains the score and reminds us that a risk score is not proof of misconduct.”

Optionally ask: `What is the next action?` to show a source-of-funds recommendation.

## 2:25–2:45 — Close the loop

Click **Escalate case**.

“The action is explicit, reversible in the prototype, and ready to become an audit event. The analyst—not the model—owns the disposition.”

## 2:45–3:00 — End with the production path

“SignalFlow can sit over an existing AMLOCK alert and case workflow. The synthetic adapter is replaceable with event APIs, tenant-scoped context, policy versions, and signed audit events. The first pilot would measure time to disposition, evidence-linked rationale, and avoidable escalations. This is a thin, safe layer designed to make intelligence operational.”

## Judge questions to anticipate

**Is this an official Azentio product?** No. It is a hackathon concept built from public Azentio product context and synthetic data.

**Is the AI real?** The UI includes an offline deterministic investigation fallback so the demo is always runnable. Running `npm run dev` with `OPENAI_API_KEY` enables the optional structured model endpoint. The architecture keeps the model constrained and the human decision mandatory.

**What happens with false positives?** SignalFlow does not suppress alerts by itself. It makes the evidence and uncertainty visible so the analyst can close low-confidence cases with a documented rationale, while high-confidence cases remain in the human review lane.

**What is the next build step?** Connect the case adapter to approved AMLOCK events and run a controlled evaluation with redacted historical cases and domain-expert labels.

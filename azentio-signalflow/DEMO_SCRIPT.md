# SignalFlow — accurate 3-minute demo script

**Important:** This is a general walkthrough. Add a clear reference to the selected Global AI Hackathon problem statement after it is released, and materially adapt the demo to that challenge. Do not use this as proof of a problem-statement fit before then.

## 0:00–0:25 — Frame the concept

“SignalFlow is a prototype for organizing synthetic AML alert evidence and preparing a human-reviewed next step. The exact Global AI challenge fit is pending the event's released prompt. The public demo uses fictional data only and does not connect to a bank or an AML source system.”

Point out **Synthetic demo data** and the sample-only metric labels. Do not describe the dashboard metrics as production results.

## 0:25–1:00 — Inspect a sample case

Open `ALT-24081` and say: “This is a fictional case with a rapid-movement trigger. The workspace presents a synthetic velocity spike, new beneficiary cluster, and cross-border corridor. The 79/100 score is a prioritization example, not evidence of misconduct.”

## 1:00–1:50 — Run the workflow

Click **Run explainable investigation**. Point to the four visible steps and say: “These stages make the demo sequence visible. They are not four separate agents. On the public static site, deterministic rules generate the result. If the local server is configured with an approved model key, one structured model call can return the draft recommendation.”

Read the result and emphasize: “This is a suggestion only. An analyst owns every disposition.”

## 1:50–2:15 — Ask a case-grounded demo question

Ask `Why is this alert high risk?` and note: “The Q&A in this prototype is deterministic and uses the fictional case fixture. It is not a live AI chat.”

## 2:15–2:45 — Record a human action

Click **Escalate case** or **Mark reviewed**. Say: “This choice changes the visible demo state and adds a temporary event to the browser-session log. It does not update a case-management system or create a durable audit record.”

Open **Audit trail** to show the recorded event, then **Risk insights** and **Playbooks** to show that both are derived from the included fictional examples.

## 2:45–3:00 — Close honestly

“The repo includes the working static demo, the optional local model endpoint, and automated HTTP/security checks. The existing prototype was originally created for Azentio.ai Build Labs. For Global AI, we will confirm reuse eligibility and adapt the core solution to the official problem statement before presenting a final submission.”

## Questions to anticipate

**Is the public demo using an LLM?** No. The public GitHub Pages build uses deterministic synthetic rules. The repository's optional loopback-only local server can call one OpenAI-compatible model when an operator supplies a key. Invalid or unavailable model results fall back to the rules.

**Are the four steps separate agents?** No. They are visible workflow stages. The optional local model path makes one final structured-output call.

**Are the cases real?** No. Names, amounts, scores, evidence, and events are fictional.

**Does a recommendation take action?** No. A human button changes only transient local demo state. There is no connection to a bank, customer account, regulator, or case system.

**Does this already satisfy the Global challenge?** That cannot be claimed until the official problem statement is available, selected, and reflected in a substantive project adaptation.

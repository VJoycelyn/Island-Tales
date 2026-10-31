# SignalFlow

**Permanent demo:** https://vjoycelyn.github.io/Island-Tales/signalflow/
**Source:** [`signalflow/`](./signalflow/)

The Demo Data view lets reviewers add, edit, and remove synthetic alert examples. Queue totals and risk insights recalculate from the current records. Edits persist in the browser’s localStorage; a reset restores the five built-in examples. Custom examples stay in that browser and are not sent to the optional model endpoint. Use only aliases beginning with “Sample” or “Demo.” Do not enter real customer, account, transaction, or confidential data.

The public GitHub Pages demo uses deterministic rules. The optional model-backed endpoint is local-only and analyzes fixed, server-owned sample cases. This is a hackathon prototype, not an operational AML service.

## Hackathon readiness

The official Global AI Hackathon page lists the prompt/prototype submission window as 1–15 November 2026. The exact challenge and track are not yet published as of 31 October; update the project and submission draft after selecting the released prompt. Team/Discord obligations and organizer confirmation of prior-work eligibility are participant actions that this repository cannot verify.

- [Submission draft](./signalflow/GLOBAL_AI_HACKATHON_SUBMISSION.md)
- [Readiness checklist](./signalflow/HACKATHON_READINESS.md)
- [Three-minute demo script](./signalflow/DEMO_SCRIPT.md)
- [Run locally](./signalflow/README.md#run-locally): `cd signalflow && npm run dev`

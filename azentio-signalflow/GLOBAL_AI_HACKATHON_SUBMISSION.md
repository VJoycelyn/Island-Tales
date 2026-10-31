# Global AI Hackathon — SignalFlow Submission Draft

**Project title:** SignalFlow — Evidence-Grounded AML Investigation Copilot
**Repository:** https://github.com/VJoycelyn/Island-Tales/tree/main/azentio-signalflow
**Working demo:** https://vjoycelyn.github.io/Island-Tales/azentio-signalflow/
**Exact Global AI challenge/track:** Complete after reviewing the official problem statement released for the event.

## Challenge fit — pending official problem statement

The public Global AI Hackathon page says its problem statements and themes are being finalized for release on 1 November 2026. SignalFlow currently addresses AML investigators' need to assemble alert evidence and prepare a defensible next review step. Do not submit this description as a match to a specific Global AI challenge until the released prompt is checked and the project is adapted where needed.

## Problem

Transaction-monitoring alerts can require analysts to gather customer, transaction, screening, and policy context from different places before deciding what to review next. This manual investigation work can slow response and make evidence-linked reasoning harder to document. The goal is to help investigators inspect relevant signals and missing context while keeping the final decision with a human analyst.

## Solution and working prototype

SignalFlow presents a fictional AML alert queue, opens evidence-backed case workspaces, shows a four-stage investigation sequence, and prepares a constrained next-step recommendation. The investigator can ask a deterministic case-grounded demo question and record an escalate or reviewed choice. A session-only audit view records these demo interactions in memory; it is not persistent and does not write to an AML platform.

The public GitHub Pages website is a static demo and uses deterministic synthetic rules. The repository also includes a local Node.js endpoint that can call an OpenAI-compatible model when the operator explicitly supplies a key. The endpoint accepts only fixed, server-owned fictional case IDs and validates the model response. No live customer, transaction, screening, or production data is used.

## How AI is used

When the local Node server is configured with `OPENAI_API_KEY`, the investigation endpoint sends one fixed synthetic case to an OpenAI-compatible chat-completions model and requests structured JSON containing an allowed recommendation and short rationale. The default configured model name is `gpt-4o-mini`; operators can configure a compatible model through `OPENAI_MODEL`. The model call is optional. If no key is supplied, if the static site is used, or if the model returns an invalid response, deterministic synthetic rules provide a clearly labelled demo fallback.

The four visible workflow steps are a staged presentation of the investigation process, not four separately running AI agents. The question-and-answer box in the public demo uses deterministic keyword-based responses and is not a live LLM chat. The model does not approve or close a real case, file a report, freeze funds, or make a customer decision.

## Technologies and tools

The interface uses HTML, CSS, and vanilla JavaScript. The optional local service uses Node.js built-in HTTP and file-system modules, without an installed runtime package dependency. The optional model integration uses an OpenAI-compatible API. The page loads Manrope and DM Mono from Google Fonts when the network permits. The public static site is hosted by GitHub Pages.

Manus AI was used as a coding assistant to help build and test the prototype. The project owner and each team member should update this disclosure if any additional AI models, agents, APIs, or coding tools contributed to the final submission. No third-party code package is currently required by the local runtime.

## Responsible-use and limitations

All included cases and metrics are fictional. The public site is a demonstration, not an official Azentio product, a production AML system, or a validated compliance decision service. Recommendations are review prompts only. An analyst owns every disposition. The browser session audit view is temporary and is not an immutable audit ledger.

## Prior-work disclosure to resolve before submission

The existing SignalFlow prototype was first built for the separate Azentio.ai Build Labs project in October 2026, before the Global AI Hackathon problem statement release. The Global event rules allow pre-existing components and reusable work but say the core project should be developed during the hackathon. The Global event page lists the overall event as beginning 9 October, while the problem-statement/prototype build window opens 1 November. Because the current prototype predates that build window and was created for another event, disclose this history and confirm with the organizers in the official Discord whether adapting it is eligible. Do not describe the existing prototype as newly created after the Global prompt is released.

## Submission checklist

Before submitting, insert the exact problem statement and track; make a visible, substantive adaptation that directly addresses it; verify team size is 1–4 and every member is on only one team; join and monitor the required official Discord; use one submission per team; and confirm whether the dashboard makes a demo video or slide deck mandatory. The provided demo field was not marked required in the supplied screenshot, and the event rules say a video is needed only if required. Do not submit an unrecorded website URL as a video link.

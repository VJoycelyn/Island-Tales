# Archived concept narrative — Azentio.ai Build Labs

**Provenance note:** This document records the original AML concept prepared for the separate Azentio.ai Build Labs event. It is not a final submission for the Global AI Hackathon. The Global challenge statement must be selected and the product adapted before that event's submission.

## One-line concept

**SignalFlow is a synthetic-data AML investigation demo that organizes alert evidence and offers a human-reviewed next-step draft.**

## The problem

AML teams may need to assemble customer, transaction, screening, and policy context before deciding what to review next. A score alone does not explain the signal or what context is missing. The concept aims to make an investigation workflow and evidence-linked rationale easier to inspect, while leaving the disposition to an analyst.

## The solution

SignalFlow is a focused investigator interface. It shows a fictional prioritized queue, case evidence, a four-stage workflow visualization, and a suggested next step. The four stages are a presentation of the investigation process; they are not four separately running AI agents. In the public static website, deterministic sample rules produce the draft. A local Node.js endpoint can optionally call an OpenAI-compatible model on a fixed synthetic case if the operator provides a key.

The case question box uses deterministic keyword-based demo responses. The analyst can mark a case reviewed or escalated in the current browser session. Those choices are not sent to a source system. The session log is transient and is not an immutable audit trail.

## What is novel

The concept focuses on the investigation handoff rather than autonomous enforcement. Its intended value is to put alert context, visible evidence, uncertainty, and a human decision point together in one review flow. This is a design hypothesis, not a measured production result.

## Working prototype

The prototype includes:

- A responsive fictional AML review queue with risk filters and sort order.
- Case workspaces containing synthetic evidence and event traces.
- A staged investigation display with deterministic fallback and optional local model-backed draft.
- Deterministic case-grounded question-and-answer examples.
- Explicit human escalate/review controls and a browser-session event view.
- Synthetic-only risk summary and an illustrative, non-policy playbook.

## Business relevance hypothesis

The original concept was explored against public Azentio AML product context. A possible future pilot, subject to an approved partner environment and integration, could evaluate analyst review time, evidence-linked rationale, and consistency across similar alerts. No production efficiency or accuracy results are claimed.

## Technical approach

The public demo is a static HTML/CSS/JavaScript site on GitHub Pages. The optional local server uses Node.js built-in modules. If configured, one OpenAI-compatible structured-output request generates the recommendation from server-owned synthetic case data. The endpoint validates inputs and output and falls back to deterministic rules when the model is unavailable. The server is loopback-only and is not a production deployment.

## Security and responsible AI

The prototype contains no customer data. No user-provided names, evidence, or free text are forwarded to the optional model endpoint; only known synthetic case IDs are accepted. A model draft does not make a disposition. The UI labels fictional content, shows uncertainty, and requires a human selection. Production use would require an approved data source, identity and authorization, tenant isolation, retention controls, durable signed audit, model governance, evaluation, and compliance-owner approval.

## Original concept alignment

This concept was prepared against Azentio Build Labs' broad AML/investigation context. It is not evidence that it matches a later challenge statement. The Global AI Hackathon is a separate event; its challenge-specific fit and reuse eligibility require review against that event's released prompt and rules.

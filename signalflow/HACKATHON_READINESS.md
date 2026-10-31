# Global AI Hackathon — Project Readiness Review

**Review date:** 31 October 2026
**Project:** SignalFlow — AML investigation copilot concept
**Target event:** Geek Room Global AI Hackathon on HackCulture

## Current readiness

The project can be prepared against the Global AI Hackathon's general submission requirements, but exact challenge fit is **not yet verifiable**: the official event page says problem statements are due to go live on 1 November 2026, and the prototype window runs through 15 November. The existing public demo is an AML investigation concept originally built for the separate Azentio.ai Build Labs event, so it must not be presented as if it were already matched to an unreleased Global challenge. [1] [2]

## General submission requirements

The Global AI page calls for a working project/demo, source code or repository, project description, explanation of the problem, technologies and tools used, explanation of AI use, and a demo video if required. The repo has a working public prototype, source, README, this submission draft, and a demo script. Its live GitHub Pages build uses deterministic synthetic rules; the repository's optional Node server can make a model-backed request only when run locally with an operator-supplied key. The public site itself does not have a deployed model backend. The project documentation now states that distinction and names Manus AI as a coding assistant, HTML/CSS/JavaScript, Node.js, an optional OpenAI-compatible model, and the Google Fonts used by the page. [1]

The user-provided HackCulture dashboard screenshot showed the project title and GitHub URL as required form fields. It showed no required asterisk beside the demo-video link or PPT upload. The official event rules say a video is required only if requested. Check the actual dashboard immediately before submission in case its form configuration changes.

## Compliance checklist

**Working project/demo — prepared.** The public website is available at https://vjoycelyn.github.io/Island-Tales/signalflow/. It uses synthetic cases. Its Node-based fallback and optional model path have automated HTTP tests. It is a prototype, not a production AML deployment.

**Source repository — prepared.** For reviewers, use the subdirectory link https://github.com/VJoycelyn/Island-Tales/tree/main/signalflow so they land directly on the SignalFlow README and source rather than the unrelated repository-root project.

**Project and problem description — prepared, exact challenge fit pending.** The draft explains the AML investigation problem and the proposed product. Replace the generic problem framing with the exact Global AI statement and demonstrate a meaningful adaptation after the official challenge is released.

**Technology and AI disclosure — prepared.** The draft distinguishes the deterministic public static demo from the optional local model endpoint and states that the four visible stages are workflow presentation, not independent agents. Team members should add any AI tools or models they personally used but that are not already listed.

**Video or slide deck — check form.** The supplied dashboard screenshot did not mark these fields as required. A live demo website is not a video URL. Provide a video only if the form or organizers require it.

**Team eligibility and official communications — participant action required.** The Global AI page allows an individual or a team of one to four, restricts each person to one team, and requires joining the official Discord. The project repository does not establish the registered team roster or Discord membership. Verify these directly in the HackCulture account and official Discord. [1]

**Original work / build timing — organizer clarification recommended.** The rules permit existing libraries and reusable components but expect the core project to be substantially developed during the official hackathon. SignalFlow's existing core prototype was created for Azentio.ai Build Labs before Global's problem statement and prototype window opened. Although the Global event's overall dates begin on 9 October, the problem-statement build window starts on 1 November. Disclose the prior work, make a substantive post-release adaptation, and ask the organizers in Discord whether this reuse is eligible. Do not claim the existing core was first created after the prompt release. [1] [2]

**Responsible development — prepared with limitations disclosed.** Only fictional cases are included. No customer or production data should be added. The project discloses that recommendations are non-authoritative and that the local session log is not durable or connected to a source platform. [1]

**One submission per team — participant action required.** Coordinate one final project submission with the registered team. [1]

## Judging alignment after challenge release

The official judging dimensions are innovation, technical execution, problem and potential impact, use of AI, user experience, scalability, and potential. SignalFlow has a working interaction, source repository, synthetic-data controls, and an optional structured LLM endpoint. Its largest present gap for judging is that the public demo uses deterministic logic and the exact Global challenge is not yet known. After release, prioritize a working change that directly addresses the chosen statement; retain accurate AI disclosure and demonstrate actual model-backed behavior only if an approved model service is configured for the demo. [1]

## Official sources

[1]: https://hackculture.io/hackathons/ai-global-hackathon "Global AI Hackathon by Geek Room on HackCulture"
[2]: https://hackculture.io/hackathons/azentio-ai-build-labs "Azentio.ai Build Labs on HackCulture"

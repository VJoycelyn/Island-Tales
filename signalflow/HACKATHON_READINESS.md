# Global AI Hackathon — Project Readiness Review

**Review date:** 31 October 2026
**Project:** SignalFlow — AML investigation copilot concept
**Target event:** Geek Room Global AI Hackathon on HackCulture

## Current readiness

The project can be checked against the Global AI Hackathon's general requirements, but exact challenge fit is **not yet verifiable**: as of 31 October, the official page says the prompt and prototype window open on 1 November and close on 15 November. The existing prototype's separate-event origin is disclosed; obtain organizer confirmation on eligibility and make a substantive prompt-specific adaptation before final submission. [1] [2]

## General submission requirements

The Global AI page calls for a working project/demo, source code or repository, project description, explanation of the problem, technologies and tools used, explanation of AI use, and a demo video if required. The repo has a working public prototype, editable synthetic data, source, README, this submission draft, and a demo script. Its live GitHub Pages build uses deterministic synthetic rules; the repository's optional Node server can make a model-backed request only when run locally with an operator-supplied key. The public site itself does not have a deployed model backend. The project documentation now states that distinction and names Manus AI as a coding assistant, HTML/CSS/JavaScript, Node.js, an optional OpenAI-compatible model, and the Google Fonts used by the page. [1]

The user-provided HackCulture dashboard screenshot showed the project title and GitHub URL as required form fields. It showed no required asterisk beside the demo-video link or PPT upload. The official event rules say a video is required only if requested. Check the actual dashboard immediately before submission in case its form configuration changes.

## Compliance checklist

**Working project/demo — prepared.** The public website is available at https://vjoycelyn.github.io/Island-Tales/signalflow/. It uses synthetic cases. The browser-only Demo Data view supports validated add/edit/remove/reset, persists custom examples in localStorage, and recalculates queue and insight views. User inputs are never sent to the optional model endpoint. A browser smoke test verified create/edit/remove/reset, persistence across reload, invalid-alias rejection, local-only custom-case investigation, and no horizontal overflow at 375px and 768px. The Node fallback and optional model path have automated HTTP tests. It is a prototype, not a production AML deployment.

**Source repository — prepared.** For reviewers, use the subdirectory link https://github.com/VJoycelyn/Island-Tales/tree/main/signalflow so they land directly on the SignalFlow README and source rather than the unrelated repository-root project.

**Project and problem description — prepared, exact challenge fit pending.** The draft explains the AML investigation problem and the proposed product. Replace the generic problem framing with the exact Global AI statement and demonstrate a meaningful adaptation after the official challenge is released.

**Technology and AI disclosure — prepared.** The draft distinguishes the deterministic public static demo from the optional local model endpoint and states that the four visible stages are workflow presentation, not independent agents. Team members should add any AI tools or models they personally used but that are not already listed.

**Video or slide deck — check form.** The supplied dashboard screenshot did not mark these fields as required. A live demo website is not a video URL. Provide a video only if the form or organizers require it.

**Team eligibility and official communications — participant action required.** The Global AI page allows an individual or a team of one to four, restricts each person to one team, and requires joining the official Discord. The project repository does not establish the registered team roster or Discord membership. Verify these directly in the HackCulture account and official Discord. [1]

**Original work / build timing — organizer clarification recommended.** The rules say the core project should be substantially developed during the official event, which runs 9 October–29 November, while the prompt/prototype window is 1–15 November. SignalFlow’s existing core was created for a separate event before the prompt was published. Disclose the prior work, confirm eligibility and the needed level of new work with organizers in Discord, and make a visible, substantive adaptation to the selected challenge. Do not claim the existing core was first created after the prompt release. [1] [2]

**Responsible development — prepared with limitations disclosed.** Only fictional cases are included. No customer or production data should be added. The project discloses that recommendations are non-authoritative and that the local session log is not durable or connected to a source platform. [1]

**One submission per team — participant action required.** Coordinate one final project submission with the registered team. [1]

## Judging alignment after challenge release

The official judging dimensions are innovation, technical execution, problem and potential impact, use of AI, user experience, scalability, and potential. SignalFlow has a working interaction, source repository, validated browser-only synthetic data input/update, and an optional structured LLM endpoint. The main remaining product gaps for judging are the deterministic public AI behavior, the unreleased challenge prompt, and organizer confirmation of prior-work eligibility. After release, prioritize a working change that directly addresses the chosen statement; retain accurate AI disclosure and demonstrate actual model-backed behavior only if an approved model service is configured for the demo. [1]

## Official sources

[1]: https://hackculture.io/hackathons/ai-global-hackathon "Global AI Hackathon by Geek Room on HackCulture"
[2]: https://hackculture.io/hackathons/azentio-ai-build-labs "Azentio.ai Build Labs on HackCulture"

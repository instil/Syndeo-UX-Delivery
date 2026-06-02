# Handover — Syndeo / Platform UX & UI Engagement

## Meta

| Field | Value |
|-------|-------|
| Customer | Syndeo |
| Project | Platform UX & UI Engagement |
| Status | in-discovery |
| Current branch | TBD |
| Active owner | catherineinstil |
| Last updated | 2026-05-26 14:24 by catherineinstil |

---

## For the next person

**The project**
A 23-day UX engagement (two phases with a review break in between) to redesign the Syndeo platform management UI. Instil is producing an HTML/Next.js interactive prototype plus Figma component assets. The goal is to modernise the UI, improve consistency, and help Syndeo move from an enterprise-only product toward one that is accessible to SMB customers without training.

**Source transcripts:**
- `_Transcripts/2026-05-25-kickoff.md` — 52-minute kickoff call, 25 May 2026
- `_Transcripts/2026-05-25-walkthrough.txt` — 1h44m live product walkthrough, 25 May 2026 (Neil screen sharing Syndeo with Dan + Catherine)

**Attendees**
| Name | Organisation | Role |
|------|-------------|------|
| Dan Hurley | Instil | Head of Design |
| Catherine McConalogue | Instil | Designer |
| Jason Karayiannis | Instil | Customer Experience Lead |
| Alan Beck | Syndeo | CTO (technical lead) |
| Neil Mulholland | Syndeo | Product / Engineering |

**Priority areas (stated explicitly)**
1. **Flows tab** — primary focus; where users spend most of their time; includes flow editor + settings panel
2. **Homepage** — "a bit rubbish at the minute" — #2 priority
3. **Settings panel within Flows** — described as "a dump" — needs restructuring
4. **Reports** — visually "quite ugly", big scroll bars — after homepage
5. **Other tabs** — mostly tabular/form pages; once table + form patterns are locked, apply across

**Deliverables agreed**
- Interactive prototype (HTML/Next.js) — primary artefact
- Figma component/pattern assets — for reusable UI components only (not full flow click-throughs)
- Design rationale
- Future recommendations / vision (horizon items, light touch)

---

## Platform structure (from walkthrough)

A map of the Syndeo admin UI as it stands today. Useful for orientation.

### Top-level navigation tabs
| Tab | Status | Notes |
|-----|--------|-------|
| **Home** (Dashboard) | Exists, poor | Charts, Experts widget, Skills widget, Connected Channels |
| **Flows** | Exists, primary | Sub-tabs: All Flows (default landing, confusing), Welcome Flow, other flows |
| **Reports** | Exists, poor | Conversation transcripts, task breakdowns, variables — "very subpar" analytics |
| **AI Workbench** | Exists, declining | Training phrases/intents, LLM config (buried), CSV import |
| **Channels** | Exists | Facebook, WhatsApp, web chat connections |
| **Web** | Exists, partial | Web chat theme + IKEA-specific URL rules — "a mess of a form" |
| **FAQ** | Being deleted | Different flow type, no longer maintained |
| **Languages** | Exists, half-built | Multilingual responses with keys — phase 2 never completed |
| **Schedules** | Exists | Opening hours + holiday overrides — IKEA has 1,100 with no search/filter |
| **Surveys** | Exists | Post-chat rating + free-text surveys |
| **Properties** | Exists, enterprise | Global key-value pairs for multi-environment setups (IKEA only) |
| **Deployments / Transfer** | Exists | Test → production publish, import/export between environments |
| **Settings** | Exists | Bot defaults: exception handling, inactivity timeout, contact centre integration |

### Key concepts / terminology
| Term | Meaning |
|------|---------|
| **Bot / Agent** | Same thing — "AI agent" is the current marketing term |
| **Flow** | A flowchart of tasks — the core build artefact |
| **Task** | A single block/node in a flow (message, question, decision, script, etc.) |
| **Outcome / Intent** | A goal the bot can achieve (e.g. "Check balance") — mapped to a flow |
| **Channel** | An input mechanism (Facebook page, WhatsApp, web chat, voice) |
| **Experts** | Legacy: real contact centre agents. Unused for 5+ years. Still on homepage |
| **Skills** | Legacy: groups of experts. Unused. Still on homepage |
| **Deterministic mode** | Old NLP-based flow execution — fixed paths, training phrases |
| **Flow Guided / GoLLM** | LLM-based execution — outcomes matched by description, LLM handles branching |
| **Segues** | Deterministic tangent flows (e.g. "how much do I owe?" mid-conversation) — being replaced by LLM |
| **Simulator** | In-browser chat test tool — currently bottom-left of flow editor, feels secondary |
| **Test / Production mode** | All saves = test mode; requires explicit "deploy" to push to production |
| **Deploy** | Publish to production — Neil prefers industry term "publish" |
| **LLM instructions** | Free-text field in flow guided mode: rules/context passed to the LLM per task |
| **Entities** | Variable definitions for collecting user input (free text, number with min/max, etc.) |
| **Voice Providers** | Planned concept: configure STT/TTS voice settings once, reuse across flows |

### Flow editor internals
- Library: **JS Plumb** (migrating to **VisuallyJS** — new version, LLM-friendly docs)
- Tasks are fixed size; paths (connections) can be dragged and labelled
- "Organise" button: auto-layouts flow into top-down tree
- Decision tasks open in invalid state (no paths until manually created) — must connect before editing
- Rich text (bold/italic/bullets) used in deterministic mode; **not supported in flow guided mode**
- Mode indicator: not shown in simulator or reports — invisible which mode is active
- Mode toggle: buried in a small "flow behaviour" pop-up (currently labelled inherit/deterministic/flow-guided)

### Original design history
- First UI designed by **Big Motive** (~2019) — just screenshots, no design system or component framework
- Flow editor was added after Big Motive engagement — bolted on, no coherent design rationale
- UI elements are oversized/chunky (inherited from when the product had ~10 screens)
- Everything since 2019 has been ad-hoc by developers with no dedicated design

---

## In flight

- Sandbox access: Neil to provide logins for Dan + Catherine (status unknown — not confirmed post-call)
- Platform walkthrough: booked for 2pm 25 May 2026 (Jason to send invite from Instil side)

---

## Open questions

- What does the Settings panel within Flows contain in full? Alan flagged this needs understanding before redesigning placement
- GoLLM (graph-orchestrated LLM) — UI patterns inconsistent across product; needs investigation
- Is the "getting started" homepage Oliver liked still available to reference? Who has it?
- Voice Providers concept: is productising this in scope for this engagement?
- Multilingual phase 2 (visual tie-in): in scope or out?
- Merging deterministic + flow guided into one seamless experience — Neil open to it; what are the technical constraints from Alan?
- LLM instructions field: any plans to structure it (Neil mentioned wanting to break up "walls of text")?
- Sandbox access confirmed? (Neil invited Dan + Catherine — confirm logins are working)
- Rich text in flow guided mode: is there a plan to support it? Currently silently stripped by LLM

---

## Decisions log

| Date | Decision | Source |
|------|----------|--------|
| 2026-05-25 | Prototype-first approach; Figma for reusable component patterns only, not full flow click-throughs | Kickoff call |
| 2026-05-25 | Flows tab is #1 priority; Homepage is #2 | Kickoff call — Neil Mulholland |
| 2026-05-25 | Daily check-ins preferred; at minimum every other day | Kickoff call — Neil + Alan |
| 2026-05-25 | Lock in table + form page design + flows tab first, then apply across all other tabs | Kickoff call — Neil Mulholland |
| 2026-05-25 | Walkthrough of live product to happen before detailed design work begins | Kickoff call — Alan Beck |
| 2026-05-25 | Future horizon items (agent abstraction, AI-in-UI, LLM analytics) to inform vision but are out of scope for this phase | Kickoff call |
| 2026-05-25 | Redesign is open to major structural changes — not just minor tweaks (unlike previous Instil engagement) | Walkthrough — Neil Mulholland |
| 2026-05-25 | GoLLM / flow guided is the direction for all new customers; deterministic being phased out | Walkthrough — Neil Mulholland |
| 2026-05-25 | Experts + Skills widgets to be removed from homepage (hidden in settings or removed entirely) | Walkthrough — Neil Mulholland |
| 2026-05-25 | Homepage charts to move to Reports section; homepage should show getting started / insights | Walkthrough — Neil Mulholland |
| 2026-05-25 | "Publish" is better terminology than "deploy to production" — Neil open to changing it | Walkthrough — Neil Mulholland |
| 2026-05-25 | LLM config (currently in AI Workbench spanner icon) must move to a more prominent location | Walkthrough — Neil Mulholland (explicit tip) |
| 2026-05-25 | Channels concept stays prominent (needed for bot to work); but is set-and-forget after initial config | Walkthrough — Neil Mulholland |
| 2026-05-25 | FAQ tab being deleted | Walkthrough — Neil Mulholland |

---

## Competitor landscape

Syndeo is losing deals to both of these. Research conducted 2026-05-26.

### Fin (Intercom)
**intercom.com/fin · fin.ai**

| Area | Notes |
|------|-------|
| Target market | Support teams, SMB to mid-market. Explicitly split by use case (service / sales / ecommerce). |
| Onboarding | 14-day free trial, no credit card. Primary CTA is "Start free trial" — fully self-serve. Separate path for "Fin only" (no Intercom required). |
| Core model | Simple 4-step loop: **Train → Test → Deploy → Analyse**. Building blocks: Procedures, Channels, Help Center, Inbox, Copilot. |
| Key UX strengths | "Set up in under an hour" framing. Clear human handoff. Explicit outcome loop. Works with existing helpdesk — low switching cost. |
| Pricing | $0.99 per resolved outcome + seat-based plans (Essential / Advanced / Expert). Transparent public pricing. |
| **Threat to Syndeo** | Speed-to-value and self-serve are the main wedge. SMB customers can get started without a sales process or services engagement. |

---

### Cognigy
**cognigy.com**

| Area | Notes |
|------|-------|
| Target market | Enterprise contact centres. Voice-heavy. Positioned as "AI workforce" for large support operations. |
| Onboarding | Sales-led — primary CTA is "Get a Demo". No public free trial. Demo environment available but not a product signup. |
| Core model | **AI Agent Studio** — visual low-code interface described as collaborative (business users + designers + developers). Concepts: flows, intents, integrations, channels, voice/chat. |
| Key UX strengths | Low-code positioning, prebuilt templates, minimal NLU training required, one-click deployment, live debugging + automated QA. |
| Pricing | Enterprise/contact-only — no public pricing. |
| **Threat to Syndeo** | More comparable on product depth and enterprise positioning. Risk: if Cognigy pushes downmarket, Syndeo is squeezed from both directions. |

---

### Sierra
**sierra.ai**

| Area | Notes |
|------|-------|
| Target market | Enterprise customer service / CX teams. Positioning: "AI superpowers for every customer-facing team." |
| Onboarding | Sales-led — "Book a demo" CTA; no visible self-serve signup or trial. Consultative onboarding. |
| Core model | **Agent Studio** (no-code build/test/manage), **Ghostwriter** (AI assistant that updates workflows/config from natural language), **Live Assist** (human agent copilot with real-time guidance + auto-drafted replies). |
| Key UX strengths | **Ghostwriter** is the standout — natural language → config changes. No-code positioning with enterprise depth. One-click actions in Live Assist. Speed to value without flow-building. |
| Pricing | Quote-based, enterprise only — no public pricing. |
| **Threat to Syndeo** | Ghostwriter is the key differentiator — if users can say "add a step that asks for the order number" and it just works, that makes Syndeo's manual flow-builder feel dated. Raises the bar for what "easy to configure" means. |

---

### Implications for this engagement

- Fin is the most immediate threat for Syndeo's SMB pivot — wins on **simplicity and self-serve**
- Sierra raises the bar on **AI-assisted configuration** — Ghostwriter (natural language → workflow) is the direction the market is heading
- Cognigy is the closest enterprise peer — risk of being squeezed from both directions
- Syndeo's current onboarding (blank slate, no guidance, services-led) is directly exposed against all three
- Key UX gaps to address: **empty states**, **guided first-run experience**, **clearer mental model** for flows/outcomes/channels, **modal reduction**
- All three competitors avoid full-screen modals — side panels and inline editing are the industry norm

---

## Pain points (from transcripts)

| Severity | Pain point | Who stated it |
|----------|-----------|---------------|
| `high` | Flow editor is "clunky" and "annoying to use" | Alan Beck |
| `high` | Settings panel in Flows is "a dump" — "literally just shove stuff here" | Alan Beck |
| `high` | Full-screen modals for everything — "modal hell", 3 modals deep; kills context | Neil Mulholland, Dan Hurley |
| `high` | Product has very little reusable components — "copy paste world", inconsistent across pages | Neil Mulholland |
| `high` | Product requires a training course to use; goal is SMB customers figure it out themselves | Neil Mulholland, Jason Karayiannis |
| `high` | Blank slate onboarding — no guidance, no instructions; SMB users left stranded | Neil Mulholland |
| `high` | Experts + Skills legacy widgets on homepage — unused for 5+ years, actively misleading | Neil Mulholland |
| `high` | LLM config hidden behind a tiny spanner icon in AI Workbench — "deliberately unseeable" | Neil Mulholland |
| `high` | Tabular pages have no search, filter, sort, or pagination (IKEA: 1,100 schedules, one giant unsearchable list) | Neil Mulholland |
| `med` | Flows tab opens on second sub-tab by default, not the first — confusing entry point | Neil Mulholland |
| `med` | Mode indicator absent — simulator and reports don't show whether bot is in deterministic or flow guided mode | Neil Mulholland |
| `med` | Decision tasks open in invalid state when dragged onto canvas; must create paths before editing rules | Neil Mulholland |
| `med` | Simulator is buried at bottom-left of flow editor — feels secondary; should be prominent | Dan Hurley, Catherine McConalogue |
| `med` | Reports are "really quite ugly" with a "big long scroll bar" | Alan Beck |
| `med` | Voice + GoLLM features added but "pigeonholed" — inconsistent UI patterns | Neil Mulholland |
| `med` | UI elements oversized/chunky — toolbar, inputs, margins — too much space given to chrome | Neil Mulholland |
| `med` | Voice provider config repeated per-flow; no central "configure once, reuse" pattern | Neil Mulholland |
| `med` | No voice preview in product — users sent to Google's page; preview doesn't reflect reality | Neil Mulholland |
| `med` | Product is "engineer-centric" — needs abstraction layer for SMB market | Alan Beck, Neil Mulholland |
| `low` | Rich text (bold/italic) not supported in flow guided mode — LLM strips formatting silently | Neil Mulholland |
| `low` | Flow guided mode: descriptions not yet well-used for intent matching — "quite new, quite rough" | Neil Mulholland |
| `low` | "Deploy to production" terminology unfamiliar — industry uses "publish" | Neil Mulholland |
| `low` | User guides not fully up to date | Neil Mulholland |

## Vision direction (Instil team — 25 May catch-up)

The overarching design direction agreed between Dan and Catherine after the walkthrough. This should frame all prototype decisions.

### Core concept: the platform should feel like an intelligent chatbot
Syndeo is a chatbot company — the platform should **practice what it preaches**. Rather than a manual configuration tool, the experience should feel conversational and guided throughout.

**Three-layer vision:**
1. **Landing / homepage** — immediately communicates what Syndeo does and what to do next. No blank slate. No legacy widgets. Clear value proposition from the moment you log in.
2. **AI assistant throughout** — a persistent Syndeo agent that guides users through setup conversationally. Instead of navigating menus and modals, a user can say: *"Hi, I'd like to add Facebook to my IKEA integration"* and be guided through it. Or: *"Create a new flow for a customer who wants to find out their order number"* and have the flow scaffolded automatically.
3. **Progressive complexity** — simple by default for SME users; advanced/technical options available but hidden until needed for enterprise users.

**Why this matters strategically:**
- Syndeo is removing hands-on support for SME customers — this vision fills that gap
- It directly matches (and could leapfrog) Sierra's Ghostwriter feature
- It reframes the platform from a dev tool into a product any business owner could use
- It's the clearest differentiator Syndeo could build

### Design philosophy shift
| From | To |
|------|----|
| Manual configuration | Guided conversation |
| Full-screen modals | Inline / side-panel editing |
| Technical terminology | Plain language throughout |
| Blank slate onboarding | Purposeful first-run experience |
| Separate AI features | Intelligence feels built in |
| Enterprise-only complexity | SME-first, enterprise opt-in |

### Immediate priorities (agreed)
1. Improve homepage — clear value communication, onboarding sequence
2. Streamline flow creation — conversational setup, reduce modal hell
3. Integrate AI assistance throughout (vision horizon — frame in prototype)

### Constraints to keep in mind
- Current architecture and build capabilities will constrain what's shippable in this phase
- Prototype can show the full vision; Neil/Alan will indicate what's technically feasible now vs later
- Balance ambitious UX goals with development reality

---

## Design opportunities (surfaced in walkthrough)

Quick wins and ideas explicitly endorsed by Neil or raised by Dan — useful starting points.

| Area | Opportunity | Source |
|------|------------|--------|
| **Homepage** | Replace charts with "getting started" guide for new users; graduate to insights/alerts for experienced users | Neil (Oliver liked a previous version of this) |
| **Homepage** | Show a live bot simulator as the centrepiece of the homepage | Dan |
| **Homepage** | Remove Experts + Skills widgets entirely or bury in business settings | Neil |
| **Homepage** | Move charts to Reports; surface actionable alerts (e.g. "30% of users hitting this error") | Neil, Dan |
| **Flows — mode** | Consider removing the explicit deterministic/flow-guided toggle; merge into one smart experience | Dan (Neil open to it) |
| **Flows — canvas** | Side-panel editors instead of full-screen modals — keeps flow visible while editing task | Neil (referencing competitors + ChatGPT's approach) |
| **Flows — canvas** | Auto-populate placeholder/suggestion node when a decision task is added (avoids invalid state) | Dan |
| **Flows — simulator** | Promote simulator to a prominent, persistent position — not bottom-left secondary | Dan, Catherine |
| **Flows — simulator** | Show which mode (deterministic / flow guided) is active in the simulator | Neil |
| **Flows — canvas** | Style preview: show a live-styled chatbot widget on the canvas so users see their branding | Dan (Neil endorsed) |
| **LLM config** | Move LLM configuration out of AI Workbench spanner icon into a more prominent, accessible location | Neil (explicit tip #1) |
| **Terminology** | Rename "Deploy to production" → "Publish" throughout | Neil |
| **Voice** | Voice provider: configure STT/TTS settings once, reuse across flows (already planned) | Neil |
| **Voice** | In-product voice preview (play audio sample) — currently sends users to Google | Neil + Dan |
| **Forms / tables** | Establish standard: pagination, search, filter, sort for all tabular views | Neil |
| **Forms / inputs** | Define standard input types, validation states, button states in Figma — give devs a reusable baseline | Neil |

---

## Session log

2026-05-26 15:15 — catherineinstil — vision direction added from Dan + Catherine catch-up (25 May): AI-integrated experience, conversational flow creation, SME-first design philosophy
2026-05-26 14:34 — catherineinstil — competitor research added (Fin/Intercom + Cognigy)
2026-05-26 14:24 — catherineinstil — kickoff brief written from transcript 2026-05-25-kickoff.md
2026-05-26 11:52 — catherineinstil — project created

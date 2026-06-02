# Syndeo Platform UX — Direction Brief
**Prepared by:** Catherine McConalogue & Dan Hurley, Instil  
**Date:** 26 May 2026  
**For:** Neil Mulholland, Syndeo

---

## What we've done so far

Since the kickoff and walkthrough, we have:

- Reviewed both session transcripts in full
- Audited the Syndeo platform structure (tabs, concepts, terminology)
- Researched three key competitors: **Fin (Intercom)**, **Cognigy**, and **Sierra**
- Identified the core pain points and mapped them against what competitors are doing better
- Aligned internally on a design direction

This brief summarises where we've landed and what we'd like your input on before we begin designing.

---

## What we heard from you

A few things stood out clearly from the walkthrough:

- **Flows is the core feature** — but it's fourth in the navigation and hard to use
- **The homepage isn't earning its place** — charts aren't actionable, Experts/Skills are legacy artefacts, and a blank slate greets new users with no guidance
- **Disruptive editing patterns** — full-screen modals interrupt the flow of work and make it easy to lose context
- **The platform was built for your own team and for enterprise** — it assumed handholding. That doesn't work for SMEs doing it themselves
- **The UI is from 2019** — Big Motive's original design wasn't built to accommodate a flow editor, voice, or AI. It shows

---

## What we found in the competitor landscape

| | Fin (Intercom) | Cognigy | Sierra |
|-|---------------|---------|--------|
| **Onboarding** | Self-serve, 14-day trial, "set up in an hour" | Sales-led but polished, prebuilt templates | Sales-led, no-code Agent Studio |
| **Flow editing** | Inline, minimal modals | Side panels, not full-screen | Conversational config via Ghostwriter |
| **AI integration** | Built in throughout | Low-code, AI-assisted | Ghostwriter: natural language → workflow |
| **SME fit** | Strong | Moderate | Emerging |

**The common thread across all three:** they assume users can onboard themselves. Syndeo currently assumes the opposite.

**The standout threat:** Sierra's **Ghostwriter** — users describe what they want in plain language, and the platform builds the workflow. This is the direction the market is heading.

---

## Our proposed direction

### The big idea: Syndeo should feel like a Syndeo bot

You're a chatbot company. The platform should **practice what it preaches**.

Instead of a complex manual configuration tool, the Syndeo platform should feel guided, intelligent, and conversational throughout — the same qualities you're selling to your customers.

**What this looks like in practice:**

**1. A homepage built around an AI assistant**  
The moment a user logs in, they're greeted by a Syndeo assistant — not a blank dashboard. New users get a guided setup experience. Experienced users can jump straight into building by describing what they want:
> *"I want to create a flow for a customer who wants to find out their order number"*

The assistant doesn't just give instructions — it does the work. The user is navigated directly to the Flows screen with the flow already pre-populated and ready to review and edit. The homepage becomes the launchpad, not a dashboard nobody reads. Charts and analytics that don't add value move to Reports.

**2. Conversational assistance throughout**  
The same assistant persists into the flow editor — users can describe changes, add steps, or troubleshoot in plain language at any point, and the platform acts on it. This directly addresses the SME self-service gap — and it's a stronger answer to Sierra's Ghostwriter than anything else on the market, because it's built on Syndeo's own structured flow model.

**3. A flow editor that doesn't lose your place**  
Side-panel editing instead of full-screen modals. A persistent, prominent simulator. A clear visual indicator of which mode you're in (deterministic vs flow guided). Tasks that scaffold themselves when added to the canvas.

**4. Progressive complexity**  
Simple by default for SME users. Advanced options available but hidden until needed. Enterprise power without enterprise friction upfront.

---

## Proposed approach

1. **IA audit + navigation restructure** — map the current platform, identify what to promote, hide, or remove, and propose a simplified navigation structure
2. **Homepage concept** — design the AI assistant-led homepage with guided onboarding and actionable insights for returning users
3. **Flow editor concepts** — side-panel editing, simulator placement, mode indicator, and task scaffolding
4. **Vision screens** — conversational flow creation; the assistant navigating users to a pre-populated Flows screen
5. **Design system components** — inputs, buttons, tables, validation states in Figma for dev handoff

We'll check in regularly and flag anything that needs a decision before we get too far down a path.

---

*Questions or thoughts? Drop us a message and we'll pick it up on our next check-in.*

# Syndeo Meeting Summary — 27 May 2026 | 4pm
**Attendees:** Catherine McConalogue (Instil), Neil Mulholland (Syndeo)

---

## ✅ Strong Alignment

### 1. AI Assistant-Led Homepage
- **Neil's response:** "On the roadmap" and can be "front and centre once it's ready"
- Likes it as a **navigational assistant** + living user guide/knowledge base
- Can answer "How do I do this?" questions inline
- **Status:** Approved concept, waiting for backend readiness

### 2. Simplified Navigation
- Both agreed current UI is **"icon hell"**
- Flows tabs can be consolidated and grouped logically:
  - Surveys together
  - Languages/responses together  
  - Settings/properties/events under defaults
- **Next step:** Neil to send logical groupings for consolidation

### 3. Flow Editor Side Panels
- Full agreement to replace full-screen modals with side panels
- Keep visual context (gray out non-edited elements)
- Selected items stay in color to show editing state
- **Status:** Approved approach

### 4. UI Polish & Component Restyling
- Flow builder blocks can be restyled
- Neil acknowledges it's "slightly challenging" but "not impossible"
- Most edits happen in one text box — 90% of activity in minimal real estate
- **Status:** Approved for redesign

### 5. Simulator Enhancements
- Reflect actual client branding (IKEA example mentioned)
- Chat can be hosted within client sites for pre-deployment testing
- **Complexity:** Voice + chat modes need UI solution (still exploring)

---

## ⚠️ Concerns/Open Questions

### 1. Voice Simulator Complexity
- Neil: "I don't know how to have both voice and chat or make swap between modes"
- Needs design exploration for dual-mode interface
- Neil shared demo screenshot with sign waves, transcript, DTMF keypad

### 2. Timing Constraints
- **Neil:** Off next week (vacation)
- **Catherine:** Maternity leave starts next Thursday
- **Gap:** Handover call planned for Monday after Neil returns (~2 weeks)
- New designer to be onboarded to replace Catherine

### 3. Multiple Client Styles
- Simulator branding: clients can have multiple looks
- Complexity in setting defaults that reflect actual deployments

---

## 📋 Next Steps

### Catherine/Instil to Deliver:
1. ✅ Written summary of today's discussion (this document)
2. Continue Slack communication (Neil adding Alan + team members)
3. Explore voice call simulator UI concepts
4. Dan to discuss "deterministic flow guided" concepts with team

### Neil to Provide:
1. Logical groupings/subdivisions of flows tabs for consolidation
2. Add Syndeo team members to Slack channel

### Upcoming Timeline:
- **Design sprint deliverable:** 2 weeks → "here it is, go and make it"
- **Handover meeting:** Monday after Neil's vacation
- **Neil's work:** Initial implementations during break to test what feels "awkward or clunky"

---

## 🎯 Key Outcomes

✅ **All major proposals approved:**
- AI assistant homepage
- Navigation simplification  
- Side-panel editing
- UI modernization
- Progressive complexity (SMB vs Enterprise)

✅ **No major pushback** — collaborative and constructive tone throughout

✅ **Clear handover plan** despite scheduling constraints

---

## 📊 Design Decisions Validated

### Homepage Prototype
- Two-column layout (2/3 assistant, 1/3 analytics) ✅
- Quick actions for draft flows ✅
- Connected channels visible ✅
- No scrolling needed ✅

### Flow Editor Direction
- Side panels over modals ✅
- Visual state indicators ✅
- Simulator prominence ✅

### Progressive Complexity
- Hide advanced features for SMBs ✅
- Enterprise capabilities available but not forced ✅
- Conversational guidance for self-serve ✅

---

## 💬 Notable Quotes

**Neil on current state:**
> "It's an icon hell, I think is what the words Dan used to describe it at the minute."

**Neil on AI assistant:**
> "I like the idea of a navigational assistant... Even as a living user guide, help docs, knowledge base kind of thing."

**Catherine on dual experience:**
> "For smaller businesses, it would be better to have more of a guided journey."

**Neil on practical implementation:**
> "90% of the edits happen in one text area, and the rest of it is just stuff that's set once."

---

## Action Items Summary

| Owner | Action | Deadline |
|-------|--------|----------|
| Catherine | Deliver this summary doc | ✅ Done |
| Neil | Send flows tab groupings | This week |
| Neil | Add team to Slack | This week |
| Design team | Explore voice simulator UI | Next 2 weeks |
| Dan | Discuss deterministic concepts | Next 2 weeks |
| Instil | Prepare handover materials | Before Catherine's leave |
| All | Handover meeting | Monday after Neil returns |

---

**Overall Assessment:** Meeting was highly successful. Neil is aligned with all major proposals, no significant blockers identified, and clear path forward established despite scheduling complexity.

---

## 📎 Follow-Up: Flows Sidebar Structure

**Received:** 27 May 2026 (post-meeting)

Neil provided the logical groupings for consolidating the Flows sidebar navigation:

### Proposed Structure:

**Flows**
- Flow Types
- Welcome
- Outcomes
- Steps
- Web Events
- ~~FAQ~~ (to be removed)
- ~~Global Segues~~ (to be removed)

**Multi-Lingual**
- Languages
- Responses

**Scripting**
- Properties
- Events

**Surveys**
- Surveys
- Survey Selector

**Defaults/Settings**
- Default Messages
- Settings

**Total:** 4 main groups + core Flows section | 14 active items + 2 deprecated

**See detailed analysis:** `flows-sidebar-structure-proposed.md`

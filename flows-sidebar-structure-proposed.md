# Flows Sidebar — Proposed Structure
**Source:** Neil Mulholland  
**Date:** 27 May 2026  
**Context:** Post-meeting follow-up — logical groupings for navigation consolidation

---

## Proposed Hierarchy

### **Flows**
- Flow Types
- Welcome
- Outcomes
- Steps
- Web Events
- ~~FAQ~~ *(to be removed)*
- ~~Global Segues~~ *(to be removed)*

### **Multi-Lingual**
- Languages
- Responses

### **Scripting**
- Properties
- Events

### **Surveys**
- Surveys
- Survey Selector

### **Defaults/Settings**
- Default Messages
- Settings

---

## Structure Notes

**4 main groups + core Flows section:**
1. **Flows** — Primary flow building (6 active items, 2 being deprecated)
2. **Multi-Lingual** — Language management (2 items)
3. **Scripting** — Advanced configuration (2 items)
4. **Surveys** — Survey management (2 items)
5. **Defaults/Settings** — Bot-level configuration (2 items)

**Total items:** 14 active + 2 being removed = 16 current

**Deprecated items:**
- FAQ — Different flow type, no longer maintained
- Global Segues — Being replaced by LLM in flow-guided mode

---

## Design Considerations

### Grouping Benefits:
- Reduces visual clutter from flat list of 16 items
- Creates logical task-based navigation
- Separates beginner (Flows) from advanced (Scripting, Multi-Lingual)
- Aligns with progressive disclosure principle

### Potential Patterns:
- **Collapsible sections** — Each group can expand/collapse
- **Icons per group** — Visual anchors for quick scanning
- **Badge counts** — Show active surveys, languages, etc.
- **Contextual visibility** — Hide advanced sections for SMB users

### Open Questions:
- Should "Welcome" live under "Flow Types" or at Flows level?
- Can "Outcomes" and "Steps" be combined into one view?
- Should "Settings" be promoted to top-level for quick access?

---

## Comparison to Current State

**Before (flat navigation):**
- All Flows
- Welcome Flow
- [Individual flows...]
- Reports
- AI Workbench
- Channels
- Web
- FAQ
- Languages
- Schedules
- Surveys
- Properties
- Deployments
- Settings

**After (grouped sidebar within Flows tab):**
- Cleaner top-level navigation (fewer tabs)
- Logical groupings within Flows
- Deprecated features clearly marked for removal
- Scalable structure as features grow

---

**Next Step:** Design visual mockups showing grouped sidebar with collapsible sections

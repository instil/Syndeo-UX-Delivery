# Syndeo Design System

> This file defines the rules for building UI in the Syndeo platform prototype.
> All AI tools and developers working on this project should follow these guidelines.

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (via `components/ui/`)
- **Icons:** lucide-react
- **Language:** TypeScript

---

## Colour Palette

These are the core Syndeo brand colours. Use these exact hex values — do not substitute with Tailwind defaults.

| Token | Hex | Usage |
|---|---|---|
| Primary blue | `#2F8FFF` | Buttons, active nav, links, highlights |
| Primary hover | `#1E7FEF` | Hover state on primary blue |
| Primary light | `#E8F0FB` | Active nav background, hover backgrounds, badges |
| Page background | `#F6F8FA` | Main page/app background |
| White | `#FFFFFF` | Cards, sidebar, header |
| Border | `#E8F0FB` | All borders (cards, dividers, sidebar) |
| Text dark | `#3B4760` | Headings, primary body text |
| Text mid | `#6A738A` | Secondary text, nav inactive, labels |
| Text light | `#94A3B8` | Placeholder text, disabled states |
| Success green | `#10B981` | Status indicators, notifications dot |
| Destructive red | `oklch(0.577 0.245 27.325)` | Error states, destructive actions |

---

## Typography

- **Font:** Geist Sans (`--font-sans`)
- **Mono font:** Geist Mono (`--font-mono`)

| Use | Class |
|---|---|
| Page title | `text-3xl font-bold text-[#3B4760]` |
| Section heading | `text-xl font-semibold text-[#3B4760]` |
| Card title | `text-base font-semibold text-[#3B4760]` |
| Body text | `text-sm text-[#3B4760]` |
| Secondary/label | `text-sm text-[#6A738A]` |
| Small/caption | `text-xs text-[#6A738A]` |

---

## Spacing & Layout

- **Page padding:** `px-6 py-8` (handled by container in each page)
- **Container:** `container mx-auto px-6`
- **Card padding:** `p-6`
- **Sidebar width:** `w-64` (fixed)
- **Header height:** `h-16`
- **Border radius:** `--radius: 0.625rem` (use `rounded-lg` for cards, `rounded-full` for avatars/pills)
- **Gap between cards:** `gap-6`
- **Gap between nav items:** `gap-6`

---

## Components

### Header (`components/header.tsx`)
- White background, bottom border `border-[#E8F0FB]`
- Logo on left, nav in centre, user controls on right
- Active nav item: `text-[#2F8FFF]` with `after:` underline `after:h-0.5 after:bg-[#2F8FFF]`
- Inactive nav item: `text-[#6A738A] hover:text-[#2F8FFF]`
- Configuration is a dropdown with: Web, Integrations, Deployments, Transfer, Business Configuration

### Cards
```tsx
<div className="bg-white border border-[#E8F0FB] rounded-lg p-6">
```
- No shadow by default — use `shadow-sm` only when elevated/interactive

### Sidebar (pages with left nav — Flows, AI Workbench)
```tsx
<div className="w-64 bg-white border-r border-[#E8F0FB] min-h-[calc(100vh-64px)]">
```
- Active item: `bg-[#E8F0FB] text-[#2F8FFF] border-l-4 border-[#2F8FFF]`
- Inactive item: `text-[#6A738A] hover:bg-[#F6F8FA] hover:text-[#3B4760]`

### Buttons
- **Primary:** `bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white`
- **Secondary/outline:** `border border-[#2F8FFF] text-[#2F8FFF] hover:bg-[#E8F0FB]`
- **Ghost:** `text-[#6A738A] hover:bg-[#E8F0FB] hover:text-[#3B4760]`
- **Destructive:** `text-red-500 hover:bg-red-50`

### Badges
- Default: `bg-[#E8F0FB] text-[#2F8FFF] text-xs px-2 py-0.5 rounded-full`
- Published: `text-xs text-[#6A738A]` with "Published by Syndeo" label

### Tables
- Header row: `bg-[#F6F8FA] text-xs font-medium text-[#6A738A] uppercase tracking-wide`
- Body rows: `border-b border-[#E8F0FB]`, hover: `hover:bg-[#F6F8FA]`
- Cell text: `text-sm text-[#3B4760]`

---

## Page Structure

### Pages with sidebar (Flows, AI Workbench)
```tsx
<div className="flex h-[calc(100vh-64px)]">
  <aside className="w-64 bg-white border-r border-[#E8F0FB] ...">
    {/* sidebar nav */}
  </aside>
  <main className="flex-1 overflow-auto bg-[#F6F8FA] p-6">
    {/* page content */}
  </main>
</div>
```

### Standard pages (Reports, Channels, AI Agents)
```tsx
<div className="min-h-screen bg-[#F6F8FA]">
  <Header />
  <main className="container mx-auto px-6 py-8">
    {/* page content */}
  </main>
</div>
```

---

## Navigation Structure

| Label | Route | Notes |
|---|---|---|
| Home | `/` | Dashboard |
| Reports | `/reports` | Analytics |
| AI Agents | `/ai-agents` | Agent marketplace by vertical |
| Flows | `/flows` | Visual flow builder with sidebar |
| AI Workbench | `/ai-workbench` | Intent training table |
| Configuration | dropdown | Web, Integrations, Deployments, Transfer, Business Configuration |
| Integrations | `/integrations` | Under Configuration dropdown |

---

## Flows Sidebar Navigation

| Item | Icon (lucide) |
|---|---|
| Welcome | `House` |
| Outcomes | `Target` |
| Web Events | `Globe` |
| FAQ | `CircleHelp` |
| Global Segues | `Share2` |
| Languages | `Languages` |
| Responses | `MessageSquare` |
| Default Messages | `Mail` |
| Settings | `Settings` |
| Properties | `SlidersHorizontal` |
| Events | `Zap` |
| Surveys | `ClipboardList` |

---

## Key Components (Dan's source)

All reusable components live in `components/`. Do not duplicate — import and extend.

| File | Purpose |
|---|---|
| `header.tsx` | Global top navigation |
| `flow-builder.tsx` | Flows canvas builder |
| `flow-canvas.tsx` | Visual node canvas |
| `flows-workspace.tsx` | Flows page layout wrapper |
| `simulator.tsx` | Chat simulator widget |
| `compact-simulator.tsx` | Compact simulator variant |
| `agent-card.tsx` | AI Agent card in marketplace |
| `agent-modal.tsx` | Agent detail modal |
| `faq-view.tsx` | FAQ section in Flows |
| `responses-view.tsx` | Responses section |
| `settings-view.tsx` | Settings section |
| `channel-breakdown.tsx` | Channel analytics |
| `connected-channels.tsx` | Connected channels list |
| `outcomes-list.tsx` | Outcomes in Flows |
| `welcome-view.tsx` | Welcome/splash screen |
| `ui/*` | shadcn/ui primitives |

---

## Do's and Don'ts

✅ Use the exact Syndeo hex colours — not Tailwind colour names like `blue-500`  
✅ Use `lucide-react` for all icons  
✅ Use shadcn/ui components from `components/ui/` for forms, modals, dropdowns  
✅ Keep cards white on a `#F6F8FA` page background  
✅ Use `border-[#E8F0FB]` for all dividers and card borders  

❌ Don't use dark mode variants — this is a light-mode only product  
❌ Don't add drop shadows unless specifically needed for elevation  
❌ Don't use rounded corners larger than `rounded-lg` (0.625rem)  
❌ Don't create new UI primitives — extend existing ones in `components/ui/`

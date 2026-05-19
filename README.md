# Syndeo

Multi-channel conversational AI management platform.  
UX redesign project by [Instil](https://instil.co) for [Syndeo](https://syndeo.cx).

## Getting Started

```bash
git clone https://github.com/catherineinstil/Syndeo.git
cd Syndeo/app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                        # Next.js 16 prototype (main working directory)
  app/                      # Pages (App Router)
    page.tsx                # Home / Dashboard
    flows/                  # Flows builder
    ai-agents/              # AI Agent marketplace
    ai-workbench/           # Intent training workbench
    channels/               # Channel management
    reports/                # Analytics & reporting
    integrations/           # Integrations (under Configuration)
  components/               # Reusable React components
    ui/                     # shadcn/ui primitives
    header.tsx              # Global navigation
    flow-builder.tsx        # Flow canvas builder
    simulator.tsx           # Chat simulator widget
    agent-card.tsx          # AI Agent card
    ...                     # See design.md for full component map
  styles/
    globals.css             # Tailwind + Syndeo design tokens

design.md                   # ⭐ Design system rules — read this first
prototype/                  # Reference assets (HTML snapshots from v0)
references/                 # Local-only PDFs (gitignored)
```

## Design System

See [`design.md`](./design.md) for the full design system including colour palette, typography, spacing, component patterns, and do's & don'ts.

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [lucide-react](https://lucide.dev) for icons
- TypeScript

## Prototype Reference

The original v0 prototype by Dan Hurley: [v0-syndeo-two.vercel.app](https://v0-syndeo-two.vercel.app)

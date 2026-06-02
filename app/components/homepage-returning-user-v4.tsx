"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight, Calendar, CheckCircle2, ChevronRight,
  MapPin, MessageSquare, Package, RotateCcw,
  Send, ShoppingCart, Sparkles, TrendingUp, Truck, Zap,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type AgentKey = "default" | "stock-check" | "abandoned-cart" | "order-tracking"
type ChatMessage = { role: "user" | "bot"; text: string }

// ── Chat data ─────────────────────────────────────────────────────────────────

const AGENT_SIMULATOR: Record<AgentKey, { title: string; welcome: string; chips: string[] }> = {
  "default": {
    title: "Live IKEA Chat Simulator",
    welcome: "Hej! I'm Billie, your IKEA virtual assistant. How can I help you today?",
    chips: ["📦 Manage your Order", "📄 Case Status", "🔧 Spare Parts", "💥 Damaged Item"],
  },
  "stock-check": {
    title: "Stock Check Agent",
    welcome: "Hi! I can check if any IKEA product is in stock online or at your nearest store. What are you looking for?",
    chips: ["Check a product", "Is BILLY bookcase in stock?", "Find nearest store stock", "Check online availability"],
  },
  "abandoned-cart": {
    title: "Abandoned Cart Agent",
    welcome: "Hey! I noticed you left some items in your basket. Want to pick up where you left off?",
    chips: ["Show my basket", "Apply a discount", "Help me decide", "Save for later"],
  },
  "order-tracking": {
    title: "Order Tracking Agent",
    welcome: "Hello! I can give you a live update on any IKEA order. Do you have your order number handy?",
    chips: ["Track my order", "Where is my delivery?", "Change delivery date", "Contact courier"],
  },
}

const BOT_REPLIES: Record<string, string> = {
  "📦 Manage your Order": "Sure! Please provide your order number and I'll pull up the details for you.",
  "📄 Case Status": "I can help with that. Could you share your case reference number?",
  "🔧 Spare Parts": "I can help you find spare parts. What product are you looking for parts for?",
  "💥 Damaged Item": "I'm sorry to hear that. Can you describe the damage and share your order number?",
  "Check a product": "Sure! Which product would you like to check availability for?",
  "Is BILLY bookcase in stock?": "Let me check that for you… The BILLY bookcase in white is currently in stock at your nearest store and available online. Would you like to reserve one?",
  "Find nearest store stock": "I can help with that. Could you share your postcode so I can find your nearest IKEA store?",
  "Check online availability": "I'll check our online store for you. Which item are you interested in?",
  "Show my basket": "Here's what you left behind: KALLAX shelf unit (×1), LACK side table (×2). Would you like to complete your order?",
  "Apply a discount": "I can check if there are any available offers for the items in your basket. One moment…",
  "Help me decide": "Of course! Which item are you unsure about? I can share more details, reviews, or alternatives.",
  "Save for later": "Done — I've saved your basket. You can come back anytime and pick up where you left off.",
  "Track my order": "Please share your order number and I'll get the latest status for you right away.",
  "Where is my delivery?": "I can look into that. Could you provide your order number or the email address used at checkout?",
  "Change delivery date": "I can help you reschedule. What date works best for you? Please note changes must be made 48 hours before delivery.",
  "Contact courier": "I'll connect you with the courier. Your delivery is with DHL — shall I share their tracking link or arrange a callback?",
}

const DEFAULT_BOT_REPLY = "Thanks for your message! Let me look into that for you. Could you provide a bit more detail so I can help?"

// ── Opportunity data ──────────────────────────────────────────────────────────

const OPPORTUNITIES = [
  {
    id: "stock-check",
    icon: Package,
    accentColor: "#2F8FFF",
    accentBg: "rgba(47,143,255,0.08)",
    accentBorder: "rgba(47,143,255,0.22)",
    title: "Stock Availability Queries",
    problem: "742 customer enquiries about stock availability this month",
    stat: "742",
    statLabel: "enquiries / month",
    impact: "Reduce contact centre demand and improve customer self-service.",
    agentKey: "stock-check" as AgentKey,
    agentLabel: "Stock Check Agent",
  },
  {
    id: "abandoned-cart",
    icon: ShoppingCart,
    accentColor: "#F59E0B",
    accentBg: "rgba(245,158,11,0.08)",
    accentBorder: "rgba(245,158,11,0.22)",
    title: "Abandoned Cart Recovery",
    problem: "1,245 customers left without completing their purchase this month",
    stat: "£28k",
    statLabel: "potential recovery / month",
    impact: "Re-engage customers at the right moment and recover lost revenue.",
    agentKey: "abandoned-cart" as AgentKey,
    agentLabel: "Abandoned Cart Agent",
  },
  {
    id: "order-tracking",
    icon: Truck,
    accentColor: "#A64E8D",
    accentBg: "rgba(166,78,141,0.08)",
    accentBorder: "rgba(166,78,141,0.22)",
    title: "Order Tracking Requests",
    problem: "2,103 order status queries submitted in the last 7 days",
    stat: "2,103",
    statLabel: "queries this week",
    impact: "Automate 85% of tracking queries, saving 280 agent hours per month.",
    agentKey: "order-tracking" as AgentKey,
    agentLabel: "Order Tracking Agent",
  },
  {
    id: "appointment",
    icon: Calendar,
    accentColor: "#10B981",
    accentBg: "rgba(16,185,129,0.08)",
    accentBorder: "rgba(16,185,129,0.22)",
    title: "Appointment Scheduling",
    problem: "412 callback requests handled manually by agents each month",
    stat: "412",
    statLabel: "manual callbacks / month",
    impact: "Automate scheduling and reduce customer wait times significantly.",
    agentKey: "default" as AgentKey,
    agentLabel: "Appointment Scheduler",
  },
]

const PRIORITIES = [
  { rank: 1, name: "Stock Check Agent", interactions: "1,247", agentKey: "stock-check" as AgentKey },
  { rank: 2, name: "Abandoned Cart Agent", interactions: "1,245", agentKey: "abandoned-cart" as AgentKey },
  { rank: 3, name: "Order Tracking Agent", interactions: "2,103", agentKey: "order-tracking" as AgentKey },
  { rank: 4, name: "Appointment Scheduler", interactions: "412", agentKey: "default" as AgentKey },
]

const AI_RECS = [
  {
    text: "Add a Stock Check Agent to reduce product availability enquiries by up to 60%",
    action: "Install Agent",
    agentKey: "stock-check" as AgentKey,
    agentId: "stock-check",
  },
  {
    text: "Introduce an Abandoned Cart Agent to recover an estimated £28k in lost revenue this month",
    action: "Install Agent",
    agentKey: "abandoned-cart" as AgentKey,
    agentId: "abandoned-cart",
  },
  {
    text: "Connect your CRM data to improve personalisation across all agent interactions",
    action: "Configure",
    agentKey: null,
    agentId: null,
  },
]

const AGENT_LIBRARY = [
  { id: "abandoned-cart", icon: ShoppingCart, label: "Abandoned Cart", desc: "Re-engage customers who left without purchasing.", agentKey: "abandoned-cart" as AgentKey },
  { id: "stock-check", icon: Package, label: "Stock Check", desc: "Instant product availability and store stock lookup.", agentKey: "stock-check" as AgentKey },
  { id: "appointment", icon: Calendar, label: "Appointment Scheduler", desc: "Automate callback and booking requests.", agentKey: "default" as AgentKey },
  { id: "order-tracking", icon: Truck, label: "Order Tracking", desc: "Real-time order status and delivery updates.", agentKey: "order-tracking" as AgentKey },
  { id: "branch-locator", icon: MapPin, label: "Branch Locator", desc: "Help customers find their nearest store.", agentKey: "default" as AgentKey },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function HomepageReturningUserV4() {
  const router = useRouter()
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeAgent, setActiveAgent] = useState<AgentKey>("default")
  const [installedAgents, setInstalledAgents] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const loadAgent = (key: AgentKey) => {
    setActiveAgent(key)
    setMessages([])
    setChatInput("")
    setIsTyping(false)
  }

  const installAgent = (agentKey: AgentKey, agentId: string) => {
    setInstalledAgents(prev => new Set(prev).add(agentId))
    loadAgent(agentKey)
  }

  const handleChatSend = (text?: string) => {
    const msg = (text ?? chatInput).trim()
    if (!msg) return
    setChatInput("")
    setMessages(prev => [...prev, { role: "user", text: msg }])
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { role: "bot", text: BOT_REPLIES[msg] ?? DEFAULT_BOT_REPLY }])
    }, 1400)
  }

  const handleChatKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleChatSend() }
  }

  const sim = AGENT_SIMULATOR[activeAgent]

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#272C41]">
      <div className="container mx-auto h-full px-6 py-5">
        <div className="grid h-full grid-cols-12 gap-6">

          {/* ── Left: scrollable content ────────────────────────────── */}
          <div className="col-span-8 overflow-y-auto pr-3 space-y-8 pb-6"
            style={{ scrollbarWidth: "none" }}>

            {/* Hero */}
            <div className="relative pt-2">
              <div className="pointer-events-none absolute -top-10 left-1/3 h-[280px] w-[480px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,143,255,0.16)_0%,transparent_70%)] blur-3xl" />
              <div className="relative z-10">
                <div className="mb-4 inline-flex items-center gap-2">
                  <span
                    className="block w-4 bg-[#2F8FFF]"
                    style={{ height: "3px", animation: "spin-pause 2.4s linear infinite" }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Syndeo Agent</span>
                </div>
                <h1 className="text-5xl font-light tracking-tight text-white mb-3">
                  Automation Opportunities
                </h1>
                <p className="text-white/45 text-base font-light max-w-xl">
                  {"We've identified "}
                  <span className="text-white/75">4 opportunities</span>
                  {" where AI could reduce customer effort and increase automation."}
                </p>
              </div>
            </div>

            {/* Opportunity Cards — 2×2 grid */}
            <div className="grid grid-cols-2 gap-4">
              {OPPORTUNITIES.map((opp) => {
                const Icon = opp.icon
                const isInstalled = installedAgents.has(opp.id)
                return (
                  <div
                    key={opp.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 flex flex-col gap-3"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div
                        className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{ background: opp.accentBg, borderColor: opp.accentBorder }}
                      >
                        <Icon className="h-4 w-4" style={{ color: opp.accentColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight">{opp.title}</p>
                        {isInstalled && (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs mt-0.5">
                            <CheckCircle2 className="h-3 w-3" /> Installed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Problem + Stat */}
                    <div
                      className="rounded-xl px-4 py-3 border"
                      style={{ background: opp.accentBg, borderColor: opp.accentBorder }}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-1.5">
                        Opportunity Detected
                      </p>
                      <p className="text-white/60 text-xs leading-relaxed">{opp.problem}</p>
                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold" style={{ color: opp.accentColor }}>
                          {opp.stat}
                        </span>
                        <span className="text-white/35 text-xs">{opp.statLabel}</span>
                      </div>
                    </div>

                    {/* Impact */}
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35 mb-1">
                        Potential Impact
                      </p>
                      <p className="text-white/55 text-xs leading-relaxed">{opp.impact}</p>
                    </div>

                    {/* Recommended Agent */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35 shrink-0">
                        Recommended
                      </p>
                      <span
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border"
                        style={{ color: opp.accentColor, borderColor: opp.accentBorder, background: opp.accentBg }}
                      >
                        <Sparkles className="h-3 w-3" />
                        {opp.agentLabel}
                      </span>
                    </div>

                    {/* CTAs */}
                    <div className="flex gap-2 mt-auto pt-1">
                      <button
                        type="button"
                        onClick={() => loadAgent(opp.agentKey)}
                        className="flex-1 text-xs font-medium py-2 rounded-lg border border-white/15 text-white/65 hover:text-white hover:border-white/30 transition-colors"
                      >
                        View Agent
                      </button>
                      <button
                        type="button"
                        onClick={() => installAgent(opp.agentKey, opp.id)}
                        disabled={isInstalled}
                        className="flex-1 text-xs font-semibold py-2 rounded-lg border transition-colors disabled:cursor-default"
                        style={
                          isInstalled
                            ? { background: "rgba(16,185,129,0.12)", color: "#10B981", borderColor: "rgba(16,185,129,0.3)" }
                            : { background: opp.accentColor, color: "#fff", borderColor: "transparent" }
                        }
                      >
                        {isInstalled ? "Installed ✓" : "Install Agent"}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Opportunity Priority Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
                  Highest Impact Opportunities
                </h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                {PRIORITIES.map((p, i) => (
                  <div
                    key={p.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => loadAgent(p.agentKey)}
                    onKeyDown={(e) => e.key === "Enter" && loadAgent(p.agentKey)}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.04] transition-colors cursor-pointer group ${
                      i < PRIORITIES.length - 1 ? "border-b border-white/[0.06]" : ""
                    }`}
                  >
                    <span className="text-lg font-bold text-white/20 w-6 shrink-0 tabular-nums">{p.rank}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium group-hover:text-white/90 transition-colors">
                        {p.name}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {"Potential automation: "}
                        <span className="text-white/60">{p.interactions} interactions/month</span>
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="rounded-2xl border border-[#A64E8D]/25 bg-[#A64E8D]/[0.05] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-8 w-8 rounded-xl bg-[#A64E8D]/20 border border-[#A64E8D]/30 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-[#BA80A9]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Syndeo Recommendations</p>
                  <p className="text-xs text-white/40">Based on your customer interactions this month</p>
                </div>
              </div>
              <div className="space-y-4">
                {AI_RECS.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#A64E8D]/20 border border-[#A64E8D]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="h-2.5 w-2.5 text-[#BA80A9]" />
                    </div>
                    <p className="flex-1 text-white/60 text-sm leading-relaxed min-w-0">{rec.text}</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (rec.agentKey && rec.agentId) {
                          installAgent(rec.agentKey, rec.agentId)
                        }
                      }}
                      className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#A64E8D]/35 text-[#BA80A9] hover:bg-[#A64E8D]/15 transition-colors"
                    >
                      {rec.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended AI Agents library */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
                  Recommended AI Agents
                </h2>
                <button
                  type="button"
                  onClick={() => router.push("/flows")}
                  className="text-xs text-white/35 hover:text-white/60 transition-colors flex items-center gap-1"
                >
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {AGENT_LIBRARY.map((agent) => {
                  const AIcon = agent.icon
                  const isInstalled = installedAgents.has(agent.id)
                  return (
                    <div
                      key={agent.id}
                      className="flex-none w-44 rounded-xl border border-white/10 bg-white/[0.04] p-4 flex flex-col gap-2.5"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center">
                        <AIcon className="h-4 w-4 text-white/55" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">{agent.label}</p>
                        <p className="text-white/40 text-[11px] mt-0.5 leading-relaxed">{agent.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => installAgent(agent.agentKey, agent.id)}
                        disabled={isInstalled}
                        className="mt-auto text-[11px] font-semibold py-1.5 rounded-lg border transition-colors disabled:cursor-default"
                        style={
                          isInstalled
                            ? { background: "rgba(16,185,129,0.1)", color: "#10B981", borderColor: "rgba(16,185,129,0.3)" }
                            : { background: "rgba(166,78,141,0.12)", color: "#BA80A9", borderColor: "rgba(166,78,141,0.3)" }
                        }
                      >
                        {isInstalled ? "Installed ✓" : "Install"}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Right: Live Experience Preview ──────────────────────── */}
          <div className="col-span-4 flex flex-col h-full">
            <div className="flex flex-col flex-1 min-h-0 rounded-2xl overflow-hidden border border-white/10">

              {/* Yellow IKEA header */}
              <div
                className="shrink-0 flex items-center justify-between px-4 py-3"
                style={{ background: "#FFDB00" }}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-black/60" />
                  <span className="font-bold text-sm text-black">{sim.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-black/45">
                    Live Customer Experience
                  </span>
                  <button
                    type="button"
                    onClick={() => { setMessages([]); setChatInput(""); setIsTyping(false) }}
                    className="p-1 rounded hover:bg-black/10 transition-colors"
                    title="Reset chat"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-black/55" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div
                className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 bg-[#1E2235]"
                style={{ scrollbarWidth: "none" }}
              >
                {messages.length === 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#2E3448] px-4 py-3 text-sm text-white/80 leading-relaxed">
                        {sim.welcome}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {sim.chips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleChatSend(chip)}
                          className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/55 hover:bg-white/8 hover:text-white/80 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "rounded-tr-sm bg-[#A64E8D] text-white"
                          : "rounded-tl-sm bg-[#2E3448] text-white/80"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-sm bg-[#2E3448] px-4 py-3">
                      <div className="flex gap-1 items-center">
                        {[0, 0.2, 0.4].map((d, i) => (
                          <span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-white/30 animate-bounce"
                            style={{ animationDelay: `${d}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="shrink-0 p-3 bg-[#1E2235] border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKey}
                    placeholder="Type a message…"
                    className="flex-1 rounded-xl bg-white/[0.07] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/25 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleChatSend()}
                    disabled={!chatInput.trim()}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#A64E8D] text-white hover:bg-[#8f3f78] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown, MessageSquare, Mic, ArrowRight, Play, Square,
  Send, Sparkles, X, TrendingUp, TrendingDown, Zap
} from "lucide-react"

const DEFAULT_BOT_REPLY = "Thanks for your message! Let me look into that for you. Could you provide a bit more detail so I can help?"

type SimulatorFlow = {
  label: string
  greeting: string
  chips: string[]
  replies: Record<string, string>
}

const SIMULATOR_FLOWS: SimulatorFlow[] = [
  {
    label: "Returns Flow",
    greeting: "Hej! I'm Billie 🤖. I can help you with a return today. How would you like to get started?",
    chips: ["📦 Start a return", "📋 Return status", "💳 Refund query", "🏷️ Missing label", "📅 Book collection", "❓ Return policy"],
    replies: {
      "📦 Start a return": "I can help you start a return. Please share your order number and the item you'd like to return.",
      "📋 Return status": "I can check your return status. Could you provide your return reference number?",
      "💳 Refund query": "Happy to look into your refund. Please share your order number and I'll check the status.",
      "🏷️ Missing label": "I can resend your return label. Could you confirm the email address on your order?",
      "📅 Book collection": "I can arrange a collection for your return. What date works best for you?",
      "❓ Return policy": "IKEA's return policy allows returns within 365 days for most items. Would you like more details?",
    },
  },
  {
    label: "Order Tracking",
    greeting: "Hej! I'm Billie 🤖. I can help you track your IKEA order. What would you like to check?",
    chips: ["📦 Track my order", "📅 Delivery date", "🚚 Delivery issue", "❓ Order query", "🔄 Change address", "📄 Order receipt"],
    replies: {
      "📦 Track my order": "I can track your order right away. Please share your order number.",
      "📅 Delivery date": "I can check your estimated delivery date. Could you provide your order number?",
      "🚚 Delivery issue": "I'm sorry to hear there's an issue with your delivery. Please share your order number so I can investigate.",
      "❓ Order query": "I can help with your order query. What's your order number and what would you like to know?",
      "🔄 Change address": "I can check if your delivery address can still be updated. Please share your order number.",
      "📄 Order receipt": "I can resend your receipt. Could you confirm the email address linked to your order?",
    },
  },
  {
    label: "Product Availability",
    greeting: "Hej! I'm Billie 🤖. I can help you check product availability. What are you looking for?",
    chips: ["🔍 Check stock", "🏪 Find in store", "📦 Online availability", "🔔 Stock alert", "🔄 Alternative product", "❓ Product query"],
    replies: {
      "🔍 Check stock": "I can check stock levels for you. Could you share the product name or article number?",
      "🏪 Find in store": "I can check which stores have your item. Please share the product and your nearest postcode.",
      "📦 Online availability": "I can check online availability. Please share the product name or article number.",
      "🔔 Stock alert": "I can set up a stock alert for you. Please share the product article number and your email.",
      "🔄 Alternative product": "I can suggest similar alternatives. Could you describe what you're looking for?",
      "❓ Product query": "Happy to help with your product question. What would you like to know?",
    },
  },
]

type ChatMessage = { role: "user" | "bot"; text: string }

const TYPEWRITER_PROMPTS = [
  "Show me where customers are getting stuck",
  "Create a stock check agent",
  "Analyse yesterday's conversations",
  "Draft a delivery delay response",
]

const FLOWS = [
  { name: "Returns Flow",        meta: "Last edited 1 hour ago",  status: "active",    path: "/flows?flow=Returns",              simIndex: 0 },
  { name: "Order Tracking",      meta: "Last edited 2 days ago",  status: "draft",     path: "/flows?flow=Order%20Tracking",     simIndex: 1 },
  { name: "Product Availability",meta: "Last edited 1 week ago",  status: "published", path: "/flows?flow=Product%20Availability",simIndex: 2 },
]

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  active:    { label: "ACTIVE",    className: "bg-blue-500/15 text-blue-400 border border-blue-500/25" },
  draft:     { label: "DRAFT",     className: "bg-amber-500/15 text-amber-400 border border-amber-500/25" },
  published: { label: "PUBLISHED", className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" },
}

const BRIEFING_ITEMS = [
  {
    title: "Stock questions are rising",
    body: 'Customers asked "is this item in stock?" 1,247 times this week. Syndeo can automate this using your existing product data.',
    impact: "Estimated impact: 18% fewer support contacts",
    action: "Preview",
    simIndex: 2,
    trend: "up" as const,
  },
  {
    title: "Returns flow completion dropped",
    body: "The active Returns Flow is handling volume, but more customers are abandoning before confirmation.",
    impact: "Suggested action: optimise step 3 and simplify the refund handoff",
    action: "Review",
    simIndex: 0,
    trend: "down" as const,
  },
  {
    title: "Delivery enquiries are growing fast",
    body: "WhatsApp delivery questions are up 22%. A proactive Delivery Status Agent could reduce repeat contacts.",
    impact: "Estimated impact: 12 hours saved per week",
    action: "Try",
    simIndex: 1,
    trend: "up" as const,
  },
]

const RECOMMENDED_AGENTS = [
  { icon: "🔍", name: "Stock Check",    desc: "Answer availability questions automatically.", simIndex: 2 },
  { icon: "🛒", name: "Abandoned Cart", desc: "Recover customers who leave items in basket.",  simIndex: null },
  { icon: "📦", name: "Order Tracking", desc: "Give real-time order status without handoff.",  simIndex: 1 },
]

const METRICS = [
  { value: "342",  label: "conversations today", delta: "+12%" },
  { value: "87%",  label: "resolution rate",     delta: "+5%"  },
  { value: "1.2s", label: "avg response time",   delta: "8% faster" },
]

export function HomepageReturningUserV5() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [promptFocused, setPromptFocused] = useState(false)
  const promptRef = useRef<HTMLInputElement>(null)

  const [displayText, setDisplayText] = useState("")
  const [promptIndex, setPromptIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (promptFocused || prompt) return
    const current = TYPEWRITER_PROMPTS[promptIndex % TYPEWRITER_PROMPTS.length]
    let t: ReturnType<typeof setTimeout>
    if (!isDeleting) {
      if (displayText.length < current.length) {
        t = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), 60)
      } else {
        t = setTimeout(() => setIsDeleting(true), 2500)
      }
    } else if (displayText.length > 0) {
      t = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 30)
    } else {
      setIsDeleting(false)
      setPromptIndex((i) => (i + 1) % TYPEWRITER_PROMPTS.length)
    }
    return () => clearTimeout(t)
  }, [displayText, isDeleting, promptIndex, promptFocused, prompt])

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((s) => !s), 530)
    return () => clearInterval(interval)
  }, [])

  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeSimIndex, setActiveSimIndex] = useState<number | null>(null)
  const [stoppingIndex, setStoppingIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleChatSend = (text?: string) => {
    const msg = (text ?? chatInput).trim()
    if (!msg || activeSimIndex === null) return
    const flow = SIMULATOR_FLOWS[activeSimIndex]
    setChatInput("")
    setMessages((prev) => [...prev, { role: "user", text: msg }])
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { role: "bot", text: flow.replies[msg] ?? DEFAULT_BOT_REPLY }])
    }, 1500)
  }

  const handleRunSim = (simIndex: number) => {
    if (activeSimIndex === simIndex) {
      setStoppingIndex(simIndex)
      setTimeout(() => setStoppingIndex(null), 700)
      setActiveSimIndex(null)
    } else {
      setActiveSimIndex(simIndex)
    }
    setMessages([])
    setChatInput("")
    setIsTyping(false)
  }

  const handleChatKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleChatSend() }
  }

  return (
    <>
    <div className="min-h-[calc(100vh-64px)] overflow-y-auto bg-[#272C41] pb-40" style={{ scrollbarWidth: "none" }}>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 flex justify-center">
        <div className="h-[500px] w-[900px] rounded-full bg-[radial-gradient(circle,rgba(47,143,255,0.10)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mx-auto mb-8 max-w-[1280px] flex flex-col items-center text-center">
          <h1 className="text-4xl font-light tracking-tight text-white">Good morning, IKEA.</h1>
          <p className="mt-1 text-4xl font-light tracking-tight text-white">Here&apos;s what needs attention today.</p>
        </div>

        {/* AI Business Briefing — full width hero card */}
        <div className="mx-auto mb-6 max-w-[1280px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-[#2F8FFF]" />
              <p className="text-xs font-semibold uppercase tracking-widest text-white">AI Business Briefing</p>
            </div>
            <button type="button" onClick={() => router.push("/reports")}
              className="flex items-center gap-1 text-xs font-semibold text-white/40 transition-colors hover:text-white">
              View Reports <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Briefing rows — 3 columns */}
          <div className="grid grid-cols-3 divide-x divide-white/[0.07]">
            {BRIEFING_ITEMS.map((item) => (
              <div key={item.title} className="flex flex-col gap-3 px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {item.trend === "up"
                      ? <TrendingUp className="h-4 w-4 text-emerald-400" />
                      : <TrendingDown className="h-4 w-4 text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/50">{item.body}</p>
                    <p className="mt-2 text-xs text-emerald-400/80">{item.impact}</p>
                  </div>
                </div>
                <button type="button"
                  onClick={() => handleRunSim(item.simIndex)}
                  className="w-full rounded-xl bg-gradient-to-br from-[#2F8FFF] to-[#A64E8D] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main 2/3 + 1/3 grid — shared outer container groups the section */}
        <div className="mx-auto max-w-[1280px] rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
          <div className="grid grid-cols-[2fr_1fr] items-stretch gap-4">

            {/* ── Left 2/3: Agents + Flows ── */}
            <div className="flex flex-col gap-4">

              {/* Recommended AI Agents */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="border-b border-white/10 px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ffd400" }}>✦ Recommended AI Agents</p>
                </div>
                <div className="divide-y divide-white/[0.07]">
                  {RECOMMENDED_AGENTS.map((agent) => (
                    <div key={agent.name} className="flex items-center gap-4 px-5 py-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#A64E8D]/20 text-lg">
                        {agent.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{agent.name}</p>
                        <p className="mt-0.5 text-xs text-white/40">{agent.desc}</p>
                      </div>
                      <button type="button"
                        onClick={() => agent.simIndex !== null && handleRunSim(agent.simIndex)}
                        className="shrink-0 flex items-center gap-1.5 rounded-xl bg-[#A64E8D] px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">
                        <Sparkles className="h-3 w-3" /> Try
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Flows */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white">Your recent flows</p>
                  <button type="button" onClick={() => router.push("/flows")}
                    className="flex items-center gap-1 text-xs font-semibold text-white/40 transition-colors hover:text-white">
                    View All <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  {FLOWS.map((flow) => (
                    <div key={flow.name}
                      className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 transition-all ${
                        activeSimIndex === flow.simIndex
                          ? "border-[#2F8FFF]/40 bg-[#2F8FFF]/[0.06]"
                          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
                      }`}>
                      <div className={`h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${
                        activeSimIndex === flow.simIndex ? "bg-[#2F8FFF]"
                        : stoppingIndex === flow.simIndex ? "bg-red-400"
                        : "bg-white/10"
                      }`} />
                      <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
                        <button type="button" onClick={() => router.push(flow.path)}
                          className="text-sm font-medium leading-none text-white transition-colors hover:text-white/70">
                          {flow.name}
                        </button>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider ${STATUS_STYLES[flow.status].className}`}>
                          {STATUS_STYLES[flow.status].label}
                        </span>
                      </div>
                      <button type="button" onClick={() => handleRunSim(flow.simIndex)}
                        className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                          activeSimIndex === flow.simIndex
                            ? "bg-[#2F8FFF] text-white"
                            : "border border-white/15 bg-white/[0.08] text-white/60 hover:bg-white/[0.15] hover:text-white"
                        }`}>
                        {activeSimIndex === flow.simIndex
                          ? <><Square className="h-3 w-3" fill="currentColor" /> Stop</>
                          : <><Play className="h-3 w-3" fill="currentColor" /> Run</>}
                      </button>
                      <button type="button" onClick={() => router.push(flow.path)} aria-label={`Open ${flow.name}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white/80">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Right 1/3: IKEA Simulator (focal point) ── */}
            <div>
              <div className="flex h-full flex-col overflow-hidden rounded-[4px] border border-white/10"
                style={{
                  fontFamily: '"Noto IKEA","Noto Sans","Roboto","Open Sans",system-ui,sans-serif',
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                }}>
                <div className="flex shrink-0 items-center justify-between bg-[#FFDA1A] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#111111]" strokeWidth={2} />
                    <span className="text-[15px] font-bold tracking-tight text-[#111111]">Live IKEA Chat Simulator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" aria-label="Minimise" className="transition-opacity hover:opacity-60">
                      <ChevronDown className="h-4 w-4 text-[#111111]" strokeWidth={2} />
                    </button>
                    <button type="button" aria-label="Close" className="transition-opacity hover:opacity-60">
                      <X className="h-4 w-4 text-[#111111]" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white px-4 pb-3 pt-4 space-y-3">
                  {activeSimIndex === null ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                      <Play className="h-8 w-8 text-[#CCCCCC]" />
                      <p className="text-[14px] text-[#767676]">Select a flow to run it here</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-[12px] text-[#767676]">Billie the bot 🤖 has connected to the chat</p>
                      <div className="max-w-[90%] rounded-[12px] border border-[#E0E0E0] bg-white px-3 py-2.5">
                        <p className="text-[14px] leading-relaxed text-[#111111]">{SIMULATOR_FLOWS[activeSimIndex].greeting}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {SIMULATOR_FLOWS[activeSimIndex].chips.map((label) => (
                          <button key={label} type="button" onClick={() => handleChatSend(label)}
                            className="rounded-[20px] bg-[#EBEBEB] px-2 py-2.5 text-left text-[13px] font-bold leading-tight text-[#111111] transition-colors hover:bg-[#DCDCDC]">
                            {label}
                          </button>
                        ))}
                      </div>
                      {messages.map((msg, i) =>
                        msg.role === "user" ? (
                          <div key={i} className="flex justify-end">
                            <div className="max-w-[80%] rounded-[12px] bg-[#FFDA1A] px-3 py-2.5">
                              <p className="text-[14px] leading-relaxed text-[#111111]">{msg.text}</p>
                            </div>
                          </div>
                        ) : (
                          <div key={i} className="max-w-[90%] rounded-[12px] border border-[#E0E0E0] bg-white px-3 py-2.5">
                            <p className="text-[14px] leading-relaxed text-[#111111]">{msg.text}</p>
                          </div>
                        )
                      )}
                      {isTyping && (
                        <div className="max-w-[60px] rounded-[12px] border border-[#E0E0E0] bg-white px-3 py-2.5">
                          <div className="flex items-center gap-1">
                            {[0, 1, 2].map((i) => (
                              <span key={i} className="h-2 w-2 rounded-full bg-[#767676]"
                                style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                            ))}
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3 border-t border-[#E0E0E0] bg-white px-4 py-3">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKey}
                    placeholder={activeSimIndex === null ? "Run a flow to start testing" : "Test your simulator here"}
                    disabled={activeSimIndex === null}
                    className="flex-1 border-none bg-transparent text-[14px] text-[#111111] outline-none placeholder:text-[#767676] disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ fontFamily: '"Noto IKEA","Noto Sans","Roboto",system-ui,sans-serif' }}
                  />
                  <button type="button" onClick={() => handleChatSend()} disabled={!chatInput.trim()}
                    className="text-[#767676] transition-colors hover:text-[#111111] disabled:text-[#CCCCCC]">
                    <Send className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* ── Floating Syndeo Agent prompt bar ── */}
      <div className="fixed bottom-16 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
          <span className="block w-3 bg-[#2F8FFF]" style={{ height: "2px", animation: "spin-pause 2.4s linear infinite" }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white">SYNDEO AGENT</span>
        </div>
        <div
          className="pointer-events-auto w-full max-w-[560px] rounded-full p-[1px]"
          style={{ background: "linear-gradient(135deg, #A64E8D 0%, #2F8FFF 100%)" }}
        >
          <div
            className="flex cursor-text items-center gap-3 rounded-full px-5 py-3.5 backdrop-blur-xl"
            style={{ background: "rgba(30, 34, 52, 0.92)" }}
            onClick={() => promptRef.current?.focus()}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-white/30" />
            <div className="relative flex-1">
              {!promptFocused && !prompt && (
                <div className="pointer-events-none absolute inset-0 flex items-center">
                  <span className="text-sm text-white/30">{displayText}</span>
                </div>
              )}
              <input
                ref={promptRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setPromptFocused(true)}
                onBlur={() => setPromptFocused(false)}
                onKeyDown={(e) => { if (e.key === "Enter" && prompt.trim()) router.push("/flows?new=true") }}
                placeholder=""
                className="w-full bg-transparent text-sm text-white outline-none"
                style={{ caretColor: "#2F8FFF" }}
              />
            </div>
            <button type="button" aria-label="Use microphone"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white">
              <Mic className="h-3.5 w-3.5" />
            </button>
            <button type="button"
              onClick={() => prompt.trim() && router.push("/flows?new=true")}
              disabled={!prompt.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A64E8D] text-white transition-all hover:bg-[#8f3f78] disabled:cursor-not-allowed disabled:opacity-40">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

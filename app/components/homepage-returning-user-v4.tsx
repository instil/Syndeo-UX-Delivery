"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronDown, CloudUpload, MessageSquare, Mic, Package, Plus, RotateCcw, Send, ShoppingCart, Sparkles, TestTube, TrendingUp, Truck, Upload, X } from "lucide-react"

const TYPEWRITER_PROMPTS = [
  "Create a flow for damaged items",
  "Show unpublished flows",
  "Find flows using Salesforce",
  "Create a returns journey",
]

const quickActions = [
  { label: "Continue Returns Flow", action: "/flows?flow=Returns", icon: ArrowRight },
  { label: "Create New Flow", action: "/flows?new=true", icon: Plus },
  { label: "Test IKEA Agent", action: "/flows?test=ikea", icon: TestTube },
  { label: "Import Existing Journey", action: "/flows?import=true", icon: Upload },
] as const

const CHAT_CHIPS = [
  "📦Manage your Order",
  "📄Case Status",
  "🔧Spare Parts",
  "💥Damaged Item",
  "❓Missing Item",
  "🖥Make a claim",
]

const BOT_REPLIES: Record<string, string> = {
  "📦Manage your Order": "Sure! Please provide your order number and I'll pull up the details for you.",
  "📄Case Status": "I can help with that. Could you share your case reference number?",
  "🔧Spare Parts": "I can help you find spare parts. What product are you looking for parts for?",
  "💥Damaged Item": "I'm sorry to hear that. Can you describe the damage and share your order number so I can raise this for you?",
  "❓Missing Item": "That's frustrating — let's sort this out. Please share your order number and which item is missing.",
  "🖥Make a claim": "I can start a claim for you. Could you tell me what happened and share any relevant order details?",
  // Stock Check
  "Check a product": "Sure! Which product would you like to check availability for?",
  "Is BILLY bookcase in stock?": "Let me check that for you… The BILLY bookcase in white is currently in stock at your nearest store and available online. Would you like to reserve one?",
  "Find nearest store stock": "I can help with that. Could you share your postcode so I can find your nearest IKEA store?",
  "Check online availability": "I'll check our online store for you. Which item are you interested in?",
  // Abandoned Cart
  "Show my basket": "Here's what you left behind: KALLAX shelf unit (×1), LACK side table (×2). Would you like to complete your order?",
  "Apply a discount": "I can check if there are any available offers for the items in your basket. One moment…",
  "Help me decide": "Of course! Which item are you unsure about? I can share more details, reviews, or alternatives.",
  "Save for later": "Done — I've saved your basket. You can come back anytime and pick up where you left off.",
  // Order Tracking
  "Track my order": "Please share your order number and I'll get the latest status for you right away.",
  "Where is my delivery?": "I can look into that. Could you provide your order number or the email address used at checkout?",
  "Change delivery date": "I can help you reschedule. What date works best for you? Please note changes must be made 48 hours before delivery.",
  "Contact courier": "I'll connect you with the courier. Your delivery is with DHL — shall I share their tracking link or arrange a callback?",
}

const DEFAULT_BOT_REPLY = "Thanks for your message! Let me look into that for you. Could you provide a bit more detail so I can help?"

type AgentKey = "default" | "stock-check" | "abandoned-cart" | "order-tracking"

const AGENT_SIMULATOR: Record<AgentKey, { title: string; welcome: string; chips: string[] }> = {
  "default": {
    title: "Live IKEA Chat Simulator",
    welcome: "Hej! I'm Billie 🤖, your IKEA United Kingdom customer support bot.",
    chips: CHAT_CHIPS.slice(0, 4),
  },
  "stock-check": {
    title: "Stock Check Agent",
    welcome: "Hi! 📦 I can check if any IKEA product is in stock online or at your nearest store. What are you looking for?",
    chips: ["Check a product", "Is BILLY bookcase in stock?", "Find nearest store stock", "Check online availability"],
  },
  "abandoned-cart": {
    title: "Abandoned Cart Agent",
    welcome: "Hey! 🛒 I noticed you left some items in your basket. Want me to help you complete your order or find a better deal?",
    chips: ["Show my basket", "Apply a discount", "Help me decide", "Save for later"],
  },
  "order-tracking": {
    title: "Order Tracking Agent",
    welcome: "Hello! 🚚 I can give you a live update on any IKEA order. Do you have your order number handy?",
    chips: ["Track my order", "Where is my delivery?", "Change delivery date", "Contact courier"],
  },
}

type ChatMessage = { role: "user" | "bot"; text: string }

export function HomepageReturningUserV4() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [installed, setInstalled] = useState(false)
  const [showSimulator, setShowSimulator] = useState(false)
  const [activeAgent, setActiveAgent] = useState<AgentKey>("default")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Typewriter state
  const [displayText, setDisplayText] = useState("")
  const [promptIndex, setPromptIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const textareaRef = useRef<HTMLInputElement>(null)

  // Typewriter effect — pauses when user is typing
  useEffect(() => {
    if (isFocused || input) return
    const currentPrompt = TYPEWRITER_PROMPTS[promptIndex % TYPEWRITER_PROMPTS.length]
    let timeout: ReturnType<typeof setTimeout>
    if (!isDeleting) {
      if (displayText.length < currentPrompt.length) {
        timeout = setTimeout(() => setDisplayText(currentPrompt.slice(0, displayText.length + 1)), 60)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2500)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 30)
      } else {
        setIsDeleting(false)
        setPromptIndex((promptIndex + 1) % TYPEWRITER_PROMPTS.length)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, promptIndex, isFocused, input])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(s => !s), 530)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const navigateFromInput = (value: string) => {
    const userInput = value.toLowerCase()
    if (userInput.includes("create") && userInput.includes("flow")) {
      router.push("/flows?new=true")
    } else if (userInput.includes("account")) {
      router.push("/flows?flow=Account%20Set%20Up")
    } else if (userInput.includes("order")) {
      router.push("/flows?flow=Order%20Status%20Lookup")
    } else if (userInput.includes("report") || userInput.includes("analytic")) {
      router.push("/reports")
    } else if (userInput.includes("channel")) {
      router.push("/channels")
    } else if (userInput.includes("train") || userInput.includes("ai")) {
      router.push("/ai-workbench")
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    navigateFromInput(input)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleSend() }
  }

  const handleChatSend = (text?: string) => {
    const msg = (text ?? chatInput).trim()
    if (!msg) return
    setChatInput("")
    setMessages(prev => [...prev, { role: "user", text: msg }])
    setIsTyping(true)
    setTimeout(() => {
      const reply = BOT_REPLIES[msg] ?? DEFAULT_BOT_REPLY
      setIsTyping(false)
      setMessages(prev => [...prev, { role: "bot", text: reply }])
    }, 1500)
  }

  const handleChatKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleChatSend() }
  }

  const handleTryAgent = (key: AgentKey) => {
    setActiveAgent(key)
    setMessages([])
    setChatInput("")
    setIsTyping(false)
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#272C41]">
      <div className="container mx-auto h-full px-6 py-5">
        <div className="grid h-full grid-cols-12 gap-8">

          {/* Left — Opportunity Centre narrative */}
          <div className="relative col-span-7 flex flex-col justify-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(47,143,255,0.25)_0%,transparent_72%)] blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col">
              {/* Label */}
              <div className="mb-5 inline-flex items-center gap-2">
                <span className="block w-4 h-1 bg-[#2F8FFF]" style={{ animation: "spin-pause 2.4s linear infinite" }} />
                <span className="text-xs font-semibold uppercase tracking-widest text-white">Syndeo Agent</span>
              </div>

              <h1 className="text-5xl tracking-tight text-white font-light mb-3">
                Your Opportunity Centre
              </h1>
              <p className="text-white/40 text-base font-light mb-10 max-w-lg">
                Based on this week's customer data, here's where automating next would have the biggest impact for IKEA.
              </p>

              {/* KPI summary pills */}
              <div className="flex gap-3 mb-10 flex-wrap">
                {[
                  { label: "Unresolved conversations", value: "3,847", color: "text-rose-400" },
                  { label: "Avg. handle time", value: "8.4 min", color: "text-amber-400" },
                  { label: "Top query", value: "Order tracking", color: "text-[#2F8FFF]" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                    <span className={`text-lg font-semibold ${stat.color}`}>{stat.value}</span>
                    <span className="text-xs text-white/40">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Compact prompt */}
              <div className="rounded-2xl p-[1px]" style={{ background: "linear-gradient(135deg, #A64E8D 0%, rgba(255,255,255,0.2) 45%, #2F8FFF 100%)" }}>
                <div
                  className="rounded-2xl flex items-center gap-3 px-5 py-3.5 cursor-text"
                  style={{ background: "#32374B" }}
                  onClick={() => textareaRef.current?.focus()}
                >
                  <Sparkles className="h-4 w-4 text-white/30 shrink-0" />
                  <input
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Syndeo anything…"
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                    style={{ caretColor: "#2F8FFF" }}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#A64E8D] text-white hover:bg-[#8f3f78] disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Opportunity cards */}
          <div className="col-span-5 flex flex-col py-4 overflow-y-auto gap-4">
            <div className="w-full max-w-[400px] mx-auto flex flex-col gap-3">

              {/* Panel header */}
              <div className="flex items-center gap-2 px-1 mb-1">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">3 Opportunities Identified</span>
              </div>

              {[
                {
                  icon: ShoppingCart,
                  signal: "1,245 customers abandoned checkout this month",
                  opportunity: "Abandoned Cart Agent",
                  impact: "Recover up to £28k in potential revenue",
                  impactColor: "text-emerald-400",
                  cta: "Build Agent",
                },
                {
                  icon: Package,
                  signal: "847 customers asked 'is this in stock?' this week",
                  opportunity: "Stock Availability Agent",
                  impact: "Deflect ~40% of inbound stock queries automatically",
                  impactColor: "text-emerald-400",
                  cta: "Build Agent",
                },
                {
                  icon: Truck,
                  signal: "2,103 'where is my order?' queries in 7 days",
                  opportunity: "Order Tracking Agent",
                  impact: "Automate 85% of tracking queries, save 280hrs/month",
                  impactColor: "text-emerald-400",
                  cta: "Build Agent",
                },
              ].map((item) => (
                <div key={item.opportunity} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                  {/* Signal */}
                  <p className="text-white/50 text-xs mb-3 leading-relaxed border-b border-white/10 pb-3">
                    📊 {item.signal}
                  </p>
                  {/* Recommendation */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-[#A64E8D]/20 border border-[#A64E8D]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="h-4 w-4 text-[#BA80A9]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm">{item.opportunity}</p>
                      <p className={`text-xs mt-0.5 ${item.impactColor}`}>{item.impact}</p>
                    </div>
                  </div>
                  {/* CTA */}
                  <button
                    type="button"
                    onClick={() => router.push("/flows?new=true")}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#A64E8D] hover:bg-[#8f3f78] text-white text-xs font-semibold py-2.5 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {item.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

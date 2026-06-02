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

export function HomepageReturningUserV3() {
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

          {/* Left — AI prompt */}
          <div className="relative col-span-7 flex flex-col justify-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(47,143,255,0.25)_0%,transparent_72%)] blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
              <div className="mb-4 inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A64E8D]/70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A64E8D]" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-white">Syndeo Agent</span>
              </div>

              <h1 className="text-5xl tracking-tight text-white font-light">
                What would you like to build today, IKEA?
              </h1>

              {/* Big frosted-glass prompt card */}
              <div className="mt-8 w-full">
                {/* Gradient border: 1px wrapper, opaque inner fill */}
                <div className="rounded-2xl p-[1px]" style={{ background: "linear-gradient(135deg, #A64E8D 0%, rgba(255,255,255,0.2) 45%, #2F8FFF 100%)" }}>
                <div
                  className="relative rounded-2xl backdrop-blur-xl cursor-text"
                  style={{ background: "#32374B" }}
                  onClick={() => textareaRef.current?.focus()}
                >
                  {/* Animated prompt overlay (hidden when user is typing) */}
                  {!isFocused && !input && (
                    <div className="pointer-events-none absolute left-6 top-6 right-6 text-left">
                      <span className="text-[28px] font-light leading-tight text-white">
                        {displayText}
                      </span>
                      <span
                        className="inline-block w-[2px] h-[32px] bg-[#2F8FFF] ml-0.5 align-middle"
                        style={{ opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }}
                      />
                    </div>
                  )}

                  {/* Real textarea */}
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
                    }}
                    placeholder=""
                    rows={3}
                    className="w-full resize-none bg-transparent px-6 pt-6 pb-16 text-[28px] font-light leading-tight text-white outline-none placeholder:text-white/20"
                    style={{ caretColor: "#2F8FFF" }}
                  />

                  {/* Bottom bar — mic + send buttons */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Use microphone"
                      className="h-11 w-11 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!input.trim()}
                      aria-label="Send message"
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#A64E8D] text-white hover:bg-[#8f3f78] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                </div>{/* end gradient border wrapper */}

                {/* Suggested tasks — Google AI Studio style vertical list */}
                <div className="mt-5 flex flex-col items-center gap-1">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => router.push(action.action)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition-all hover:bg-white/5 hover:text-white/80 text-left group"
                    >
                      <action.icon className="h-4 w-4 shrink-0 text-white/30 group-hover:text-white/60 transition-colors" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Opportunity → Agent recommendation */}
          <div className="col-span-5 flex flex-col py-4 overflow-hidden gap-4 h-full">
            <div className="w-full max-w-[400px] mx-auto flex flex-col flex-1 min-h-0">

              {/* Single unified panel: agents + simulator */}
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden flex flex-col flex-1 min-h-0">

                {/* Panel header */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 shrink-0">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Recommended AI Agents</span>
                </div>

                {/* Agent rows */}
                <div className="flex flex-col divide-y divide-white/10 shrink-0">
                  {([
                    {
                      key: "stock-check" as AgentKey,
                      insight: 'Customers asking: "Is this item in stock?"',
                      agent: "Stock Check",
                      desc: "Allow customers to check stock availability automatically.",
                      icon: Package,
                    },
                    {
                      key: "abandoned-cart" as AgentKey,
                      insight: "Customers abandoning items in their basket",
                      agent: "Abandoned Cart",
                      desc: "Proactively engage customers who leave items in their basket.",
                      icon: ShoppingCart,
                    },
                    {
                      key: "order-tracking" as AgentKey,
                      insight: "High volume of order tracking requests",
                      agent: "Order Tracking",
                      desc: "Give customers real-time order status without agent handoff.",
                      icon: Truck,
                    },
                  ]).map((item) => (
                    <div key={item.agent} className={`px-5 py-4 transition-colors ${activeAgent === item.key ? "bg-white/5" : ""}`}>
                      <p className="text-sm font-semibold text-white mb-2 leading-snug">{item.insight}</p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-7 w-7 rounded-lg bg-[#A64E8D]/20 border border-[#A64E8D]/30 flex items-center justify-center shrink-0">
                            <item.icon className="h-4 w-4 text-[#BA80A9]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">{item.agent}</p>
                            <p className="text-xs text-white/50 leading-snug">{item.desc}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => activeAgent === item.key ? setShowModal(true) : handleTryAgent(item.key)}
                          className={`shrink-0 flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3 py-2 transition-colors ${activeAgent === item.key ? "bg-white/20 hover:bg-white/30 text-white" : "bg-[#A64E8D] hover:bg-[#8f3f78] text-white"}`}
                        >
                          {activeAgent === item.key ? <CloudUpload className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                          {activeAgent === item.key ? "Install" : "Try"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Embedded IKEA simulator — padded, sits as a widget inside the panel */}
                <div className="flex-1 min-h-0 p-4 pb-5">
                  <div className="h-full flex flex-col overflow-hidden rounded-[4px] shadow-[0_2px_16px_rgba(0,0,0,0.2)]"
                    style={{ fontFamily: '"Noto IKEA","Noto Sans","Roboto","Open Sans",system-ui,sans-serif' }}
                  >
                  <div className="bg-[#FFDA1A] px-4 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#111111]" strokeWidth={2} />
                      <span className="text-[15px] font-bold text-[#111111] tracking-tight">{AGENT_SIMULATOR[activeAgent].title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" aria-label="Reset chat" onClick={() => handleTryAgent("default")} className="hover:opacity-60 transition-opacity">
                        <RotateCcw className="w-4 h-4 text-[#111111]" strokeWidth={2} />
                      </button>
                      <button type="button" aria-label="Minimise" className="hover:opacity-60 transition-opacity">
                        <ChevronDown className="w-4 h-4 text-[#111111]" strokeWidth={2} />
                      </button>
                      <button type="button" aria-label="Close" className="hover:opacity-60 transition-opacity">
                        <X className="w-4 h-4 text-[#111111]" strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto bg-white px-4 pt-4 pb-2 space-y-3">
                    <p className="text-[12px] text-[#767676]">Billie the bot 🤖 has connected to the chat</p>
                    <div className="border border-[#E0E0E0] bg-white rounded-[12px] px-3 py-2 max-w-[90%]">
                      <p className="text-[13px] text-[#111111] leading-relaxed">{AGENT_SIMULATOR[activeAgent].welcome}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {AGENT_SIMULATOR[activeAgent].chips.map((label) => (
                        <button key={label} type="button" onClick={() => handleChatSend(label)}
                          className="bg-[#EBEBEB] rounded-[20px] px-2 py-2 text-[12px] font-bold text-[#111111] text-left leading-tight hover:bg-[#DCDCDC] transition-colors">
                          {label}
                        </button>
                      ))}
                    </div>
                    {messages.map((msg, i) => (
                      msg.role === "user" ? (
                        <div key={i} className="flex justify-end">
                          <div className="px-3 py-2 max-w-[80%] bg-[#FFDA1A] rounded-[12px]">
                            <p className="text-[13px] text-[#111111]">{msg.text}</p>
                          </div>
                        </div>
                      ) : (
                        <div key={i} className="border border-[#E0E0E0] bg-white rounded-[12px] px-3 py-2 max-w-[90%]">
                          <p className="text-[13px] text-[#111111]">{msg.text}</p>
                        </div>
                      )
                    ))}
                    {isTyping && (
                      <div className="border border-[#E0E0E0] bg-white rounded-[12px] px-3 py-2 max-w-[60px]">
                        <div className="flex items-center gap-1">
                          {[0,1,2].map((i) => (
                            <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#767676]"
                              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="shrink-0 bg-white border-t border-[#E0E0E0] px-4 py-3 flex items-center gap-2">
                    <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleChatKey}
                      placeholder="Test your simulator here"
                      className="flex-1 text-[13px] text-[#111111] placeholder:text-[#767676] bg-transparent border-none outline-none"
                      style={{ fontFamily: '"Noto IKEA","Noto Sans","Roboto",system-ui,sans-serif' }} />
                    <button type="button" onClick={() => handleChatSend()} disabled={!chatInput.trim()}
                      className="text-[#767676] disabled:text-[#CCCCCC] hover:text-[#111111] transition-colors">
                      <Send className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Install modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[560px] rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="px-8 pt-8 pb-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-[#A64E8D]/10 flex items-center justify-center">
                    <ShoppingCart className="h-7 w-7 text-[#A64E8D]" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Abandoned Cart</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" /> Close
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Abandoned Cart AI Agent is used to detect customers who have an abandoned cart and proactively offer assistance.
              </p>
              <p className="text-gray-700 leading-relaxed">
                An external API is called to retrieve any abandoned cart items linked to the customer account. If any items are found, the customer is proactively asked if the items in their cart is the reason for their contact. The agent can then be configured to perform a specific task if the customer is interested (e.g. call onto another agent or transfer to a customer service advisor).
              </p>
            </div>

            {/* Colour bar */}
            <div className="h-2 w-full" style={{ background: "linear-gradient(to right, #A64E8D, #272C41, #2F8FFF, #2FAFB5, #A64E8D)" }} />

            {/* Modal footer */}
            <div className="px-8 py-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Standard</p>
                <p className="text-sm text-gray-500 max-w-[360px]">
                  Installing this agent will create Flows and Integration groups in your environment, which you can then edit as needed.
                </p>
                <p className="text-xs text-gray-400 mt-2">Published by Syndeo</p>
              </div>
              <button
                type="button"
                onClick={() => { setInstalled(true); setShowModal(false) }}
                className="flex flex-col items-center gap-1 text-gray-700 hover:text-[#A64E8D] transition-colors ml-6 shrink-0"
              >
                <CloudUpload className="h-9 w-9" />
                <span className="text-sm font-medium">Install</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

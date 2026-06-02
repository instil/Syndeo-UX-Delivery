"use client"

import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, MessageSquare, Mic, Pencil, Play, Send, Sparkles, X } from "lucide-react"

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
    label: "Account Set Up",
    greeting: "Hej! I'm Billie 🤖. I can help you get your IKEA account set up. What do you need help with?",
    chips: ["👤 Create account", "🔑 Forgot password", "📧 Verify email", "🔗 Link Family card", "✏️ Update details", "❓ Account help"],
    replies: {
      "👤 Create account": "I can guide you through creating your IKEA account. Head to ikea.com/gb/en/profile/login/ and select 'Create account'.",
      "🔑 Forgot password": "No worries! Visit the login page and select 'Forgot password' — we'll send a reset link to your email.",
      "📧 Verify email": "If you haven't received a verification email, I can resend it. What email address did you register with?",
      "🔗 Link Family card": "To link your IKEA Family card, sign in and go to My Account > IKEA Family. Would you like a direct link?",
      "✏️ Update details": "I can help you update your account details. Are you looking to change your name, email, or address?",
      "❓ Account help": "I'm here to help! Could you describe the issue you're experiencing with your account?",
    },
  },
]

type ChatMessage = { role: "user" | "bot"; text: string }

const TYPEWRITER_PROMPTS = [
  "Create a flow for damaged items",
  "Show unpublished flows",
  "Find flows using Salesforce",
  "Create a returns journey",
]

const FLOWS = [
  { name: "Returns Flow", meta: "Last edited 1 hour ago", status: "active", path: "/flows?flow=Returns" },
  { name: "Order Tracking", meta: "Last edited 2 days ago", status: "draft", path: "/flows?flow=Order%20Tracking" },
  { name: "Account Set Up", meta: "Last edited 5 days ago", status: "published", path: "/flows?flow=Account%20Set%20Up" },
]

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-blue-500/15 text-blue-400 border border-blue-500/25" },
  draft: { label: "Draft", className: "bg-amber-500/15 text-amber-400 border border-amber-500/25" },
  published: { label: "Published", className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" },
}

export function HomepageReturningUserV4B() {
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
  const [activeFlowIndex, setActiveFlowIndex] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleChatSend = (text?: string) => {
    const msg = (text ?? chatInput).trim()
    if (!msg) return

    const activeFlow = SIMULATOR_FLOWS[activeFlowIndex]
    setChatInput("")
    setMessages((prev) => [...prev, { role: "user", text: msg }])
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { role: "bot", text: activeFlow.replies[msg] ?? DEFAULT_BOT_REPLY }])
    }, 1500)
  }

  const handleFlowSwitch = (index: number) => {
    setActiveFlowIndex(index)
    setMessages([])
    setChatInput("")
    setIsTyping(false)
  }

  const handleChatKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleChatSend()
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] overflow-y-auto bg-[#272C41]" style={{ scrollbarWidth: "none" }}>
      <div className="relative py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <div className="h-[400px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(47,143,255,0.15)_0%,transparent_70%)] blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="block w-4 bg-[#2F8FFF]" style={{ height: "3px", animation: "spin-pause 2.4s linear infinite" }} />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/45">SYNDEO AGENT</span>
            </div>

            <h1 className="mb-6 text-4xl font-light tracking-tight text-white">Start something new</h1>

            <div className="w-full rounded-2xl p-[1px]" style={{ background: "linear-gradient(135deg, #A64E8D 0%, rgba(255,255,255,0.2) 45%, #2F8FFF 100%)" }}>
              <div
                className="flex cursor-text items-center gap-3 rounded-2xl px-5 py-3.5"
                style={{ background: "#32374B" }}
                onClick={() => promptRef.current?.focus()}
              >
                <Sparkles className="h-4 w-4 shrink-0 text-white/25" />
                <div className="relative flex-1">
                  {!promptFocused && !prompt && (
                    <div className="pointer-events-none absolute inset-0 flex items-center">
                      <span className="text-base text-white/30">{displayText}</span>
                      <span
                        className="ml-0.5 inline-block h-[16px] w-[1.5px] align-middle bg-[#2F8FFF]"
                        style={{ opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }}
                      />
                    </div>
                  )}
                  <input
                    ref={promptRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setPromptFocused(true)}
                    onBlur={() => setPromptFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && prompt.trim()) router.push("/flows?new=true")
                    }}
                    placeholder=""
                    className="w-full bg-transparent text-base text-white outline-none"
                    style={{ caretColor: "#2F8FFF" }}
                  />
                </div>
                <button
                  type="button"
                  aria-label="Use microphone"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => prompt.trim() && router.push("/flows?new=true")}
                  disabled={!prompt.trim()}
                  aria-label="Get started"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#A64E8D] text-white transition-colors hover:bg-[#8f3f78] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Test your recent flows</p>
          </div>

          <div className="flex gap-0">
            <div className="flex w-[480px] shrink-0 flex-col gap-3 border-r border-white/10 p-5">
              {FLOWS.map((flow, i) => (
                <div
                  key={flow.name}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-6 py-4 transition-all ${
                    activeFlowIndex === i
                      ? "border-[#2F8FFF]/40 bg-[#2F8FFF]/[0.06]"
                      : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
                  }`}
                >
                  <div className={`h-2 w-2 shrink-0 rounded-full transition-all ${activeFlowIndex === i ? "bg-[#2F8FFF]" : "bg-white/10"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-medium leading-none text-white">{flow.name}</p>
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[flow.status].className}`}>
                        {STATUS_STYLES[flow.status].label}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFlowSwitch(i)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      activeFlowIndex === i
                        ? "bg-[#2F8FFF] text-white"
                        : "border border-white/15 bg-white/[0.08] text-white/60 hover:bg-white/[0.15] hover:text-white"
                    }`}
                  >
                    <Play className="h-3 w-3" fill="currentColor" />
                    {activeFlowIndex === i ? "Running" : "Run"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(flow.path)}
                    aria-label={`Edit ${flow.name}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white/80"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="min-h-0 flex-1 p-4">
              <div
                className="flex h-[500px] flex-col overflow-hidden rounded-[4px]"
                style={{
                  fontFamily: '"Noto IKEA","Noto Sans","Roboto","Open Sans",system-ui,sans-serif',
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                }}
              >
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
                  <p className="text-[12px] text-[#767676]">Billie the bot 🤖 has connected to the chat</p>
                  <div className="max-w-[90%] rounded-[12px] border border-[#E0E0E0] bg-white px-3 py-2.5">
                    <p className="text-[14px] leading-relaxed text-[#111111]">{SIMULATOR_FLOWS[activeFlowIndex].greeting}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SIMULATOR_FLOWS[activeFlowIndex].chips.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleChatSend(label)}
                        className="rounded-[20px] bg-[#EBEBEB] px-2 py-2.5 text-left text-[13px] font-bold leading-tight text-[#111111] transition-colors hover:bg-[#DCDCDC]"
                      >
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
                    ),
                  )}
                  {isTyping && (
                    <div className="max-w-[60px] rounded-[12px] border border-[#E0E0E0] bg-white px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-2 w-2 rounded-full bg-[#767676]"
                            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex shrink-0 items-center gap-3 border-t border-[#E0E0E0] bg-white px-4 py-3">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKey}
                    placeholder="Test your simulator here"
                    className="flex-1 border-none bg-transparent text-[14px] text-[#111111] outline-none placeholder:text-[#767676]"
                    style={{ fontFamily: '"Noto IKEA","Noto Sans","Roboto",system-ui,sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleChatSend()}
                    disabled={!chatInput.trim()}
                    className="text-[#767676] transition-colors hover:text-[#111111] disabled:text-[#CCCCCC]"
                  >
                    <Send className="h-4 w-4" strokeWidth={1.5} />
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

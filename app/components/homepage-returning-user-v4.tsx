"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronDown, MessageSquare, Mic, Send, Sparkles, X } from "lucide-react"

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
}

const DEFAULT_BOT_REPLY = "Thanks for your message! Let me look into that for you. Could you provide a bit more detail so I can help?"

type ChatMessage = { role: "user" | "bot"; text: string }

const TYPEWRITER_PROMPTS = [
  "Create a flow for damaged items",
  "Show unpublished flows",
  "Find flows using Salesforce",
  "Create a returns journey",
]

const FLOWS = [
  { name: "Returns Flow", meta: "Last edited 1 hour ago", status: "active", path: "/flows?flow=Returns" },
  { name: "Order Tracking", meta: "Draft", status: "draft", path: "/flows?flow=Order%20Tracking" },
  { name: "Account Set Up", meta: "Published", status: "published", path: "/flows?flow=Account%20Set%20Up" },
]

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  active:    { label: "Active",     className: "bg-blue-500/15 text-blue-400 border border-blue-500/25" },
  draft:     { label: "Draft",      className: "bg-amber-500/15 text-amber-400 border border-amber-500/25" },
  published: { label: "Published",  className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" },
}

export function HomepageReturningUserV4() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [promptFocused, setPromptFocused] = useState(false)
  const promptRef = useRef<HTMLInputElement>(null)

  // Typewriter state
  const [displayText, setDisplayText] = useState("")
  const [promptIndex, setPromptIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  // Typewriter effect
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
    } else {
      if (displayText.length > 0) {
        t = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 30)
      } else {
        setIsDeleting(false)
        setPromptIndex(i => (i + 1) % TYPEWRITER_PROMPTS.length)
      }
    }
    return () => clearTimeout(t)
  }, [displayText, isDeleting, promptIndex, promptFocused, prompt])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(s => !s), 530)
    return () => clearInterval(interval)
  }, [])
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleChatSend = (text?: string) => {
    const msg = (text ?? chatInput).trim()
    if (!msg) return
    setChatInput("")
    setMessages(prev => [...prev, { role: "user", text: msg }])
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { role: "bot", text: BOT_REPLIES[msg] ?? DEFAULT_BOT_REPLY }])
    }, 1500)
  }

  const handleChatKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); handleChatSend() }
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#272C41]">
      <div className="container mx-auto h-full px-6 py-5">
        <div className="grid h-full grid-cols-12 gap-8">

          {/* Left — Pick up where you left off */}
          <div className="relative col-span-7 flex flex-col justify-center overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(47,143,255,0.2)_0%,transparent_70%)] blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-xl text-center">
              <h1 className="text-5xl font-light tracking-tight text-white mb-10">
                Hi IKEA, what would you like to continue with?
              </h1>

              <div className="flex flex-col gap-3">
                {FLOWS.map((flow) => (
                  <button
                    key={flow.name}
                    type="button"
                    onClick={() => router.push(flow.path)}
                    className="w-full flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-5 text-left hover:bg-white/[0.08] hover:border-white/20 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="text-white text-xl font-medium group-hover:text-white/90 transition-colors">
                          {flow.name}
                        </p>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${STATUS_STYLES[flow.status].className}`}>
                          {STATUS_STYLES[flow.status].label}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              {/* Syndeo Agent prompt */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 justify-center mb-4">
                  <span
                    className="block w-4 bg-[#2F8FFF]"
                    style={{ height: "3px", animation: "spin-pause 2.4s linear infinite" }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/45">Syndeo Agent</span>
                </div>
                <p className="text-2xl font-light text-white text-center mb-5">
                  Or start something new
                </p>
                <div className="rounded-2xl p-[1px]" style={{ background: "linear-gradient(135deg, #A64E8D 0%, rgba(255,255,255,0.2) 45%, #2F8FFF 100%)" }}>
                  <div
                    className="flex items-center gap-3 rounded-2xl px-7 py-5 cursor-text"
                    style={{ background: "#32374B" }}
                    onClick={() => promptRef.current?.focus()}
                  >
                    <Sparkles className="h-4 w-4 text-white/25 shrink-0" />
                    <div className="relative flex-1">
                      {!promptFocused && !prompt && (
                        <div className="pointer-events-none absolute inset-0 flex items-center">
                          <span className="text-base text-white/30">{displayText}</span>
                          <span
                            className="inline-block w-[1.5px] h-[16px] bg-[#2F8FFF] ml-0.5 align-middle"
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
                        onKeyDown={(e) => { if (e.key === "Enter" && prompt.trim()) router.push("/flows?new=true") }}
                        placeholder=""
                        className="w-full bg-transparent text-white text-base outline-none"
                        style={{ caretColor: "#2F8FFF" }}
                      />
                    </div>
                    <button
                      type="button"
                      aria-label="Use microphone"
                      className="h-11 w-11 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all shrink-0"
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => prompt.trim() && router.push("/flows?new=true")}
                      disabled={!prompt.trim()}
                      aria-label="Get started"
                      className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#A64E8D] text-white hover:bg-[#8f3f78] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — IKEA chat widget (V2) */}
          <div className="col-span-5 h-full flex flex-col items-center justify-center py-4">
            <div className="w-full max-w-[376px]">
              <div
                className="flex flex-col overflow-hidden h-[580px] rounded-[4px]"
                style={{
                  fontFamily: '"Noto IKEA","Noto Sans","Roboto","Open Sans",system-ui,sans-serif',
                  boxShadow: "0 2px 16px rgba(0,0,0,0.14)",
                }}
              >
                {/* Yellow header */}
                <div className="bg-[#FFDA1A] px-5 py-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-[#111111]" strokeWidth={2} />
                    <span className="text-[17px] font-bold text-[#111111] tracking-tight">Live IKEA Chat Simulator</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" aria-label="Minimise" className="hover:opacity-60 transition-opacity">
                      <ChevronDown className="w-5 h-5 text-[#111111]" strokeWidth={2} />
                    </button>
                    <button type="button" aria-label="Close" className="hover:opacity-60 transition-opacity">
                      <X className="w-5 h-5 text-[#111111]" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-white px-4 pt-5 pb-3 space-y-4">
                  <p className="text-[13px] text-[#767676]">Billie the bot 🤖 has connected to the chat</p>

                  <div className="border border-[#E0E0E0] bg-white rounded-[12px] px-4 py-3 max-w-[90%]">
                    <p className="text-[15px] text-[#111111] leading-relaxed">
                      Hej! I&apos;m Billie 🤖, your IKEA United Kingdom customer support bot.
                    </p>
                  </div>

                  <div className="border border-[#E0E0E0] bg-white rounded-[12px] px-4 py-3 max-w-[90%]">
                    <p className="text-[15px] text-[#111111] leading-relaxed">
                      I perform best when you ask full questions. To get started, type your question or choose one of the following options:
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {CHAT_CHIPS.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleChatSend(label)}
                        className="bg-[#EBEBEB] rounded-[20px] px-3 py-3 text-[14px] font-bold text-[#111111] text-left leading-tight hover:bg-[#DCDCDC] transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {messages.map((msg, i) => (
                    msg.role === "user" ? (
                      <div key={i} className="flex justify-end">
                        <div className="px-4 py-3 max-w-[80%] bg-[#FFDA1A] rounded-[12px]">
                          <p className="text-[15px] text-[#111111] leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="border border-[#E0E0E0] bg-white rounded-[12px] px-4 py-3 max-w-[90%]">
                        <p className="text-[15px] text-[#111111] leading-relaxed">{msg.text}</p>
                      </div>
                    )
                  ))}

                  {isTyping && (
                    <div className="border border-[#E0E0E0] bg-white rounded-[12px] px-4 py-3 max-w-[72px]">
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

                {/* Input */}
                <div className="shrink-0 bg-white border-t border-[#E0E0E0] px-5 py-4 flex items-center gap-3">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKey}
                    placeholder="Test your simulator here"
                    className="flex-1 text-[15px] text-[#111111] placeholder:text-[#767676] bg-transparent border-none outline-none"
                    style={{ fontFamily: '"Noto IKEA","Noto Sans","Roboto",system-ui,sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleChatSend()}
                    disabled={!chatInput.trim()}
                    className="text-[#767676] disabled:text-[#CCCCCC] hover:text-[#111111] transition-colors"
                  >
                    <Send className="w-5 h-5" strokeWidth={1.5} />
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

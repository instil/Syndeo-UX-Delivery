"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ChevronDown, GitBranch, MessageSquare, Mic, Plus, Send, TestTube, Upload, X } from "lucide-react"

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
}

const DEFAULT_BOT_REPLY = "Thanks for your message! Let me look into that for you. Could you provide a bit more detail so I can help?"

type ChatMessage = { role: "user" | "bot"; text: string }

export function HomepageReturningUserV2() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
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

          {/* Right — IKEA Billie simulator (pixel-accurate replica) */}
          <div className="col-span-5 flex flex-col items-center justify-center py-4">
            <div className="w-full max-w-[376px]">

              {/* IKEA Billie chat widget — pixel-accurate */}
              <div
                className="flex flex-col overflow-hidden h-[580px] rounded-[4px]"
                style={{
                  fontFamily: '"Noto IKEA","Noto Sans","Roboto","Open Sans",system-ui,sans-serif',
                  boxShadow: "0 2px 16px rgba(0,0,0,0.14)",
                }}
              >
                {/* Yellow header: chat icon + "IKEA Chat" + chevron + X */}
                <div className="bg-[#FFDA1A] px-5 py-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-[#111111]" strokeWidth={2} />
                    <span className="text-[17px] font-bold text-[#111111] tracking-tight">IKEA Chat Simulator</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" aria-label="Minimise chat" className="hover:opacity-60 transition-opacity">
                      <ChevronDown className="w-5 h-5 text-[#111111]" strokeWidth={2} />
                    </button>
                    <button type="button" aria-label="Close chat" className="hover:opacity-60 transition-opacity">
                      <X className="w-5 h-5 text-[#111111]" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Message area */}
                <div className="flex-1 overflow-y-auto bg-white px-4 pt-5 pb-3 space-y-4">
                  {/* System message — left-aligned */}
                  <p className="text-[13px] text-[#767676]">Billie the bot 🤖 has connected to the chat</p>

                  {/* Bot message 1 */}
                  <div className="border border-[#E0E0E0] bg-white rounded-[12px] px-4 py-3 max-w-[90%]">
                    <p className="text-[15px] text-[#111111] leading-relaxed">
                      Hej! I&apos;m Billie 🤖, your IKEA United Kingdom customer support bot.
                    </p>
                  </div>

                  {/* Bot message 2 */}
                  <div className="border border-[#E0E0E0] bg-white rounded-[12px] px-4 py-3 max-w-[90%]">
                    <p className="text-[15px] text-[#111111] leading-relaxed">
                      If you&apos;re contacting us about a kitchen after-sales query, please call us instead on 01733520006.
                    </p>
                  </div>

                  {/* Bot message 3 */}
                  <div className="border border-[#E0E0E0] bg-white rounded-[12px] px-4 py-3 max-w-[90%]">
                    <p className="text-[15px] text-[#111111] leading-relaxed">
                      I perform best when you ask full questions. To get started, type your question or choose one of the following options:
                    </p>
                  </div>

                  {/* Quick reply chips — 2-column grid, gray bg, bold text */}
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

                  {/* Conversation thread */}
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

                  {/* Typing indicator */}
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

                {/* Input bar */}
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
                    aria-label="Send message"
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

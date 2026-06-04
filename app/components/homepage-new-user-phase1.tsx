"use client"

import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { MessageSquare, ArrowRight, Send, ChevronDown, X, Sparkles, Package, RefreshCw, User, Truck, Search, CloudUpload } from "lucide-react"

const DEFAULT_BOT_REPLY = "Thanks for your message! Let me look into that for you. Could you provide a bit more detail so I can help?"

type SimulatorFlow = {
  label: string
  description: string
  icon: React.ElementType
  greeting: string
  chips: string[]
  replies: Record<string, string>
}

const SIMULATOR_FLOWS: SimulatorFlow[] = [
  {
    label: "Returns Flow",
    description: "Handle returns, refunds and missing labels",
    icon: RefreshCw,
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
    description: "Track orders, delivery dates and address changes",
    icon: Package,
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
    description: "Guide new customers through account creation",
    icon: User,
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
  {
    label: "Delivery Query",
    description: "Answer delivery cost, delay and rescheduling questions",
    icon: Truck,
    greeting: "Hej! I'm Billie 🤖. I can help with your delivery query. What would you like to know?",
    chips: ["📦 Where's my order?", "🚚 Delivery delay", "📅 Reschedule delivery", "🏠 Change address", "❓ Delivery cost", "📄 Delivery receipt"],
    replies: {
      "📦 Where's my order?": "I can look up your delivery status. Please share your order number and I'll check right away.",
      "🚚 Delivery delay": "I'm sorry your delivery is delayed. Could you share your order number so I can investigate?",
      "📅 Reschedule delivery": "I can help reschedule your delivery. Please share your order number and preferred dates.",
      "🏠 Change address": "I can check if your address can still be updated. Please share your order number.",
      "❓ Delivery cost": "Delivery costs vary by order size and location. Could you share your postcode for an accurate quote?",
      "📄 Delivery receipt": "I can resend your delivery confirmation. What email address is linked to your order?",
    },
  },
  {
    label: "Product Availability",
    description: "Check stock levels, find in-store and set alerts",
    icon: Search,
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

export function HomepageNewUserPhase1() {
  const [chatInput, setChatInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeFlowIndex, setActiveFlowIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleChatSend = (text?: string) => {
    const msg = (text ?? chatInput).trim()
    if (!msg || activeFlowIndex === null) return
    const activeFlow = SIMULATOR_FLOWS[activeFlowIndex]
    setChatInput("")
    setMessages((prev) => [...prev, { role: "user", text: msg }])
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { role: "bot", text: activeFlow.replies[msg] ?? DEFAULT_BOT_REPLY }])
    }, 1500)
  }

  const handleFlowSelect = (index: number) => {
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

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[#272C41] flex flex-col pb-16" style={{ scrollbarWidth: "none" }}>
      <div className="relative z-10 container mx-auto px-6 py-8 flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="relative mb-8 flex flex-col items-center text-center gap-4">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[400px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(47,143,255,0.15)_0%,transparent_70%)] blur-3xl" />
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-light tracking-tight text-white">{greeting} IKEA.</h1>
            <p className="text-4xl font-light tracking-tight text-white">Let's explore what your agent can do.</p>
          </div>
        </div>

        {/* Trial panel + Simulator */}
        <div className="mx-auto w-fit overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-white">Try an AI Agent</p>
            <button className="flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-white">
              View All <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-stretch flex-1 min-h-0">
            {/* Agent list */}
            <div className="flex w-[540px] shrink-0 flex-col gap-3 border-r border-white/10 p-5 overflow-y-auto">
              {SIMULATOR_FLOWS.map((flow, i) => {
                const Icon = flow.icon
                const isActive = activeFlowIndex === i
                return (
                  <div
                    key={flow.label}
                    className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3 transition-all ${
                      isActive
                        ? "border-[#2F8FFF]/40 bg-[#2F8FFF]/[0.06]"
                        : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                      isActive ? "bg-[#A64E8D]/20" : "bg-[#A64E8D]/10"
                    }`}>
                      <Icon className="h-4 w-4 text-[#A64E8D]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-none text-white">{flow.label}</p>
                      <p className="mt-1 text-xs text-white/50">{flow.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFlowSelect(i)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                        isActive
                          ? "border border-white/15 bg-white/[0.08] text-white/60 hover:bg-white/[0.15] hover:text-white"
                          : "bg-[#A64E8D] text-white hover:bg-[#95437D]"
                      }`}
                    >
                      {isActive ? <CloudUpload className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                      {isActive ? "Install" : "Try"}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Blue-style Simulator */}
            <div className="flex w-fit shrink-0 flex-col p-5">
              <div
                className="flex h-full w-[376px] flex-col overflow-hidden rounded-[4px]"
                style={{
                  fontFamily: '"Noto IKEA","Noto Sans","Roboto","Open Sans",system-ui,sans-serif',
                  boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                }}
              >
                {/* Blue header */}
                <div className="flex shrink-0 items-center justify-between bg-[#2F8FFF] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-white" strokeWidth={2} />
                    <span className="text-[15px] font-bold tracking-tight text-white">Simulator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" aria-label="Minimise" className="transition-opacity hover:opacity-60">
                      <ChevronDown className="h-4 w-4 text-white" strokeWidth={2} />
                    </button>
                    <button type="button" aria-label="Close" className="transition-opacity hover:opacity-60">
                      <X className="h-4 w-4 text-white" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white px-4 pb-3 pt-4 space-y-3">
                  {activeFlowIndex === null ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2F8FFF]/10">
                        <Sparkles className="h-6 w-6 text-[#2F8FFF]" />
                      </div>
                      <p className="text-[14px] font-medium text-[#3B4760]">Select an agent to try it</p>
                      <p className="text-[12px] text-[#767676]">See how it responds to your customers</p>
                    </div>
                  ) : (
                    <>
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
                            className="rounded-[20px] bg-[#EBF4FF] px-2 py-2.5 text-left text-[13px] font-bold leading-tight text-[#2F8FFF] transition-colors hover:bg-[#DCEEFF]"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      {messages.map((msg, i) =>
                        msg.role === "user" ? (
                          <div key={i} className="flex justify-end">
                            <div className="max-w-[80%] rounded-[12px] bg-[#2F8FFF] px-3 py-2.5">
                              <p className="text-[14px] leading-relaxed text-white">{msg.text}</p>
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
                    </>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3 border-t border-[#E0E0E0] bg-white px-4 py-3">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKey}
                    placeholder={activeFlowIndex === null ? "Select an agent to start" : "Type a message..."}
                    disabled={activeFlowIndex === null}
                    className="flex-1 border-none bg-transparent text-[14px] text-[#111111] outline-none placeholder:text-[#767676] disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ fontFamily: '"Noto IKEA","Noto Sans","Roboto",system-ui,sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleChatSend()}
                    disabled={!chatInput.trim()}
                    className="text-[#2F8FFF] transition-colors hover:text-[#1E7FEF] disabled:text-[#CCCCCC]"
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

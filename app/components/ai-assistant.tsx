"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  isNewUser?: boolean
  onDismiss?: () => void
}

export function AIAssistant({ isNewUser = false, onDismiss }: AIAssistantProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: isNewUser
        ? "Hi! 👋 I'm your Syndeo assistant. I'm here to help you get started. Would you like me to guide you through creating your first conversational flow?"
        : "Hi! 👋 I'm your Syndeo assistant. I can help you create flows, configure channels, or answer questions about your bot. What would you like to do today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response with intelligent routing
    setTimeout(() => {
      const response = generateResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)

      // Handle navigation if response includes routing
      if (response.action) {
        setTimeout(() => {
          response.action?.()
        }, 1500)
      }
    }, 1200)
  }

  const generateResponse = (userInput: string): { message: string; action?: () => void } => {
    const input = userInput.toLowerCase()

    // Flow creation patterns
    if (input.includes("create") && input.includes("flow")) {
      return {
        message: "Great! I'll help you create a new flow. I'm taking you to the flow builder now where we can set it up together...",
        action: () => router.push("/flows?new=true"),
      }
    }

    if (input.includes("order") && (input.includes("number") || input.includes("status"))) {
      return {
        message: "Perfect! I'll create an 'Order Status Lookup' flow for you. Taking you to the flow builder with a pre-populated template...",
        action: () => router.push("/flows?template=order-status"),
      }
    }

    // Channel configuration
    if (input.includes("channel") || input.includes("facebook") || input.includes("whatsapp")) {
      return {
        message: "I can help you connect a new channel. Let me take you to the Channels page where we can configure your integration...",
        action: () => router.push("/channels"),
      }
    }

    // Reports / Analytics
    if (input.includes("report") || input.includes("analytic") || input.includes("conversation")) {
      return {
        message: "I'll show you your conversation analytics and reports. Taking you there now...",
        action: () => router.push("/reports"),
      }
    }

    // Getting started
    if (input.includes("help") || input.includes("start") || input.includes("guide")) {
      return {
        message:
          "I'd be happy to help! Here are some things I can do:\n\n• Create and configure flows\n• Connect channels (Facebook, WhatsApp, Web)\n• Show analytics and reports\n• Help with AI training and intents\n\nWhat would you like to focus on?",
      }
    }

    // Default helpful response
    return {
      message:
        "I'm here to help! You can ask me to:\n\n• Create a new flow (e.g., 'Create a flow for customer support')\n• Connect a channel (e.g., 'Add Facebook to my bot')\n• View reports (e.g., 'Show me conversation analytics')\n\nWhat would you like to do?",
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = isNewUser
    ? [
        { label: "Create my first flow", action: "I want to create my first flow" },
        { label: "Connect a channel", action: "Help me connect a channel" },
        { label: "Show me around", action: "Give me a tour of the platform" },
      ]
    : [
        { label: "Create new flow", action: "Create a new flow" },
        { label: "View analytics", action: "Show me my reports" },
        { label: "Configure channels", action: "I want to configure channels" },
      ]

  return (
    <div className="bg-white border border-[#E8F0FB] rounded-lg overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E8F0FB] bg-gradient-to-r from-[#E8F0FB] to-white">
        <div className="w-10 h-10 rounded-full bg-[#2F8FFF] flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#3B4760]">Syndeo Assistant</h3>
          <p className="text-xs text-[#6A738A]">Your AI-powered platform guide</p>
        </div>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss} className="text-[#6A738A] hover:text-[#3B4760]">
            Minimize
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px] max-h-[500px]">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-[#2F8FFF] text-white"
                  : "bg-[#F6F8FA] text-[#3B4760] border border-[#E8F0FB]"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user" ? "text-white/70" : "text-[#94A3B8]"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#F6F8FA] text-[#3B4760] border border-[#E8F0FB] rounded-lg px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4 space-y-2">
          <p className="text-xs font-medium text-[#6A738A] uppercase tracking-wide mb-2">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInput(action.action)}
                className="text-xs px-3 py-1.5 bg-[#E8F0FB] text-[#2F8FFF] rounded-full hover:bg-[#2F8FFF] hover:text-white transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-[#E8F0FB] bg-[#F6F8FA]">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 bg-white border-[#E8F0FB] text-[#3B4760] placeholder:text-[#94A3B8]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

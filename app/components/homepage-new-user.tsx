"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Send, Sparkles, Mic, Globe, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export function HomepageNewUser() {
  const router = useRouter()
  const [input, setInput] = useState("")

  const quickActions = [
    { label: "Create my first flow", icon: Plus, action: () => router.push("/flows?new=true") },
    { label: "Connect a channel", icon: Globe, action: () => router.push("/channels") },
    { label: "What can Syndeo do?", icon: HelpCircle, action: () => setInput("What can Syndeo do?") },
  ]

  const handleSend = () => {
    if (!input.trim()) return
    const userInput = input.toLowerCase()
    if (userInput.includes("create") && userInput.includes("flow")) {
      router.push("/flows?new=true")
    } else if (userInput.includes("channel")) {
      router.push("/channels")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-[#F6F8FA] to-white">
      <div className="container mx-auto px-6 py-5 h-full flex items-center justify-center">
        <div className="w-full max-w-2xl flex flex-col justify-center relative">

          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(47,143,255,0.18)_0%,rgba(47,143,255,0.06)_45%,transparent_70%)] blur-3xl" />
          </div>

          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F8FFF] rounded-full mb-3 shadow-sm">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Your Syndeo Assistant</span>
            </div>

            <h1 className="text-3xl font-bold text-[#3B4760] mb-2">
              Welcome IKEA! Let's get started.
            </h1>

            <div className="my-6">
              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Hi, I'm Syndeo 👋, ask me anything."
                  className="w-full h-14 pl-6 pr-28 text-base bg-white border-2 border-[#E8F0FB] rounded-2xl shadow-lg focus:border-[#2F8FFF] focus:ring-2 focus:ring-[#2F8FFF]/20 text-[#3B4760] placeholder:text-[#94A3B8]"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white h-10 w-10 p-0 rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <div className="absolute right-14 top-1/2 -translate-y-1/2 group">
                  <button className="h-10 w-10 p-0 rounded-xl flex items-center justify-center text-[#6A738A] hover:text-[#2F8FFF] hover:bg-[#E8F0FB] transition-all">
                    <Mic className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1E293B] text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Use voice mode
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E293B]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/40 backdrop-blur-sm border border-white rounded-full hover:bg-white/70 transition-all text-sm font-medium text-[#3B4760] shadow-[0_2px_12px_rgba(47,143,255,0.2)]"
                  >
                    <Icon className="h-4 w-4 text-[#6A738A]" />
                    {action.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  RefreshCw,
  Minimize2,
  Maximize2,
  ArrowLeftRight,
  Send,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export function CompactSimulator({ theme = "ikea" }: { theme?: "ikea" | "default" }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  const isIkea = theme === "ikea"
  const headerBg = isIkea ? "bg-[#FFDA1A]" : "bg-[#2F8FFF]"
  const headerText = isIkea ? "text-black" : "text-white"
  const borderColor = isIkea ? "border-[#FFDA1A]" : "border-[#2F8FFF]"
  const userBubbleBg = isIkea ? "bg-[#FFDA1A]" : "bg-[#2F8FFF]"
  const userBubbleText = isIkea ? "text-[#111111]" : "text-white"
  const title = isIkea ? "IKEA Simulator" : "Simulator"

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card
        className={`bg-white shadow-2xl border-2 ${borderColor} transition-all duration-300 px-2 !gap-0 ${isExpanded ? "!py-0" : "!py-4"} ${isMaximized ? "w-[400px]" : "w-72"}`}
      >
        {/* Header */}
        <div
          className={`${headerBg} px-4 py-3 flex items-center justify-between cursor-pointer -mx-2 ${isExpanded ? "rounded-t-lg" : ""}`}
          onClick={(e) => {
            if ((e.target as HTMLElement).tagName !== "BUTTON" && !(e.target as HTMLElement).closest("button")) {
              setIsExpanded(!isExpanded)
            }
          }}
        >
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${headerText}`}>{title}</span>
            <ArrowLeftRight className={`w-3.5 h-3.5 ${headerText} opacity-50`} />
          </div>
          <div className="flex items-center gap-1">
            <div className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${headerText} hover:bg-black/10`}
                onClick={(e) => { e.stopPropagation() }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E293B] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Restart
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E293B]" />
              </div>
            </div>
            <div className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${headerText} hover:bg-black/10`}
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false) }}
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </Button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E293B] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Collapse
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E293B]" />
              </div>
            </div>
            <div className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${headerText} hover:bg-black/10`}
                onClick={(e) => { e.stopPropagation(); setIsMaximized(!isMaximized) }}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E293B] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {isMaximized ? "Shrink" : "Expand"}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E293B]" />
              </div>
            </div>
            <div className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${headerText} hover:bg-black/10`}
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded) }}
              >
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </Button>
              <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-[#1E293B] text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {isExpanded ? "Close chat" : "Open chat"}
                <div className="absolute top-full right-2 border-4 border-transparent border-t-[#1E293B]" />
              </div>
            </div>
          </div>
        </div>

        {/* Chat content */}
        <div className={`rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="p-4 space-y-3 h-[380px] overflow-y-auto bg-white">
              <p className="text-xs text-center text-[#767676]">Billie the bot 🤖 has connected to the chat</p>

              <div className="bg-white border border-[#E0E0E0] rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-[#111111]">Hej! I'm Billie 🤖, your IKEA United Kingdom customer support bot.</p>
              </div>

              <div className="bg-white border border-[#E0E0E0] rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-[#111111]">I perform best when you ask full questions. To get started, type your question or choose one of the following options:</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {["📦 Manage your Order", "📄 Case Status", "🔧 Spare Parts", "💥 Damaged Item"].map((label) => (
                  <button
                    key={label}
                    className="px-3 py-2 bg-[#F0F0F0] rounded-full text-xs font-semibold text-[#111111] hover:bg-[#E0E0E0] transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <div className={`${userBubbleBg} rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]`}>
                  <p className={`text-sm ${userBubbleText}`}>I need help with my order</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#E0E0E0] bg-white flex items-center gap-2 rounded-b-lg">
              <Input
                placeholder="Type your message here."
                className="flex-1 text-sm border-none shadow-none focus-visible:ring-0 text-[#111111] placeholder:text-[#767676]"
              />
              <button className="text-[#767676] hover:text-[#111111] transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
      </Card>
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, ChevronDown, Send, RefreshCw, Pencil } from "lucide-react"
import { allOutcomes, type Outcome } from "@/lib/mock-outcomes"
import { useRouter } from "next/navigation"

type Panel = "closed" | "picker" | "chat"

export function FloatingSimulatorLauncher({ disabled = false }: { disabled?: boolean }) {
  const [panel, setPanel] = useState<Panel>("closed")
  const [selectedFlow, setSelectedFlow] = useState<Outcome | null>(null)
  const [input, setInput] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPanel("closed")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleFlowSelect = (flow: Outcome) => {
    setSelectedFlow(flow)
    setInput("")
    setPanel("chat")
  }

  const handleReset = () => {
    setSelectedFlow(null)
    setPanel("picker")
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Flow picker */}
      {panel === "picker" && (
        <div className="w-72 rounded-xl border border-white/10 bg-[#1E2438] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Choose a flow to simulate</span>
            <button onClick={() => setPanel("closed")} className="text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="max-h-72 overflow-y-auto py-1">
            {allOutcomes.map((flow) => (
              <li key={flow.id}>
                <button
                  onClick={() => handleFlowSelect(flow)}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/[0.06] transition-colors group"
                >
                  <p className="text-sm font-medium text-white group-hover:text-[#2F8FFF] transition-colors">{flow.name}</p>
                  <p className="text-xs text-white/40 truncate mt-0.5">{flow.description}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Inline chat panel */}
      {panel === "chat" && selectedFlow && (
        <div className="w-80 rounded-xl bg-white shadow-2xl border border-[#DDE5EF] overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
          {/* Blue header */}
          <div className="bg-[#2F8FFF] px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-sm font-bold text-white truncate">{selectedFlow.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  if (selectedFlow) {
                    router.push(`/flows?outcomeId=${selectedFlow.id}&outcomeName=${encodeURIComponent(selectedFlow.name)}`)
                    setPanel("closed")
                  }
                }}
                title="Open in flow editor"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReset}
                title="Change flow"
                className="text-white/70 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPanel("picker")}
                title="Back to flows"
                className="text-white/70 hover:text-white transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPanel("closed")}
                title="Close"
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Connection notice */}
          <div className="px-4 pt-3 pb-1 text-center">
            <p className="text-xs text-[#9AA3B0]">Simulator connected · {selectedFlow.name}</p>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto px-4 py-3 space-y-3">
            <div className="flex justify-start">
              <div className="max-w-[85%] px-4 py-3 text-sm leading-relaxed bg-white border border-[#E2E8F0] rounded-2xl rounded-tl-sm text-[#1E2535] shadow-sm">
                Hi! I'm ready to simulate the <strong>{selectedFlow.name}</strong> flow. How can I help you?
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#DDE5EF]">
            <div className="flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setInput("")}
                placeholder="Type a message..."
                className="flex-1 text-sm text-[#1E2535] placeholder:text-[#9AA3B0] outline-none bg-transparent"
              />
              <button
                onClick={() => setInput("")}
                className="text-[#9AA3B0] hover:text-[#2F8FFF] transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => !disabled && setPanel(panel === "closed" ? "picker" : "closed")}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white text-sm font-semibold transition-all duration-200 ${
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "hover:scale-105 hover:shadow-xl active:scale-95"
        }`}
        style={{
          background: "linear-gradient(135deg, #2F8FFF 0%, #A64E8D 100%)",
        }}
      >
        <MessageSquare className="w-4 h-4" />
        Simulate
      </button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Copy, Trash2, Home, RotateCcw, Maximize2, Settings, GitBranch, Plus, Search, ArrowUpDown, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const SORT_OPTIONS = [
  { label: "Name A–Z" },
  { label: "Name Z–A" },
  { label: "Recently updated" },
  { label: "Oldest updated" },
] as const

export function StepsView() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<(typeof SORT_OPTIONS)[number] | null>(null)

  const steps = [
    "0 parameters test",
    "0 parameters test t",
    "0 test step",
    "1 return type",
    "1 step parameters test",
    "2 return type",
    "2 step parameters",
    "3 step parameters",
    "4 step parameters",
  ]

  return (
    <>
      <div className="h-full overflow-y-auto bg-[#272C41] p-8">
        <div className="bg-[#313750] rounded-t-lg border border-white/10 p-6 mb-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Steps</h1>
              <p className="text-sm text-white/60 mt-1">Manage conversation steps and interactions</p>
            </div>
            <Button className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white gap-2">
              <Plus className="w-4 h-4" />
              Create New Step
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input placeholder="Search steps..." className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:border-[#2F8FFF] focus-visible:ring-[#2F8FFF]" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1.5 border border-white/10 bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-sm rounded-lg px-3 py-2 h-auto">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {sortOption ? sortOption.label : "Sort by"}
                  <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuItem key={opt.label} onClick={() => setSortOption(opt)} className={sortOption?.label === opt.label ? "font-semibold text-[#2F8FFF]" : ""}>
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-[#313750] rounded-b-lg border border-t-0 border-white/10 overflow-hidden">
          <div className="p-4 bg-white/[0.06] border-b border-white/10">
            <div className="text-xs font-semibold text-white/60 uppercase tracking-wide">Name</div>
          </div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border-b border-white/10 hover:bg-white/[0.04] transition-colors"
            >
              <div className="text-sm text-white">{step}</div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setSelectedStep(step)}
                  className="px-4 py-1.5 text-sm font-medium text-[#2F8FFF] bg-transparent border border-[#2F8FFF] rounded hover:bg-[#2F8FFF] hover:text-white transition-colors"
                >
                  View
                </Button>
                <Button className="p-1.5 text-white/60 hover:text-white bg-transparent hover:bg-white/10">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button className="p-1.5 rounded-full border border-white/10 bg-transparent hover:bg-white/10">
                  <GitBranch className="w-4 h-4 text-[#2F8FFF]" />
                </Button>
                <Button className="p-1.5 text-white/60 hover:text-red-400 bg-transparent hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedStep && <StepFlowModal step={selectedStep} onClose={() => setSelectedStep(null)} />}
    </>
  )
}

function StepFlowModal({ step, onClose }: { step: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(100)

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8F0FB]">
        <div className="flex items-center gap-3">
          <Button onClick={onClose} className="flex items-center gap-2 text-sm text-[#6A738A] hover:text-[#3B4760]">
            <span className="text-lg">←</span> Back
          </Button>
        </div>
        <div className="text-center flex-1">
          <h2 className="text-xl font-semibold text-[#3B4760]">{step}</h2>
          <p className="text-xs text-[#6A738A] uppercase tracking-wide mt-0.5">STEP</p>
        </div>
        <Button className="px-6 py-2 bg-[#2F8FFF] text-white text-sm font-semibold rounded-lg hover:bg-[#1a7ae0]">
          Save
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas area */}
        <div className="flex-1 relative bg-[#F6F8FA]">
          <Card className="absolute top-4 left-4 w-36 bg-white border border-[#E8F0FB] shadow-xl overflow-hidden z-10">
            <div className="p-3">
              <div className="w-full h-24 bg-[#F6F8FA] rounded relative overflow-hidden mb-3">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-16 bg-[#6A738A]/30 rounded" />
                <div
                  className="absolute border border-[#2F8FFF] bg-[#2F8FFF]/10"
                  style={{ width: "40%", height: "30%", left: "30%", top: "20%" }}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-[#6A738A] mb-3 px-1">
                <Button onClick={() => setZoom(Math.max(50, zoom - 10))} className="hover:text-[#3B4760] font-semibold">
                  −
                </Button>
                <span className="font-medium">{zoom}%</span>
                <Button
                  onClick={() => setZoom(Math.min(200, zoom + 10))}
                  className="hover:text-[#3B4760] font-semibold"
                >
                  +
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-full hover:bg-[#E8F0FB]" title="Home">
                  <Home className="w-3.5 h-3.5 text-[#6A738A]" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-full hover:bg-[#E8F0FB]" title="Refresh">
                  <RotateCcw className="w-3.5 h-3.5 text-[#6A738A]" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-full hover:bg-[#E8F0FB]" title="Edit Return Types">
                  <Maximize2 className="w-3.5 h-3.5 text-[#6A738A]" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="absolute top-[192px] left-4 bg-white border border-[#E8F0FB] shadow-lg overflow-hidden z-10">
            <Button className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#3B4760] hover:bg-[#E8F0FB] w-full border-b border-[#E8F0FB] transition-colors">
              <Maximize2 className="w-4 h-4 text-[#2F8FFF]" />
              <span className="font-medium">Edit Return Types</span>
            </Button>
            <Button className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#3B4760] hover:bg-[#E8F0FB] w-full transition-colors">
              <Settings className="w-4 h-4 text-[#2F8FFF]" />
              <span className="font-medium">Edit Parameters</span>
            </Button>
          </Card>

          {/* Flow Canvas */}
          <div className="h-full flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-4">
              {/* Start node */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#2F8FFF] to-[#1a7ae0] flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#2F8FFF] mt-2" />
              </div>

              <div className="w-px h-12 bg-[#E8F0FB]" />

              {/* Message node */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#2F8FFF] mb-2" />
                <div className="w-48 bg-[#3B4760] rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="text-[10px] text-white font-semibold uppercase tracking-wide">Message</span>
                  </div>
                  <p className="text-sm text-white">Welcome message</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#2F8FFF] mt-2" />
              </div>

              <div className="w-px h-12 bg-[#E8F0FB]" />

              {/* Question node */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#4ECDC4] mb-2" />
                <div className="w-48 bg-[#4ECDC4] rounded-lg p-4 shadow-lg border-2 border-[#3ab5ad]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl text-white">?</span>
                    <span className="text-[10px] text-white font-semibold uppercase tracking-wide">Question</span>
                  </div>
                  <p className="text-sm text-white">Ask for email</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#4ECDC4] mt-2" />
              </div>

              <div className="w-px h-12 bg-[#E8F0FB]" />

              {/* Flow node */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#9B6B9E] mb-2" />
                <div className="w-48 bg-[#9B6B9E] rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="18" r="3" />
                      <path d="M12 15v-3M9 18l3-3M15 18l-3-3" />
                    </svg>
                    <span className="text-[10px] text-white font-semibold uppercase tracking-wide">Flow</span>
                  </div>
                  <p className="text-sm text-white">2 step parameters</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#9B6B9E] mt-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - Node palette */}
        <div className="w-52 bg-white border-l border-[#E8F0FB] overflow-y-auto">
          <div className="p-3 space-y-2">
            {[
              { icon: "💬", label: "Message", color: "#3B4760" },
              { icon: "¶", label: "Paragraph", color: "#3B4760" },
              { icon: "?", label: "Question", color: "#4ECDC4" },
              { icon: "⊚", label: "Intent", color: "#4ECDC4" },
              { icon: "⚖", label: "Decision", color: "#8B8B8B" },
              { icon: "📄", label: "Script", color: "#6A738A" },
              { icon: "▦", label: "Variables", color: "#6A738A" },
              { icon: "🔔", label: "Notify", color: "#B8A5A5" },
              { icon: "🔗", label: "Flow", color: "#9B6B9E" },
              { icon: "⚡", label: "Switch", color: "#9B6B9E" },
              { icon: "→", label: "Route", color: "#3B4760" },
              { icon: "🌐", label: "Web", color: "#6FA8C4" },
              { icon: "⚡", label: "Catch", color: "#3B4760" },
              { icon: "■", label: "End", color: "#3B4760" },
            ].map((node, idx) => (
              <Button
                key={idx}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#E8F0FB] hover:border-[#2F8FFF] hover:bg-[#E8F0FB] transition-colors text-left"
                style={{ borderLeftWidth: "3px", borderLeftColor: node.color }}
              >
                <span className="text-lg">{node.icon}</span>
                <span className="text-sm text-[#3B4760] font-medium">{node.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  Copy,
  Trash2,
  X,
  Plus,
  Scale,
  MessageSquare,
  HelpCircle,
  Target,
  FileText,
  Bell,
  GitBranch,
  GitMerge,
  ArrowRight,
  Zap,
  XCircle,
  Search,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const SORT_OPTIONS = [
  { label: "Name A–Z" },
  { label: "Name Z–A" },
  { label: "Recently updated" },
  { label: "Oldest updated" },
] as const

export function GlobalSeguesView() {
  const [selectedSegue, setSelectedSegue] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<(typeof SORT_OPTIONS)[number] | null>(null)

  const segues = [
    { name: "@@@@", description: "" },
    { name: "Segue - Adviser will help", description: "" },
    { name: "Segue - Decline Information", description: "" },
    { name: "Segue - Fees", description: "" },
    { name: "Segue - Negative Feedback", description: "" },
    { name: "Segue - Opening Hours", description: "" },
    { name: "test global segue", description: "" },
    { name: "Txp 159 _'", description: "" },
  ]

  return (
    <div className="h-full overflow-y-auto bg-[#272C41] p-8">
      <div className="bg-[#313750] rounded-t-lg border border-white/10 p-6 mb-0">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Global Segues</h1>
            <p className="text-sm text-white/60">Reusable conversation flows across all outcomes</p>
          </div>
          <Button className="px-4 py-2 bg-[#2F8FFF] text-white text-sm font-medium rounded-lg hover:bg-[#1a7ae0]">
            Create New Global Segue
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search segues..."
              className="pl-10 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:border-[#2F8FFF] focus-visible:ring-[#2F8FFF]"
            />
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
        <div className="grid grid-cols-[1fr,2fr] gap-4 p-4 bg-white/[0.06] border-b border-white/10">
          <div className="text-xs font-semibold text-white/60 uppercase tracking-wide">Name</div>
          <div className="text-xs font-semibold text-white/60 uppercase tracking-wide">Description</div>
        </div>

        {segues.map((segue, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[1fr,2fr] gap-4 p-4 border-b border-white/10 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">{segue.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSegue(segue.name)}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-[#2F8FFF] border border-[#2F8FFF] rounded hover:bg-[#1a7ae0]"
                >
                  View
                </button>
                <button className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-sm text-white/60">{segue.description}</div>
          </div>
        ))}
      </div>

      {selectedSegue && <SegueModal segue={selectedSegue} onClose={() => setSelectedSegue(null)} />}
    </div>
  )
}

function SegueModal({ segue, onClose }: { segue: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[95vw] h-[90vh] bg-white rounded-lg shadow-2xl flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-[#F6F8FA] p-6 overflow-y-auto border-r border-[#E8F0FB]">
          <button onClick={onClose} className="flex items-center gap-2 text-[#6A738A] hover:text-[#3B4760] mb-6">
            <X className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>

          <h2 className="text-2xl font-semibold text-[#3B4760] mb-6">Flow: {segue}</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-[#6A738A] uppercase tracking-wide mb-2">
                Flow Name
              </label>
              <input
                type="text"
                defaultValue={segue}
                className="w-full px-3 py-2 bg-white border border-[#E8F0FB] rounded text-sm text-[#3B4760]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6A738A] uppercase tracking-wide mb-2">Intents</label>
              <div className="space-y-2">
                <div className="px-3 py-2 bg-[#2F8FFF] text-white text-sm rounded font-medium">{segue}</div>
                <input
                  type="text"
                  placeholder="Add an intent"
                  className="w-full px-3 py-2 bg-white border border-[#E8F0FB] rounded text-sm text-[#6A738A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6A738A] uppercase tracking-wide mb-2">
                Flow Description
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-white border border-[#E8F0FB] rounded text-sm text-[#3B4760] resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#2F8FFF]" />
                <span className="text-sm text-[#6A738A]">Replay question after segue</span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="w-4 h-4 text-[#2F8FFF] mt-0.5" />
                <span className="text-sm text-[#6A738A]">
                  Return directly to outcome once complete (ignore any other executing segues)
                </span>
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#6A738A] uppercase tracking-wide">
                  Custom Data Fields
                </label>
                <button className="p-1 bg-[#2F8FFF] text-white rounded hover:bg-[#1a7ae0]">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="w-full py-2 text-[#2F8FFF] border border-[#2F8FFF] rounded font-medium hover:bg-[#E8F0FB]">
              Save
            </button>

            <button className="w-full flex items-center justify-center gap-2 text-sm text-[#6A738A] hover:text-red-500">
              <Trash2 className="w-4 h-4" />
              <span>Delete Segue</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Flow Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Top toolbar */}
          <div className="h-14 border-b border-[#E8F0FB] flex items-center justify-between px-4 bg-white">
            <div className="flex items-center gap-2 text-[#6A738A]">
              <button className="p-2 hover:bg-[#F6F8FA] rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </button>
              <button className="p-2 hover:bg-[#F6F8FA] rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button className="p-2 hover:bg-[#F6F8FA] rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Canvas area */}
          <div className="flex-1 bg-[#E8F0FB] relative overflow-hidden">
            {/* Flow visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Start node */}
                <div className="flex flex-col items-center mb-8">
                  <button className="w-12 h-12 bg-[#2F8FFF] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <div className="w-0.5 h-8 bg-[#2F8FFF] my-2" />
                  <div className="w-2 h-2 bg-[#2F8FFF] rounded-full" />
                </div>

                {/* Decision node */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-0.5 h-8 bg-[#6A738A]" />
                  <div className="w-16 h-16 bg-[#6A738A] rounded-lg flex items-center justify-center shadow-lg relative">
                    <Scale className="w-8 h-8 text-white" />
                    <div className="absolute -bottom-6 text-xs text-[#3B4760] whitespace-nowrap">
                      Check ActiveQuestion
                    </div>
                  </div>
                  <div className="w-0.5 h-8 bg-[#6A738A] my-8" />
                </div>

                {/* Branch labels and nodes */}
                <div className="relative flex justify-center gap-32">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-xs text-[#6A738A]">
                    Email
                  </div>
                  <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-4 text-xs text-[#6A738A]">
                    Phone
                  </div>

                  {/* Question nodes */}
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-[#5BA3A3] rounded-full mb-2" />
                    <div className="w-12 h-12 bg-[#5BA3A3] rounded-lg flex items-center justify-center shadow-lg">
                      <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs text-[#3B4760] mt-2">Ask Email</div>
                    <div className="w-0.5 h-12 bg-[#6A738A] my-2" />
                    <div className="w-2 h-2 bg-[#6A738A] rounded-full mb-2" />
                    <div className="w-12 h-12 bg-[#6A738A] rounded-lg flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs text-[#3B4760] mt-2">Set phone number</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-[#6A738A] rounded-full mb-2" />
                    <div className="w-12 h-12 bg-[#6A738A] rounded-lg flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs text-[#3B4760] mt-2">Set Email</div>
                    <div className="w-0.5 h-12 bg-[#6A738A] my-2" />
                    <div className="w-2 h-2 bg-[#2F8FFF] rounded-full mb-2" />
                    <div className="w-12 h-12 bg-[#3B5FAD] rounded-lg flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs text-[#3B4760] mt-2 whitespace-nowrap">Email Skip Message</div>
                  </div>
                </div>

                {/* End node */}
                <div className="flex flex-col items-center mt-16">
                  <div className="w-2 h-2 bg-red-400 rounded-full mb-2" />
                  <div className="w-12 h-12 bg-[#3B4760] rounded-lg flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-[#3B4760] mt-2 whitespace-nowrap">Generic Skip Message</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar - Node palette */}
          <div className="absolute top-14 right-0 w-52 h-[calc(100%-3.5rem)] bg-white border-l border-[#E8F0FB] overflow-y-auto">
            <div className="p-3 space-y-2">
              <NodeButton icon={MessageSquare} label="Message" color="bg-[#3B5FAD]" />
              <NodeButton icon={FileText} label="Paragraph" color="bg-[#5B7A9E]" />
              <NodeButton icon={HelpCircle} label="Question" color="bg-[#5BA3A3]" />
              <NodeButton icon={Target} label="Intent" color="bg-[#5BA3A3]" />
              <NodeButton icon={Scale} label="Decision" color="bg-[#6A738A]" />
              <NodeButton icon={FileText} label="Script" color="bg-[#6A738A]" />
              <NodeButton icon={FileText} label="Variables" color="bg-[#6A738A]" />
              <NodeButton icon={Bell} label="Notify" color="bg-[#9B8BA3]" />
              <NodeButton icon={GitBranch} label="Flow" color="bg-[#9B6B9E]" />
              <NodeButton icon={GitMerge} label="Switch" color="bg-[#9B6B9E]" />
              <NodeButton icon={ArrowRight} label="Route" color="bg-[#5B7A9E]" />
              <NodeButton icon={GitBranch} label="Web" color="bg-[#5BA3A3]" />
              <NodeButton icon={Zap} label="Catch" color="bg-[#3B4760]" />
              <NodeButton icon={XCircle} label="End" color="bg-[#3B4760]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NodeButton({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <button className="w-full flex items-center gap-3 p-2 rounded hover:bg-[#F6F8FA] transition-colors group">
      <div className={`w-10 h-10 ${color} rounded flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm text-[#6A738A] group-hover:text-[#3B4760]">{label}</span>
    </button>
  )
}

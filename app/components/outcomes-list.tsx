"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus, MoreVertical, ArrowUpDown, ChevronDown, Info, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Outcome } from "@/lib/mock-outcomes"
import { mockWelcome, mockOutcomes } from "@/lib/mock-outcomes"

type SortField = "name" | "updated"
type SortDir = "asc" | "desc"

interface OutcomesListProps {
  onOutcomeClick: (outcomeId: string, outcomeName: string) => void
}

function OutcomeTable({
  items,
  searchQuery,
  onOutcomeClick,
  sortField,
  sortDir,
}: {
  items: Outcome[]
  searchQuery: string
  onOutcomeClick: (id: string, name: string) => void
  sortField?: SortField
  sortDir?: SortDir
}) {
  const filtered = items.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sorted = sortField
    ? [...filtered].sort((a, b) => {
        const valA = sortField === "name" ? a.name : a.updated
        const valB = sortField === "name" ? b.name : b.updated
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
      })
    : filtered

  return (
    <div className="rounded-xl border border-white/10 bg-[#313750] overflow-hidden">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[48%]" />
          <col className="w-[18%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">Name</th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">Description</th>
            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">Updated</th>
            <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((outcome) => (
            <tr key={outcome.id} className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors">
              <td className="px-4 py-3">
                <button
                  onClick={() => onOutcomeClick(outcome.id, outcome.name)}
                  className="text-sm font-medium text-[#2F8FFF] hover:underline"
                >
                  {outcome.name}
                </button>
              </td>
              <td className="px-4 py-3 text-sm text-white/60 truncate">{outcome.description}</td>
              <td className="px-4 py-3 text-sm text-white/60">{outcome.updated}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white text-xs rounded-lg h-7 px-3"
                    onClick={() => onOutcomeClick(outcome.id, outcome.name)}
                  >
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SORT_OPTIONS: { label: string; field: SortField; dir: SortDir }[] = [
  { label: "Name (A–Z)", field: "name", dir: "asc" },
  { label: "Name (Z–A)", field: "name", dir: "desc" },
  { label: "Recently updated", field: "updated", dir: "desc" },
  { label: "Oldest updated", field: "updated", dir: "asc" },
]

export function OutcomesList({ onOutcomeClick }: OutcomesListProps) {
  const [outcomesSearch, setOutcomesSearch] = useState("")
  const [sortOption, setSortOption] = useState<(typeof SORT_OPTIONS)[number] | null>(null)
  const [showNewOutcomeModal, setShowNewOutcomeModal] = useState(false)

  return (
    <div className="h-full flex flex-col bg-[#272C41]">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4">
        <div className="mb-6">
          <h1 className="text-2xl font-light tracking-tight text-white">Responses</h1>
          <p className="text-sm text-white/60 mt-0.5">Manage conversation responses and goals</p>
        </div>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-auto px-6 pb-6 space-y-8">

        {/* Welcome section */}
        <div>
          <h2 className="text-base font-semibold text-white mb-4">Welcome</h2>
          <OutcomeTable items={mockWelcome} searchQuery="" onOutcomeClick={onOutcomeClick} />
        </div>

        <hr className="border-white/10" />

        {/* Outcomes section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Outcomes</h2>
            <Button className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white gap-2 rounded-lg" onClick={() => setShowNewOutcomeModal(true)}>
              <Plus className="w-4 h-4" />
              New Outcome
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                placeholder="Search outcomes..."
                value={outcomesSearch}
                onChange={(e) => setOutcomesSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/30 focus:border-[#2F8FFF]"
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
                  <DropdownMenuItem
                    key={opt.label}
                    onClick={() => setSortOption(opt)}
                    className={sortOption?.label === opt.label ? "font-semibold text-[#2F8FFF]" : ""}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <OutcomeTable
            items={mockOutcomes}
            searchQuery={outcomesSearch}
            onOutcomeClick={onOutcomeClick}
            sortField={sortOption?.field}
            sortDir={sortOption?.dir}
          />
        </div>

      </div>

      {showNewOutcomeModal && <NewOutcomeModal onClose={() => setShowNewOutcomeModal(false)} onOpen={onOutcomeClick} />}
    </div>
  )
}

function NewOutcomeModal({ onClose, onOpen }: { onClose: () => void; onOpen: (id: string, name: string) => void }) {
  const [name, setName] = useState("")
  const [createIntent, setCreateIntent] = useState(true)
  const [customFields, setCustomFields] = useState<string[]>([])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#272C41] rounded-2xl border border-white/10 w-full max-w-xl shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h1 className="text-xl font-light tracking-tight text-white">Create a New Outcome</h1>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card */}
        <div className="mx-6 mb-6 mt-4 bg-[#313750] rounded-xl border border-white/10 p-6">
          {/* Card header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white">Outcome Details</span>
              <Info className="w-4 h-4 text-white/40" />
            </div>
            <button onClick={onClose} className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1">
              ← Back to Outcomes
            </button>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/40 focus:border-[#2F8FFF]"
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/40 focus:border-[#2F8FFF] resize-none"
            />
          </div>

          {/* Custom Data Fields */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Custom Data Fields</label>
              <button
                onClick={() => setCustomFields((f) => [...f, ""])}
                className="w-8 h-8 flex items-center justify-center bg-[#2F8FFF] hover:bg-[#2680E8] text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {customFields.map((_, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Field name"
                  className="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/40 focus:border-[#2F8FFF]"
                />
                <button
                  onClick={() => setCustomFields((f) => f.filter((_, i) => i !== idx))}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Create intent checkbox */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setCreateIntent((v) => !v)}
              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${createIntent ? "bg-[#2F8FFF] border-[#2F8FFF]" : "bg-transparent border-white/30"}`}
            >
              {createIntent && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
                  <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <label
              onClick={() => setCreateIntent((v) => !v)}
              className="text-xs font-semibold text-white/60 uppercase tracking-wider cursor-pointer select-none"
            >
              Create New Intent for this Outcome
            </label>
          </div>

          {/* Actions */}
          <Button
            onClick={() => { onClose(); onOpen("new", name || "Untitled Outcome") }}
            className="w-full bg-[#2F8FFF] hover:bg-[#2680E8] text-white font-semibold rounded-lg py-2.5 mb-3"
          >
            Create &amp; Open in Editor
          </Button>
          <button
            onClick={onClose}
            className="w-full text-sm text-white/50 hover:text-white transition-colors text-center"
          >
            Cancel Outcome Setup
          </button>
        </div>
      </div>
    </div>
  )
}

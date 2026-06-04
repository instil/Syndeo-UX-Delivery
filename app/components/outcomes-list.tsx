"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus, MoreVertical, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Outcome {
  id: string
  name: string
  description: string
  updated: string
}

const mockOutcomes: Outcome[] = [
  {
    id: "1",
    name: "Account Setup",
    description: "Guide users through the account creation process",
    updated: "2 days ago",
  },
  {
    id: "2",
    name: "Support Ticket",
    description: "Help users submit and track support requests",
    updated: "5 days ago",
  },
  {
    id: "fs-branch-locator",
    name: "FS_BranchLocator_V1",
    description:
      'The customer has asked where their nearest branch is. The customer may say something like "Where is my nearest branch?" or "I want to do this in branch".',
    updated: "Just now",
  },
  {
    id: "3",
    name: "Re-Mortgage",
    description: "Assist customers with remortgage applications and questions",
    updated: "1 week ago",
  },
  {
    id: "4",
    name: "Product Information",
    description: "Provide detailed information about products and services",
    updated: "1 week ago",
  },
  {
    id: "5",
    name: "Booking Appointment",
    description: "Schedule appointments with available agents",
    updated: "2 weeks ago",
  },
]

interface OutcomesListProps {
  onOutcomeClick: (outcomeId: string, outcomeName: string) => void
}

export function OutcomesList({ onOutcomeClick }: OutcomesListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOutcomes = mockOutcomes.filter(
    (outcome) =>
      outcome.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outcome.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-full flex flex-col bg-[#F6F8FA]">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-[#1E2535]">Outcomes</h1>
            <p className="text-sm text-[#6A738A] mt-0.5">Manage conversation outcomes and goals</p>
          </div>
          <Button className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white gap-2 rounded-lg">
            <Plus className="w-4 h-4" />
            New Outcome
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A738A]" />
          <input
            placeholder="Search outcomes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#DDE5EF] bg-white text-sm text-[#1E2535] placeholder:text-[#9AA3B0] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/30 focus:border-[#2F8FFF]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="rounded-xl border border-[#DDE5EF] bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#DDE5EF]">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6A738A]">
                  <div className="flex items-center gap-1.5">Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6A738A]">
                  <div className="flex items-center gap-1.5">Description <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6A738A]">
                  <div className="flex items-center gap-1.5">Updated <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#6A738A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOutcomes.map((outcome) => (
                <tr key={outcome.id} className="border-b border-[#DDE5EF] last:border-0 hover:bg-[#F0F6FF] transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onOutcomeClick(outcome.id, outcome.name)}
                      className="text-sm font-medium text-[#2F8FFF] hover:underline"
                    >
                      {outcome.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6A738A] max-w-xs truncate">{outcome.description}</td>
                  <td className="px-4 py-3 text-sm text-[#6A738A]">{outcome.updated}</td>
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
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-[#6A738A] hover:text-[#1E2535]">
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
      </div>
    </div>
  )
}

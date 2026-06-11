"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus, MoreVertical, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const PAGE_SIZE = 5

interface GenericListViewProps {
  title: string
  type: string
}

const SORT_OPTIONS = [
  { label: "Name A–Z", field: "name", dir: "asc" },
  { label: "Name Z–A", field: "name", dir: "desc" },
  { label: "Recently updated", field: "updated", dir: "desc" },
  { label: "Oldest updated", field: "updated", dir: "asc" },
] as const

const generateMockData = (type: string) => [
  { id: "1", name: `${type} Item 1`, description: `Description for ${type} item 1`, updated: "2 days ago" },
  { id: "2", name: `${type} Item 2`, description: `Description for ${type} item 2`, updated: "5 days ago" },
  { id: "3", name: `${type} Item 3`, description: `Description for ${type} item 3`, updated: "1 week ago" },
  { id: "4", name: `${type} Item 4`, description: `Description for ${type} item 4`, updated: "2 weeks ago" },
]

export function GenericListView({ title, type }: GenericListViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<(typeof SORT_OPTIONS)[number] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const mockData = generateMockData(type)

  const filteredData = mockData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageEnd = pageStart + PAGE_SIZE
  const pageData = filteredData.slice(pageStart, pageEnd)

  return (
    <div className="h-full flex flex-col bg-[#272C41]">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-white">{title}</h1>
            <p className="text-sm text-white/60 mt-0.5">Manage your {title.toLowerCase()}</p>
          </div>
          <Button className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white gap-2 rounded-lg">
            <Plus className="w-4 h-4" />
            New {title.replace(/s$/, "")}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <DropdownMenuItem key={opt.label} onClick={() => setSortOption(opt)} className={sortOption?.label === opt.label ? "font-semibold text-[#2F8FFF]" : ""}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="rounded-xl border border-white/10 bg-[#313750] overflow-hidden">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[28%]" />
              <col className="w-[42%]" />
              <col className="w-[16%]" />
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
              {pageData.map((item) => (
                <tr key={item.id} className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#2F8FFF] truncate">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-white/60 truncate">{item.description}</td>
                  <td className="px-4 py-3 text-sm text-white/60">{item.updated}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" className="bg-[#2F8FFF] hover:bg-[#2680E8] text-white text-xs rounded-lg h-7 px-3">
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

        {/* Pagination */}
        <div className="flex items-center justify-between pt-3 pb-1 px-1">
          <p className="text-xs text-white/50">
            Showing {filteredData.length === 0 ? 0 : pageStart + 1}–{Math.min(pageEnd, filteredData.length)} of {filteredData.length} results
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${
                  page === safePage
                    ? "bg-[#2F8FFF] text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

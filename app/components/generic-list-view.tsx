"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Plus, MoreVertical, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GenericListViewProps {
  title: string
  type: string
}

const generateMockData = (type: string) => [
  { id: "1", name: `${type} Item 1`, description: `Description for ${type} item 1`, updated: "2 days ago" },
  { id: "2", name: `${type} Item 2`, description: `Description for ${type} item 2`, updated: "5 days ago" },
  { id: "3", name: `${type} Item 3`, description: `Description for ${type} item 3`, updated: "1 week ago" },
  { id: "4", name: `${type} Item 4`, description: `Description for ${type} item 4`, updated: "2 weeks ago" },
]

export function GenericListView({ title, type }: GenericListViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const mockData = generateMockData(type)

  const filteredData = mockData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]/30 focus:border-[#2F8FFF]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="rounded-xl border border-white/10 bg-[#313750] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
                  <div className="flex items-center gap-1.5">Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
                  <div className="flex items-center gap-1.5">Description <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">
                  <div className="flex items-center gap-1.5">Updated <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-white/10 last:border-0 hover:bg-white/[0.04] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#2F8FFF]">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-white/60">{item.description}</td>
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
      </div>
    </div>
  )
}

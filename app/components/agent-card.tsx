"use client"

import type { LucideIcon } from "lucide-react"
import { Download } from "lucide-react"
import { Card } from "@/components/ui/card"

interface AgentCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconColor: string
  onClick?: () => void
  hasVariants?: boolean
}

export function AgentCard({ title, description, icon: Icon, iconColor, onClick, hasVariants }: AgentCardProps) {
  return (
    <Card className="bg-[#313750] border-white/10 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`flex flex-col h-full ${hasVariants ? "cursor-pointer" : ""}`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${iconColor}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: iconColor }} />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // TODO: wire up install action
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#2F8FFF] text-white/70 hover:text-white text-xs font-medium transition-all duration-150"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
        </div>

        <h4 className="text-base font-semibold text-white mb-3">{title}</h4>

        <p className="text-sm text-white/60 leading-relaxed mb-4 flex-1">{description}</p>

        <p className="text-xs text-white/40">Published by Syndeo</p>
      </div>
    </Card>
  )
}

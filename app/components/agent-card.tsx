"use client"

import type { LucideIcon } from "lucide-react"
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
    <Card
      className={`bg-[#313750] border-white/10 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
        hasVariants ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon className="h-6 w-6" style={{ color: iconColor }} />
        </div>

        <h4 className="text-base font-semibold text-white mb-3">{title}</h4>

        <p className="text-sm text-white/60 leading-relaxed mb-4 flex-1">{description}</p>

        <p className="text-xs text-white/40">Published by Syndeo</p>
      </div>
    </Card>
  )
}

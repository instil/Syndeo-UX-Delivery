"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Download, Loader2, Check, X } from "lucide-react"
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
  const [installState, setInstallState] = useState<"idle" | "loading" | "installed" | "unloading">("idle")
  const [hoveringInstalled, setHoveringInstalled] = useState(false)

  function handleInstall(e: React.MouseEvent) {
    e.stopPropagation()
    if (installState === "idle") {
      setInstallState("loading")
      setTimeout(() => setInstallState("installed"), 1500)
    } else if (installState === "installed") {
      setHoveringInstalled(false)
      setInstallState("unloading")
      setTimeout(() => setInstallState("idle"), 1500)
    }
  }

  return (
    <Card className="bg-[#313750] border-white/10 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`flex flex-col h-full ${hasVariants ? "cursor-pointer" : ""}`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${iconColor}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: iconColor }} />
          </div>
          <button
            onClick={handleInstall}
            onMouseEnter={() => installState === "installed" && setHoveringInstalled(true)}
            onMouseLeave={() => setHoveringInstalled(false)}
            disabled={installState === "loading" || installState === "unloading"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              installState === "unloading" || installState === "loading"
                ? "bg-white/10 text-white/50 cursor-default"
                : installState === "installed" && hoveringInstalled
                ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 cursor-pointer"
                : installState === "installed"
                ? "bg-green-500/20 text-green-400 cursor-pointer"
                : "bg-white/10 hover:bg-[#2F8FFF] text-white/70 hover:text-white"
            }`}
          >
            {(installState === "loading" || installState === "unloading") && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {installState === "installed" && !hoveringInstalled && <Check className="w-3.5 h-3.5" />}
            {installState === "installed" && hoveringInstalled && <X className="w-3.5 h-3.5" />}
            {installState === "idle" && <Download className="w-3.5 h-3.5" />}
            {installState === "loading" ? "Installing…"
              : installState === "unloading" ? "Uninstalling…"
              : installState === "installed" && hoveringInstalled ? "Uninstall"
              : installState === "installed" ? "Installed"
              : "Install"}
          </button>
        </div>

        <h4 className="text-base font-semibold text-white mb-3">{title}</h4>

        <p className="text-sm text-white/60 leading-relaxed flex-1">{description}</p>
      </div>
    </Card>
  )
}

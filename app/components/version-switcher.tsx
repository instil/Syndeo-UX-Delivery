"use client"

import { useState } from "react"
import { ChevronUp, Eye } from "lucide-react"

type ReturningVersion = "phase1" | "v1" | "v2" | "v3" | "v4" | "v5"

const phase2Versions: ReturningVersion[] = ["v1", "v2", "v3", "v4", "v5"]

function getLabel(isNewUser: boolean, version: ReturningVersion): string {
  const isPhase2 = phase2Versions.includes(version)
  const phase = isPhase2 ? "Phase 2" : "Phase 1"
  const user = isNewUser ? "New User" : "Returning"
  if (!isNewUser && isPhase2) return `${phase} · ${user} · ${version.toUpperCase()}`
  return `${phase} · ${user}`
}

export function VersionSwitcher({
  version,
  onChange,
  isNewUser,
  onToggleUser,
}: {
  version: ReturningVersion
  onChange: (v: ReturningVersion) => void
  isNewUser: boolean
  onToggleUser: () => void
}) {
  const [open, setOpen] = useState(false)
  const isPhase2 = phase2Versions.includes(version)

  const select = (newIsNewUser: boolean, newVersion: ReturningVersion) => {
    if (newIsNewUser !== isNewUser) onToggleUser()
    onChange(newVersion)
    setOpen(false)
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center">

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[#DDE5EF] bg-[#F8FAFC] px-4 py-1.5 text-xs font-medium text-[#1E2535] shadow-sm hover:bg-[#EEF5FF] transition-colors"
      >
        <Eye className="w-3.5 h-3.5 text-[#6A738A]" />
        <span>Viewing: <span className="font-semibold">{getLabel(isNewUser, version)}</span></span>
        <ChevronUp className={`w-3.5 h-3.5 text-[#6A738A] transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 min-w-[240px] rounded-xl border border-[#DDE5EF] bg-white shadow-xl overflow-hidden">

          {/* Phase 1 */}
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9AA3B0]">Phase 1</span>
          </div>
          <button
            type="button"
            onClick={() => select(true, "phase1")}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
              isNewUser && !isPhase2 ? "bg-[#EEF5FF] text-[#2F8FFF] font-semibold" : "text-[#1E2535] hover:bg-[#F8FAFC]"
            }`}
          >
            <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full bg-[#6A738A]/10 text-[#6A738A] text-[10px]">👤</span>
            New User
          </button>
          <button
            type="button"
            onClick={() => select(false, "phase1")}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
              !isNewUser && version === "phase1" ? "bg-[#F9F0FF] text-[#A64E8D] font-semibold" : "text-[#1E2535] hover:bg-[#F8FAFC]"
            }`}
          >
            <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full bg-[#6A738A]/10 text-[#6A738A] text-[10px]">🔄</span>
            Returning User
          </button>

          <div className="mx-4 my-2 border-t border-[#EEF0F4]" />

          {/* Phase 2 */}
          <div className="px-4 pt-1 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9AA3B0]">Phase 2</span>
          </div>
          <button
            type="button"
            onClick={() => select(true, version !== "phase1" ? version : "v4")}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
              isNewUser && isPhase2 ? "bg-[#EEF5FF] text-[#2F8FFF] font-semibold" : "text-[#1E2535] hover:bg-[#F8FAFC]"
            }`}
          >
            <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full bg-[#6A738A]/10 text-[#6A738A] text-[10px]">👤</span>
            New User
          </button>

          {/* Returning User + versions inline */}
          <div className={`flex items-center gap-2 px-4 py-2 ${!isNewUser && isPhase2 ? "" : ""}`}>
            <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full bg-[#6A738A]/10 text-[#6A738A] text-[10px]">🔄</span>
            <span className={`text-sm ${!isNewUser && isPhase2 ? "text-[#1E2535] font-medium" : "text-[#6A738A]"}`}>Returning</span>
            <div className="flex items-center gap-1 ml-1">
              {phase2Versions.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => select(false, v)}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${
                    !isNewUser && version === v
                      ? "bg-[#2F8FFF] text-white"
                      : "bg-[#F0F4F8] text-[#6A738A] hover:bg-[#DDE5EF]"
                  }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-2" />
        </div>
      )}

      {open && <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />}
    </div>
  )
}

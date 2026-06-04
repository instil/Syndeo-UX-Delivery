"use client"

import { useState } from "react"
import { ChevronUp, Monitor, Eye } from "lucide-react"

type ReturningVersion = "phase1" | "v1" | "v2" | "v3" | "v4" | "v5"

function getLabel(isNewUser: boolean, version: ReturningVersion): string {
  if (isNewUser) return "New User"
  if (version === "phase1") return "Returning · Phase 1"
  return `Returning · Phase 2 · ${version.toUpperCase()}`
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
  const phase2Versions: ReturningVersion[] = ["v1", "v2", "v3", "v4", "v5"]

  const select = (newIsNewUser: boolean, newVersion?: ReturningVersion) => {
    if (newIsNewUser && !isNewUser) onToggleUser()
    if (!newIsNewUser && isNewUser) onToggleUser()
    if (newVersion) onChange(newVersion)
    setOpen(false)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center border-t border-[#E8F0FB] bg-white px-4 py-2 shadow-md">

      {/* Trigger button — shows exactly where you are */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[#DDE5EF] bg-[#F8FAFC] px-4 py-1.5 text-xs font-medium text-[#1E2535] shadow-sm hover:bg-[#EEF5FF] transition-colors"
      >
        <Eye className="w-3.5 h-3.5 text-[#6A738A]" />
        <span>Viewing: <span className="font-semibold">{getLabel(isNewUser, version)}</span></span>
        <ChevronUp className={`w-3.5 h-3.5 text-[#6A738A] transition-transform ${open ? "" : "rotate-180"}`} />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute bottom-full mb-2 min-w-[220px] rounded-xl border border-[#DDE5EF] bg-white shadow-xl overflow-hidden">

          {/* New User */}
          <button
            type="button"
            onClick={() => select(true)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
              isNewUser ? "bg-[#EEF5FF] text-[#2F8FFF] font-semibold" : "text-[#1E2535] hover:bg-[#F8FAFC]"
            }`}
          >
            <Monitor className="w-4 h-4 flex-shrink-0" />
            New User
          </button>

          {/* Divider + Returning label */}
          <div className="px-4 pt-2 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9AA3B0]">Returning User</span>
          </div>

          {/* Phase 1 */}
          <button
            type="button"
            onClick={() => select(false, "phase1")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
              !isNewUser && version === "phase1" ? "bg-[#F9F0FF] text-[#A64E8D] font-semibold" : "text-[#1E2535] hover:bg-[#F8FAFC]"
            }`}
          >
            <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full bg-[#A64E8D]/10 text-[#A64E8D] text-[10px] font-bold">1</span>
            Phase 1
          </button>

          {/* Phase 2 sub-versions */}
          <div className="px-4 pt-2 pb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9AA3B0]">Phase 2</span>
          </div>
          {phase2Versions.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => select(false, v)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
                !isNewUser && version === v ? "bg-[#EEF5FF] text-[#2F8FFF] font-semibold" : "text-[#1E2535] hover:bg-[#F8FAFC]"
              }`}
            >
              <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full bg-[#2F8FFF]/10 text-[#2F8FFF] text-[10px] font-bold">{v.replace("v","")}</span>
              Version {v.replace("v","").toUpperCase()}
            </button>
          ))}

          <div className="h-2" />
        </div>
      )}

      {/* Click-outside to close */}
      {open && <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />}
    </div>
  )
}

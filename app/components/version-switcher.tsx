"use client"

type ReturningVersion = "phase1" | "v1" | "v2" | "v3" | "v4" | "v5"

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
  const isPhase2 = ["v1", "v2", "v3", "v4", "v5"].includes(version)
  const phase2Versions: ReturningVersion[] = ["v1", "v2", "v3", "v4", "v5"]

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-full border border-[#E8F0FB] bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-sm">

      {/* New User / Returning toggle */}
      <div className="flex items-center gap-1 rounded-full bg-[#F8FAFC] p-0.5">
        <button
          type="button"
          onClick={() => !isNewUser && onToggleUser()}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            isNewUser ? "bg-white text-[#0F172A] shadow-sm" : "text-[#94A3B8] hover:text-[#6A738A]"
          }`}
        >
          New User
        </button>
        <button
          type="button"
          onClick={() => isNewUser && onToggleUser()}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
            !isNewUser ? "bg-white text-[#0F172A] shadow-sm" : "text-[#94A3B8] hover:text-[#6A738A]"
          }`}
        >
          Returning
        </button>
      </div>

      {/* Phase toggle — only when returning user */}
      {!isNewUser && (
        <>
          <div className="h-4 w-px bg-[#E8F0FB]" />
          <div className="flex items-center gap-1 rounded-full bg-[#F8FAFC] p-0.5">
            <button
              type="button"
              onClick={() => onChange("phase1")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                version === "phase1" ? "bg-[#A64E8D] text-white shadow-sm" : "text-[#94A3B8] hover:text-[#6A738A]"
              }`}
            >
              Phase 1
            </button>
            <button
              type="button"
              onClick={() => !isPhase2 && onChange("v4")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                isPhase2 ? "bg-white text-[#0F172A] shadow-sm" : "text-[#94A3B8] hover:text-[#6A738A]"
              }`}
            >
              Phase 2
            </button>
          </div>
        </>
      )}

      {/* V1–V5 sub-picker — only when Phase 2 is active */}
      {!isNewUser && isPhase2 && (
        <>
          <div className="h-4 w-px bg-[#E8F0FB]" />
          <div className="flex items-center gap-1">
            <span className="mr-1 text-xs text-[#94A3B8]">Version</span>
            {phase2Versions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  item === version ? "bg-[#2F8FFF] text-white" : "text-[#6A738A] hover:bg-[#F8FAFC]"
                }`}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

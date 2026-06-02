"use client"

type HomepageVersion = "v1" | "v2" | "v3" | "v4" | "v4a" | "v4b" | "v4c"

export function VersionSwitcher({
  version,
  onChange,
  isNewUser,
  onToggleUser,
}: {
  version: HomepageVersion
  onChange: (v: HomepageVersion) => void
  isNewUser: boolean
  onToggleUser: () => void
}) {
  const versions: HomepageVersion[] = ["v1", "v2", "v3", "v4", "v4a", "v4b", "v4c"]

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-3 rounded-full border border-[#E8F0FB] bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-sm">

      {/* User type toggle */}
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

      {/* Divider — only when returning user */}
      {!isNewUser && <div className="h-4 w-px bg-[#E8F0FB]" />}

      {/* Version switcher — only when returning user */}
      {!isNewUser && (
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs text-[#94A3B8]">Version</span>
          {versions.map((item) => {
            const isActive = item === version
            return (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive ? "bg-[#2F8FFF] text-white" : "text-[#6A738A] hover:bg-[#F8FAFC]"
                }`}
              >
                {item.toUpperCase()}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

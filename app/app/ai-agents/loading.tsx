import { Header } from "@/components/header"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#272C41]">
      <Header dark={true} />
      <div className="flex">
        <aside className="w-64 bg-[#313750] border-r border-white/10 min-h-[calc(100vh-64px)]">
          <div className="p-6">
            <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-4" />
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-8 bg-white/[0.06] rounded animate-pulse" />
              ))}
            </div>
          </div>
        </aside>
        <div className="flex-1 p-8">
          <div className="h-12 bg-white/10 rounded-lg mb-6 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-[#313750] rounded-lg border border-white/10 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

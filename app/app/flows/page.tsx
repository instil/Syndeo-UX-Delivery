import { Suspense } from "react"
import { FlowsWorkspace } from "@/components/flows-workspace"
import { Header } from "@/components/header"

export default function FlowsPage() {
  return (
    <div className="min-h-screen bg-[#272C41]">
      <Header dark={true} />
      <Suspense fallback={null}>
        <FlowsWorkspace />
      </Suspense>
    </div>
  )
}

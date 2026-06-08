"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#272C41]">
      <Header dark={true} />

      <main className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Reports</h1>
          <p className="text-sm text-white/60 mt-1">Analytics and insights from your conversations</p>
        </div>

        {/* Under Development Message */}
        <Card className="bg-[#313750] border-white/10">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-[#2F8FFF]/20 flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-[#2F8FFF]" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Reports Coming Soon</h2>
              <p className="text-white/60 leading-relaxed">
                This section is currently under development. Advanced reporting and analytics features will be available
                here soon, including detailed conversation insights, performance metrics, and custom report generation.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

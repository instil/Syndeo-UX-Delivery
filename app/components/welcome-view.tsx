"use client"

import { Sparkles, Workflow, Target, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const STEPS = [
  {
    title: "Create your first Outcome",
    description: "Navigate to Outcomes and define a business goal your conversation flow should achieve.",
  },
  {
    title: "Build your Flow",
    description: "Use the visual canvas to connect nodes, add branching logic, and wire up integrations.",
  },
  {
    title: "Test with the Simulator",
    description: "Run your flow end-to-end in the simulator before going live — catch issues early.",
  },
  {
    title: "Deploy to your Channels",
    description: "Publish your flow to connected channels and monitor performance in Reports.",
  },
]

interface WelcomeViewProps {
  onNewOutcome?: () => void
}

export function WelcomeView({ onNewOutcome }: WelcomeViewProps) {
  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light tracking-tight text-white mb-2">Getting Started with Flows</h1>
          <p className="text-lg text-white/60">
            Everything you need to build your first conversation flow.
            <br />
            Follow the steps below to design, test, and deploy across all your channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-[#2F8FFF]/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-[#2F8FFF]/15 flex items-center justify-center mb-4">
              <Workflow className="w-6 h-6 text-[#2F8FFF]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Visual Flow Builder</h3>
            <p className="text-sm text-white/60">
              Drag and drop nodes to create complex conversation flows with branching logic, integrations, and more.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-[#A64E8D]/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-[#A64E8D]/15 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-[#A64E8D]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Outcomes & Goals</h3>
            <p className="text-sm text-white/60">
              Define business outcomes and track how your conversations drive results across all customer touchpoints.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/15 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Test & Simulate</h3>
            <p className="text-sm text-white/60">
              Use the built-in simulator to test your flows in real-time before deploying to production channels.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Your first flow in 4 steps</h3>
            {onNewOutcome && (
              <Button
                size="sm"
                onClick={onNewOutcome}
                className="gap-1.5 bg-[#2F8FFF] hover:bg-[#2680E8] text-white text-xs rounded-lg h-7 px-3"
              >
                <Plus className="w-3 h-3" />
                New Outcome
              </Button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {STEPS.map((step, index) => (
              <div key={index} className="relative flex flex-col gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-[#2F8FFF]/15 text-[#2F8FFF]">
                    {index + 1}
                  </div>
                  {index < STEPS.length - 1 && (
                    <span className="text-white/20 text-sm">→</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-white leading-snug">{step.title}</p>
                <p className="text-xs text-white/50 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, CheckCircle2, Package, ShoppingCart, Sparkles, Truck } from "lucide-react"

// ── Data ──────────────────────────────────────────────────────────────────────

const OPPORTUNITIES = [
  {
    id: "stock-check",
    icon: Package,
    accentColor: "#2F8FFF",
    accentBg: "rgba(47,143,255,0.07)",
    accentBorder: "rgba(47,143,255,0.2)",
    title: "Stock Availability Queries",
    stat: "742",
    statContext: "customers asked about stock this month",
    impact: "A Stock Check Agent could handle these automatically, reducing contact centre demand.",
    agentLabel: "Stock Check Agent",
  },
  {
    id: "abandoned-cart",
    icon: ShoppingCart,
    accentColor: "#F59E0B",
    accentBg: "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.2)",
    title: "Abandoned Cart Recovery",
    stat: "£28k",
    statContext: "in potential revenue left on the table this month",
    impact: "An Abandoned Cart Agent could re-engage customers at the moment they leave.",
    agentLabel: "Abandoned Cart Agent",
  },
  {
    id: "order-tracking",
    icon: Truck,
    accentColor: "#A64E8D",
    accentBg: "rgba(166,78,141,0.07)",
    accentBorder: "rgba(166,78,141,0.2)",
    title: "Order Tracking Requests",
    stat: "2,103",
    statContext: "order status queries submitted this week",
    impact: "An Order Tracking Agent could automate 85% of these, saving 280 agent hours.",
    agentLabel: "Order Tracking Agent",
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function HomepageReturningUserV4() {
  const router = useRouter()
  const [installed, setInstalled] = useState<Set<string>>(new Set())

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#272C41] overflow-y-auto">
      <div className="container mx-auto px-6 py-16">

        {/* Hero */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="mb-5 inline-flex items-center gap-2.5">
            <span
              className="block w-4 bg-[#2F8FFF]"
              style={{ height: "3px", animation: "spin-pause 2.4s linear infinite" }}
            />
            <span className="text-xs font-semibold uppercase tracking-widest text-white/45">
              Syndeo Agent
            </span>
          </div>
          <h1 className="text-5xl font-light tracking-tight text-white mb-4">
            Automation Opportunities
          </h1>
          <p className="text-white/45 text-lg font-light">
            {"We've identified "}
            <span className="text-white/75">3 opportunities</span>
            {" where AI could reduce customer effort and increase automation."}
          </p>
        </div>

        {/* Opportunity Cards */}
        <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          {OPPORTUNITIES.map((opp) => {
            const Icon = opp.icon
            const isInstalled = installed.has(opp.id)
            return (
              <div
                key={opp.id}
                className="rounded-2xl border bg-white/[0.04] backdrop-blur-sm p-8 flex flex-col gap-6"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                {/* Icon */}
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center border"
                  style={{ background: opp.accentBg, borderColor: opp.accentBorder }}
                >
                  <Icon className="h-5 w-5" style={{ color: opp.accentColor }} />
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-white font-semibold text-lg leading-snug mb-1">
                    {opp.title}
                  </h2>
                  {isInstalled && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Agent Installed
                    </span>
                  )}
                </div>

                {/* Stat */}
                <div
                  className="rounded-xl px-5 py-4 border"
                  style={{ background: opp.accentBg, borderColor: opp.accentBorder }}
                >
                  <span className="block text-4xl font-bold mb-1" style={{ color: opp.accentColor }}>
                    {opp.stat}
                  </span>
                  <span className="text-white/50 text-sm">{opp.statContext}</span>
                </div>

                {/* Impact */}
                <p className="text-white/50 text-sm leading-relaxed flex-1">
                  {opp.impact}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2.5 mt-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-3 w-3 text-white/25" />
                    <span className="text-xs text-white/35">{opp.agentLabel}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInstalled(prev => new Set(prev).add(opp.id))}
                    disabled={isInstalled}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-all"
                    style={
                      isInstalled
                        ? {
                            background: "rgba(16,185,129,0.1)",
                            color: "#10B981",
                            borderColor: "rgba(16,185,129,0.3)",
                          }
                        : {
                            background: opp.accentColor,
                            color: "#fff",
                            borderColor: "transparent",
                          }
                    }
                  >
                    {isInstalled ? "Installed ✓" : "Install Agent"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/flows?new=true")}
                    className="w-full py-2 rounded-xl text-sm font-medium border border-white/12 text-white/50 hover:text-white/75 hover:border-white/25 transition-colors"
                  >
                    View Agent
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

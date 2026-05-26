"use client"

import { AIAssistant } from "@/components/ai-assistant"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, MessageSquare, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

export function HomepageReturningUser() {
  const recentFlows = [
    {
      name: "Welcome Flow",
      lastEdited: "2 hours ago",
      status: "published" as const,
      conversations: 1247,
    },
    {
      name: "Order Status Lookup",
      lastEdited: "1 day ago",
      status: "draft" as const,
      conversations: 0,
    },
    {
      name: "FAQ Handler",
      lastEdited: "3 days ago",
      status: "published" as const,
      conversations: 823,
    },
  ]

  const quickMetrics = [
    {
      label: "Today's Conversations",
      value: "342",
      change: "+12%",
      trend: "up" as const,
    },
    {
      label: "Avg. Response Time",
      value: "1.2s",
      change: "-8%",
      trend: "down" as const,
    },
    {
      label: "Resolution Rate",
      value: "87%",
      change: "+5%",
      trend: "up" as const,
    },
  ]

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#3B4760] mb-2">Welcome back</h1>
            <p className="text-lg text-[#6A738A]">Here's what's happening with your bot today</p>
          </div>
          <Link href="/flows?new=true">
            <Button className="bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white gap-2">
              <Plus className="h-4 w-4" />
              New Flow
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Assistant - Always Available */}
          <div className="lg:col-span-2">
            <AIAssistant isNewUser={false} />

            {/* Recent Flows */}
            <Card className="bg-white border border-[#E8F0FB] rounded-lg p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#3B4760]">Recent Flows</h3>
                <Link href="/flows" className="text-sm text-[#2F8FFF] hover:text-[#1E7FEF] flex items-center gap-1">
                  View all
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentFlows.map((flow, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F6F8FA] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <MessageSquare className="h-4 w-4 text-[#6A738A]" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-[#3B4760]">{flow.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-[#6A738A]">
                            <Clock className="h-3 w-3" />
                            {flow.lastEdited}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              flow.status === "published"
                                ? "bg-[#10B981]/10 text-[#10B981]"
                                : "bg-[#94A3B8]/10 text-[#6A738A]"
                            }`}
                          >
                            {flow.status}
                          </span>
                        </div>
                      </div>
                      {flow.status === "published" && (
                        <span className="text-sm font-medium text-[#6A738A]">
                          {flow.conversations.toLocaleString()} conversations
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Metrics */}
            <Card className="bg-white border border-[#E8F0FB] rounded-lg p-6">
              <h3 className="text-base font-semibold text-[#3B4760] mb-4">Today's Metrics</h3>
              <div className="space-y-4">
                {quickMetrics.map((metric, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#6A738A]">{metric.label}</span>
                      <span
                        className={`text-xs font-medium flex items-center gap-1 ${
                          metric.trend === "up" ? "text-[#10B981]" : "text-[#2F8FFF]"
                        }`}
                      >
                        <TrendingUp
                          className={`h-3 w-3 ${metric.trend === "down" ? "rotate-180" : ""}`}
                        />
                        {metric.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-[#3B4760]">{metric.value}</p>
                  </div>
                ))}
              </div>
              <Link href="/reports" className="block mt-4">
                <Button
                  variant="outline"
                  className="w-full border-[#E8F0FB] text-[#2F8FFF] hover:bg-[#E8F0FB]"
                >
                  View Full Reports
                </Button>
              </Link>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white border border-[#E8F0FB] rounded-lg p-6">
              <h3 className="text-base font-semibold text-[#3B4760] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/flows?new=true">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#E8F0FB] text-[#3B4760] hover:bg-[#E8F0FB]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Flow
                  </Button>
                </Link>
                <Link href="/channels">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#E8F0FB] text-[#3B4760] hover:bg-[#E8F0FB]"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Manage Channels
                  </Button>
                </Link>
                <Link href="/ai-workbench">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#E8F0FB] text-[#3B4760] hover:bg-[#E8F0FB]"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Train AI
                  </Button>
                </Link>
              </div>
            </Card>

            {/* System Status */}
            <Card className="bg-gradient-to-br from-[#10B981]/5 to-white border border-[#10B981]/20 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#10B981] mt-1.5 animate-pulse"></div>
                <div>
                  <h4 className="text-sm font-semibold text-[#3B4760] mb-1">All Systems Operational</h4>
                  <p className="text-xs text-[#6A738A]">Your bot is running smoothly across all channels</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

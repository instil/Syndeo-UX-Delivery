"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, TrendingUp, Clock, ExternalLink, Send, Sparkles, BarChart3, Globe, MessageSquare, Mic } from "lucide-react"
import { FaFacebookMessenger, FaWhatsapp, FaInstagram, FaSlack } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function HomepageReturningUser() {
  const router = useRouter()
  const [input, setInput] = useState("")

  const recentFlows = [
    { name: "Welcome Flow", lastEdited: "2 hours ago", status: "published" as const, conversations: 1247, progress: 100 },
    { name: "Account Set Up", lastEdited: "1 day ago", status: "draft" as const, conversations: 0, progress: 65 },
    { name: "Order Status Lookup", lastEdited: "2 days ago", status: "draft" as const, conversations: 0, progress: 40 },
    { name: "FAQ Handler", lastEdited: "3 days ago", status: "published" as const, conversations: 823, progress: 100 },
  ]

  const quickMetrics = [
    { label: "Today's Conversations", value: "342", change: "+12%", trend: "up" as const },
    { label: "Avg. Response Time", value: "1.2s", change: "-8%", trend: "down" as const },
    { label: "Resolution Rate", value: "87%", change: "+5%", trend: "up" as const },
  ]

  // Generate personalized quick actions based on flow status
  const draftFlows = recentFlows.filter(f => f.status === "draft")
  const personalizedActions = draftFlows.length > 0 
    ? draftFlows.map(flow => ({
        label: `Continue "${flow.name}" (${flow.progress}% complete)`,
        icon: MessageSquare,
        action: () => router.push(`/flows?flow=${encodeURIComponent(flow.name)}`),
        priority: true
      }))
    : []

  const genericActions = [
    { label: "Create a new flow", icon: Plus, action: () => router.push("/flows?new=true"), priority: false },
  ]

  // Combine: prioritize personalized, then add generic (max 3 total)
  const quickActions = [...personalizedActions, ...genericActions].slice(0, 3)

  const handleSend = () => {
    if (!input.trim()) return
    const userInput = input.toLowerCase()
    if (userInput.includes("create") && userInput.includes("flow")) {
      router.push("/flows?new=true")
    } else if (userInput.includes("report") || userInput.includes("analytic")) {
      router.push("/reports")
    } else if (userInput.includes("channel")) {
      router.push("/channels")
    } else if (userInput.includes("train") || userInput.includes("ai")) {
      router.push("/ai-workbench")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-[#F6F8FA] to-white">
      <div className="container mx-auto px-6 py-5 h-full">
        <div className="grid grid-cols-12 gap-6 h-full">

          {/* Left Column - Syndeo Assistant (2/3) */}
          <div className="col-span-8 flex flex-col justify-center relative">

            {/* Glow behind search bar */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[700px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(47,143,255,0.18)_0%,rgba(47,143,255,0.06)_45%,transparent_70%)] blur-3xl" />
            </div>

            <div className="text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2F8FFF] rounded-full mb-3 shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Your Syndeo Assistant</span>
              </div>

              <h1 className="text-3xl font-bold text-[#3B4760] mb-2">
                Welcome back IKEA! What's next?
              </h1>


              <div className="my-6">
                <div className="relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Hi, I'm Syndeo 👋, ask me anything."
                    className="w-full h-14 pl-6 pr-28 text-base bg-white border-2 border-[#E8F0FB] rounded-2xl shadow-lg focus:border-[#2F8FFF] focus:ring-2 focus:ring-[#2F8FFF]/20 text-[#3B4760] placeholder:text-[#94A3B8]"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white h-10 w-10 p-0 rounded-xl"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  {/* Voice mode button */}
                  <div className="absolute right-14 top-1/2 -translate-y-1/2 group">
                    <button className="h-10 w-10 p-0 rounded-xl flex items-center justify-center text-[#6A738A] hover:text-[#2F8FFF] hover:bg-[#E8F0FB] transition-all">
                      <Mic className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1E293B] text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Use voice mode
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1E293B]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/40 backdrop-blur-sm border border-white rounded-full hover:bg-white/70 transition-all text-sm font-medium text-[#3B4760] shadow-[0_2px_12px_rgba(47,143,255,0.2)]"
                    >
                      {!action.priority && <Icon className="h-4 w-4 text-[#6A738A]" />}
                      {action.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Analytics + Connected Channels (1/3) */}
          <div className="col-span-4 flex flex-col gap-3 h-full">

            {/* Conversations Card */}
            <Card className="flex-1 min-h-0 overflow-hidden bg-gradient-to-br from-[#2F8FFF]/5 to-white border border-[#2F8FFF]/20 rounded-xl p-3 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium text-[#6A738A] uppercase tracking-wide">Today's Conversations</span>
                <div className="w-8 h-8 rounded-full bg-[#2F8FFF]/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-3.5 w-3.5 text-[#2F8FFF]" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[#3B4760]">342</p>
                <span className="flex items-center gap-0.5 text-xs font-medium text-[#10B981]">
                  <TrendingUp className="h-3 w-3" />+12%
                </span>
              </div>
              <span className="text-xs text-[#6A738A]">vs yesterday (306)</span>
            </Card>

            {/* Response Time Card */}
            <Card className="flex-1 min-h-0 overflow-hidden bg-gradient-to-br from-[#10B981]/5 to-white border border-[#10B981]/20 rounded-xl p-3 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium text-[#6A738A] uppercase tracking-wide">Avg Response Time</span>
                <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                  <Clock className="h-3.5 w-3.5 text-[#10B981]" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[#3B4760]">1.2s</p>
                <span className="flex items-center gap-0.5 text-xs font-medium text-[#10B981]">
                  <TrendingUp className="h-3 w-3 rotate-180" />-8%
                </span>
              </div>
              <span className="text-xs text-[#6A738A]">Target: &lt;2s — Excellent</span>
            </Card>

            {/* Resolution Rate Card */}
            <Card className="flex-1 min-h-0 overflow-hidden bg-gradient-to-br from-[#9333ea]/5 to-white border border-[#9333ea]/20 rounded-xl p-3 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium text-[#6A738A] uppercase tracking-wide">Resolution Rate</span>
                <div className="w-8 h-8 rounded-full bg-[#9333ea]/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="h-3.5 w-3.5 text-[#9333ea]" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-[#3B4760]">87%</p>
                <span className="flex items-center gap-0.5 text-xs font-medium text-[#10B981]">
                  <TrendingUp className="h-3 w-3" />+5%
                </span>
              </div>
              <span className="text-xs text-[#6A738A]">297 of 342 resolved — Strong</span>
            </Card>

            {/* Connected Channels */}
            <Card className="flex-[4] min-h-0 bg-white border border-[#E8F0FB] rounded-xl p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2 shrink-0">
                <h3 className="text-sm font-semibold text-[#3B4760]">Connected Channels</h3>
                <Link href="/channels" className="text-xs text-[#2F8FFF] hover:text-[#1E7FEF] flex items-center gap-1">
                  Manage
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center">
                      <FaFacebookMessenger className="h-4 w-4 text-[#1877F2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-[#3B4760]">Facebook Messenger</h4>
                      <p className="text-xs text-[#6A738A]">247 conversations today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="text-xs font-medium text-[#10B981]">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                      <FaWhatsapp className="h-4 w-4 text-[#25D366]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-[#3B4760]">WhatsApp Business</h4>
                      <p className="text-xs text-[#6A738A]">89 conversations today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="text-xs font-medium text-[#10B981]">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E1306C]/10 flex items-center justify-center">
                      <FaInstagram className="h-4 w-4 text-[#E1306C]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-[#3B4760]">Instagram</h4>
                      <p className="text-xs text-[#6A738A]">54 conversations today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="text-xs font-medium text-[#10B981]">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#4A154B]/10 flex items-center justify-center">
                      <FaSlack className="h-4 w-4 text-[#4A154B]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-[#3B4760]">Slack</h4>
                      <p className="text-xs text-[#6A738A]">12 conversations today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="text-xs font-medium text-[#10B981]">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#2F8FFF]/10 flex items-center justify-center">
                      <Globe className="h-4 w-4 text-[#2F8FFF]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-[#3B4760]">Web Chat</h4>
                      <p className="text-xs text-[#6A738A]">6 conversations today</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="text-xs font-medium text-[#10B981]">Active</span>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

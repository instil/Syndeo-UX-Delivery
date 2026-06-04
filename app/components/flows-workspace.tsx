"use client"

import { useState } from "react"
import {
  Home,
  Target,
  Globe,
  HelpCircle,
  Share2,
  Languages,
  MessageSquare,
  Mail,
  Settings,
  Boxes,
  Calendar,
  ClipboardList,
  ListChecks,
} from "lucide-react"
import { FlowCanvas } from "@/components/flow-canvas"
import { OutcomesList } from "@/components/outcomes-list"
import { WelcomeView } from "@/components/welcome-view"
import { GenericListView } from "@/components/generic-list-view"
import { CompactSimulator } from "@/components/compact-simulator"
import { DefaultMessagesView } from "@/components/default-messages-view"
import { SettingsView } from "@/components/settings-view"
import { FAQView } from "@/components/faq-view"
import { GlobalSeguesView } from "@/components/global-segues-view"
import { ResponsesView } from "@/components/responses-view"

type ViewType =
  | "welcome"
  | "outcomes"
  | "web-events"
  | "faqs"
  | "global-segues"
  | "languages"
  | "responses"
  | "default-messages"
  | "configuration"
  | "properties"
  | "events"
  | "surveys"
  | "survey-selector"
  | "outcome-detail"

const navigationItems = [
  { id: "welcome", label: "Welcome", icon: Home },
  { id: "outcomes", label: "Outcomes", icon: Target },
  { id: "web-events", label: "Web Events", icon: Globe },
  { id: "faqs", label: "FAQ", icon: HelpCircle },
  { id: "global-segues", label: "Global Segues", icon: Share2 },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "responses", label: "Responses", icon: MessageSquare },
  { id: "default-messages", label: "Default Messages", icon: Mail },
  { id: "configuration", label: "Settings", icon: Settings },
  { id: "properties", label: "Properties", icon: Boxes },
  { id: "events", label: "Events", icon: Calendar },
  { id: "surveys", label: "Surveys", icon: ClipboardList },
  { id: "survey-selector", label: "Survey Selector", icon: ListChecks },
]

export function FlowsWorkspace() {
  const [activeView, setActiveView] = useState<ViewType>("welcome")
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [selectedOutcomeName, setSelectedOutcomeName] = useState<string>("") // Store outcome name

  const handleOutcomeClick = (outcomeId: string, outcomeName: string) => {
    // Accept outcome name
    setSelectedOutcome(outcomeId)
    setSelectedOutcomeName(outcomeName) // Store the outcome name
    setActiveView("outcome-detail")
  }

  const handleBackToList = () => {
    setSelectedOutcome(null)
    setSelectedOutcomeName("") // Clear outcome name
    setActiveView("outcomes")
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Navigation Panel */}
      <div className="w-64 bg-[#272C41] border-r border-white/10 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Your Flows</h2>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as ViewType)
                    setSelectedOutcome(null)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#2F8FFF]/15 text-[#2F8FFF] border-l-4 border-[#2F8FFF]"
                      : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === "welcome" && <WelcomeView />}
        {activeView === "outcomes" && <OutcomesList onOutcomeClick={handleOutcomeClick} />}
        {activeView === "outcome-detail" && selectedOutcome && (
          <FlowCanvas outcomeId={selectedOutcome} outcomeName={selectedOutcomeName} onBack={handleBackToList} />
        )}
        {activeView === "web-events" && <GenericListView title="Web Events" type="web-events" />}
        {activeView === "faqs" && <FAQView />}
        {activeView === "global-segues" && <GlobalSeguesView />}
        {activeView === "languages" && <GenericListView title="Languages" type="languages" />}
        {activeView === "responses" && <ResponsesView />}
        {activeView === "default-messages" && <DefaultMessagesView />}
        {activeView === "configuration" && <SettingsView />}
        {activeView === "properties" && <GenericListView title="Properties" type="properties" />}
        {activeView === "events" && <GenericListView title="Events" type="events" />}
        {activeView === "surveys" && <GenericListView title="Surveys" type="surveys" />}
        {activeView === "survey-selector" && <GenericListView title="Survey Selector" type="survey-selector" />}
      </div>

      {/* Compact Simulator - Persistent across all views */}
      <CompactSimulator />
    </div>
  )
}

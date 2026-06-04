"use client"

import { useState, useCallback } from "react"
import {
  Home,
  Target,
  Globe,
  Layers,
  Languages,
  MessageSquare,
  Mail,
  Settings,
  Boxes,
  Calendar,
  ClipboardList,
  ListChecks,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { FlowCanvas } from "@/components/flow-canvas"
import { OutcomesList } from "@/components/outcomes-list"
import { WelcomeView } from "@/components/welcome-view"
import { GenericListView } from "@/components/generic-list-view"
import { ResponsesView } from "@/components/responses-view"
import { DefaultMessagesView } from "@/components/default-messages-view"
import { SettingsView } from "@/components/settings-view"

type NavViewType =
  | "welcome"
  | "outcomes"
  | "steps"
  | "web-events"
  | "languages"
  | "responses"
  | "default-messages"
  | "configuration"
  | "properties"
  | "events"
  | "surveys"
  | "survey-selector"

type ViewType = NavViewType | "outcome-detail"

interface NavItem {
  id: NavViewType
  label: string
  icon: React.ElementType
}

interface NavGroup {
  id: string
  label: string
  defaultOpen: boolean
  items: NavItem[]
}

const navigationGroups: NavGroup[] = [
  {
    id: "flows",
    label: "Flows",
    defaultOpen: true,
    items: [
      { id: "welcome", label: "Welcome", icon: Home },
      { id: "outcomes", label: "Outcomes", icon: Target },
      { id: "steps", label: "Steps", icon: Layers },
      { id: "web-events", label: "Web Events", icon: Globe },
    ],
  },
  {
    id: "multilingual",
    label: "Multi-Lingual",
    defaultOpen: false,
    items: [
      { id: "languages", label: "Languages", icon: Languages },
      { id: "responses", label: "Responses", icon: MessageSquare },
    ],
  },
  {
    id: "scripting",
    label: "Scripting",
    defaultOpen: false,
    items: [
      { id: "properties", label: "Properties", icon: Boxes },
      { id: "events", label: "Events", icon: Calendar },
    ],
  },
  {
    id: "surveys",
    label: "Surveys",
    defaultOpen: false,
    items: [
      { id: "surveys", label: "Surveys", icon: ClipboardList },
      { id: "survey-selector", label: "Survey Selector", icon: ListChecks },
    ],
  },
  {
    id: "defaults",
    label: "Defaults / Settings",
    defaultOpen: false,
    items: [
      { id: "default-messages", label: "Default Messages", icon: Mail },
      { id: "configuration", label: "Settings", icon: Settings },
    ],
  },
]

function getGroupForView(view: NavViewType): string | null {
  for (const group of navigationGroups) {
    if (group.items.some((item) => item.id === view)) return group.id
  }
  return null
}

function initialOpenState(activeView: NavViewType): Record<string, boolean> {
  const activeGroup = getGroupForView(activeView)
  return Object.fromEntries(
    navigationGroups.map((g) => [g.id, g.defaultOpen || g.id === activeGroup])
  )
}

export function FlowsWorkspace() {
  const [activeView, setActiveView] = useState<ViewType>("welcome")
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [selectedOutcomeName, setSelectedOutcomeName] = useState<string>("")
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => initialOpenState("welcome")
  )

  const toggleGroup = useCallback((groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }))
  }, [])

  const handleNavClick = useCallback((viewId: NavViewType) => {
    setActiveView(viewId)
    setSelectedOutcome(null)
    setSelectedOutcomeName("")
    // Ensure the parent group is open
    const group = getGroupForView(viewId)
    if (group) setOpenGroups((prev) => ({ ...prev, [group]: true }))
  }, [])

  const handleOutcomeClick = (outcomeId: string, outcomeName: string) => {
    setSelectedOutcome(outcomeId)
    setSelectedOutcomeName(outcomeName)
    setActiveView("outcome-detail")
  }

  const handleBackToList = () => {
    setSelectedOutcome(null)
    setSelectedOutcomeName("")
    setActiveView("outcomes")
  }

  const pageBg = activeView === "welcome" ? "bg-[#272C41]" : "bg-[#F6F8FA]"

  return (
    <div className={`flex h-[calc(100vh-64px)] ${pageBg} transition-colors duration-200`}>
      {/* Left Navigation Panel — floating */}
      <div className="p-3 flex-shrink-0">
        <div className="w-56 bg-[#313750] rounded-xl shadow-lg overflow-y-auto h-full">
        <div className="p-4">
          <nav className="space-y-1">
            {navigationGroups.map((group) => {
              const isOpen = openGroups[group.id]
              return (
                <div key={group.id}>
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={isOpen}
                    aria-controls={`group-${group.id}`}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-white transition-colors"
                  >
                    {group.label}
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Group items */}
                  {isOpen && (
                    <div id={`group-${group.id}`} className="space-y-0.5 mb-2">
                      {group.items.map((item) => {
                        const Icon = item.icon
                        const isActive =
                          activeView === item.id ||
                          (activeView === "outcome-detail" && item.id === "outcomes")
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isActive
                                ? "bg-[#2F8FFF]/20 text-white border border-[#2F8FFF] rounded-lg"
                                : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === "welcome" && <WelcomeView />}
        {activeView === "outcomes" && <OutcomesList onOutcomeClick={handleOutcomeClick} />}
        {activeView === "outcome-detail" && selectedOutcome && (
          <FlowCanvas outcomeId={selectedOutcome} outcomeName={selectedOutcomeName} onBack={handleBackToList} />
        )}
        {activeView === "steps" && <GenericListView title="Steps" type="steps" />}
        {activeView === "web-events" && <GenericListView title="Web Events" type="web-events" />}
        {activeView === "languages" && <GenericListView title="Languages" type="languages" />}
        {activeView === "responses" && <ResponsesView />}
        {activeView === "default-messages" && <DefaultMessagesView />}
        {activeView === "configuration" && <SettingsView />}
        {activeView === "properties" && <GenericListView title="Properties" type="properties" />}
        {activeView === "events" && <GenericListView title="Events" type="events" />}
        {activeView === "surveys" && <GenericListView title="Surveys" type="surveys" />}
        {activeView === "survey-selector" && <GenericListView title="Survey Selector" type="survey-selector" />}
      </div>

    </div>
  )
}

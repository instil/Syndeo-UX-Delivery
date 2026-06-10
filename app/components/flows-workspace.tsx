"use client"

import { useState, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Workflow,
  Languages,
  Code,
  ClipboardList,
  Settings,
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
import { useSimulatorVisibility } from "@/components/simulator-visibility-context"

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
}

interface NavGroup {
  id: string
  label: string
  icon: React.ElementType
  defaultOpen: boolean
  items: NavItem[]
}

const navigationGroups: NavGroup[] = [
  {
    id: "flows",
    label: "Flows",
    icon: Workflow,
    defaultOpen: true,
    items: [
      { id: "welcome", label: "Getting Started" },
      { id: "outcomes", label: "Responses" },
      { id: "steps", label: "Steps" },
      { id: "web-events", label: "Web Events" },
    ],
  },
  {
    id: "multilingual",
    label: "Multi-Lingual",
    icon: Languages,
    defaultOpen: false,
    items: [
      { id: "languages", label: "Languages" },
      { id: "responses", label: "Responses" },
    ],
  },
  {
    id: "scripting",
    label: "Scripting",
    icon: Code,
    defaultOpen: false,
    items: [
      { id: "properties", label: "Properties" },
      { id: "events", label: "Events" },
    ],
  },
  {
    id: "surveys",
    label: "Surveys",
    icon: ClipboardList,
    defaultOpen: false,
    items: [
      { id: "surveys", label: "Surveys" },
      { id: "survey-selector", label: "Survey Selector" },
    ],
  },
  {
    id: "defaults",
    label: "Defaults / Settings",
    icon: Settings,
    defaultOpen: false,
    items: [
      { id: "default-messages", label: "Default Messages" },
      { id: "configuration", label: "Settings" },
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
  const searchParams = useSearchParams()

  // Auto-open flow editor when navigated from the simulator launcher
  useEffect(() => {
    const outcomeId = searchParams.get("outcomeId")
    const outcomeName = searchParams.get("outcomeName")
    if (outcomeId && outcomeName) {
      setSelectedOutcome(outcomeId)
      setSelectedOutcomeName(outcomeName)
      setActiveView("outcome-detail")
    }
  }, [searchParams])

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

  const pageBg = "bg-[#272C41]"
  const isEditorView = activeView === "outcome-detail"

  const { show } = useSimulatorVisibility()
  useEffect(() => {
    show()
    return () => show()
  }, [isEditorView, show])

  return (
    <div className={`flex h-[calc(100vh-64px)] ${pageBg} transition-colors duration-200`}>
      {/* Left Navigation Panel — hidden when in flow editor */}
      <aside className={`w-64 bg-[#313750] border-r border-white/10 flex-shrink-0 overflow-y-auto transition-all duration-200 ${isEditorView ? "hidden" : ""}`}>
        <div className="p-4">
          <nav className="space-y-1">
            {navigationGroups.map((group) => {
              const isOpen = openGroups[group.id]
              const GroupIcon = group.icon
              return (
                <div key={group.id}>
                  {/* Group header */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={isOpen}
                    aria-controls={`group-${group.id}`}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon className="w-3.5 h-3.5 text-white/70" />
                      {group.label}
                    </div>
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
                        const isActive =
                          activeView === item.id ||
                          (activeView === "outcome-detail" && item.id === "outcomes")
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isActive
                                ? "bg-[#2F8FFF]/20 text-white border border-[#2F8FFF] rounded-lg"
                                : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
                            }`}
                          >
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
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === "welcome" && <WelcomeView onNewOutcome={() => handleOutcomeClick("new", "Untitled Outcome")} />}
        {activeView === "outcomes" && <OutcomesList onOutcomeClick={handleOutcomeClick} />}
        {activeView === "outcome-detail" && selectedOutcome && (
          <FlowCanvas outcomeId={selectedOutcome} outcomeName={selectedOutcomeName} onBack={handleBackToList} onOutcomeChange={handleOutcomeClick} />
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

"use client"

import { Header } from "@/components/header"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Copy, Trash2, X, ChevronDown, ChevronRight } from "lucide-react"

interface TrainingStatement {
  id: string
  statement: string
  intent: string
  entities: string[]
  sentiment: number
}

export default function AIWorkbenchPage() {
  const [editingStatementId, setEditingStatementId] = useState<string | null>(null)
  const [editingStatementText, setEditingStatementText] = useState<string>("")

  const [intentsExpanded, setIntentsExpanded] = useState(true)
  const [entitiesExpanded, setEntitiesExpanded] = useState(true)
  const [sentimentExpanded, setSentimentExpanded] = useState(true)
  const [emotionsExpanded, setEmotionsExpanded] = useState(false)

  const [statements, setStatements] = useState<TrainingStatement[]>([
    {
      id: "1",
      statement: "Am I able to reduce how much I am paying each month",
      intent: "FAQ - Mortgag...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "2",
      statement: "Am I entitled to a bridging loan?",
      intent: "FAQ - Mortgag...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "3",
      statement: "Am I entitled to cheaper fees if I work for the NHS?",
      intent: "FAQ - Fees - N...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "4",
      statement: "Am I entitled to your loyalty bonus?",
      intent: "FAQ - Existing ...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "5",
      statement: "Am looking to remortgage my house",
      intent: "Re-Mortgage",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "6",
      statement: "any fish here?",
      intent: "",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "7",
      statement: "application for insurance",
      intent: "Life Cover",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "8",
      statement: "apply for insurance",
      intent: "Life Cover",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "9",
      statement: "Are mortgage conditions dependent on me?",
      intent: "FAQ - Mortgag...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "10",
      statement: "Are mortgages available after bankruptcy?",
      intent: "FAQ - Mortgag...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "11",
      statement: "Are my fees cheaper if I work for the NHS?",
      intent: "FAQ - Fees - N...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "12",
      statement: "Are my fees cheaper since I work for the NHS?",
      intent: "FAQ - Fees - N...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "13",
      statement: "Are my garden and garage covered by contents insurance",
      intent: "FAQ - Other Se...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "14",
      statement: "Are you based nearby?",
      intent: "FAQ - About U...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "15",
      statement: "Are you hiring currently?",
      intent: "FAQ - Office - J...",
      entities: [],
      sentiment: 0.5,
    },
    {
      id: "16",
      statement: "Are you open this weekend?",
      intent: "Branch Hours",
      entities: [],
      sentiment: 0.5,
    },
  ])

  const intents = ["1", "1 Rory", "1 a", "1 a - Tany", "1 llm test with Inte..."]
  const entities = ["111name", "123", "123same", "13options", "6212test"]

  const handleEditStatement = (id: string, currentText: string) => {
    setEditingStatementId(id)
    setEditingStatementText(currentText)
  }

  const handleSaveStatement = (id: string) => {
    setStatements(statements.map((s) => (s.id === id ? { ...s, statement: editingStatementText } : s)))
    setEditingStatementId(null)
    setEditingStatementText("")
  }

  const handleCancelEdit = () => {
    setEditingStatementId(null)
    setEditingStatementText("")
  }

  return (
    <div className="min-h-screen bg-[#272C41]">
      <Header dark={true} />

      <div className="flex h-[calc(100vh-64px)]">
        <aside className="w-64 bg-[#313750] border-r border-white/10 overflow-y-auto">
          <div className="p-4">
            {/* Welcome Section */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg font-semibold text-white">Welcome to Kelvin</h1>
              <Button size="sm" className="bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white h-8 px-3">
                Train
              </Button>
            </div>

            {/* Statement Tools */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Statement Tools</h2>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white h-8 text-xs">
                  Add
                </Button>
                <Button size="sm" className="flex-1 bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white h-8 text-xs">
                  Test
                </Button>
                <Button size="sm" className="flex-1 bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white h-8 text-xs">
                  Import
                </Button>
              </div>
            </div>

            {/* Intents Section */}
            <div className="mb-6">
              <button
                onClick={() => setIntentsExpanded(!intentsExpanded)}
                className="w-full flex items-center justify-between mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/80 transition-colors"
              >
                <span>Intents</span>
                {intentsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {intentsExpanded && (
                <>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
                    <Input
                      placeholder="Search"
                      className="pl-8 pr-9 h-8 bg-white/10 border-white/10 text-white placeholder:text-white/40 text-xs focus-visible:ring-[#2F8FFF]"
                    />
                    <Button
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {intents.map((intent) => (
                      <div
                        key={intent}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-white/80 hover:bg-white/[0.06] cursor-pointer transition-colors group"
                      >
                        <span className="text-xs flex-1 truncate">{intent}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 text-white/40 hover:text-[#2F8FFF] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Entities Section */}
            <div className="mb-6">
              <button
                onClick={() => setEntitiesExpanded(!entitiesExpanded)}
                className="w-full flex items-center justify-between mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/80 transition-colors"
              >
                <span>Entities</span>
                {entitiesExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {entitiesExpanded && (
                <>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
                    <Input
                      placeholder="Search"
                      className="pl-8 pr-9 h-8 bg-white/10 border-white/10 text-white placeholder:text-white/40 text-xs focus-visible:ring-[#2F8FFF]"
                    />
                    <Button
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 bg-[#2F8FFF] hover:bg-[#1E7FEF] text-white"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {entities.map((entity) => (
                      <div
                        key={entity}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-white/80 hover:bg-white/[0.06] cursor-pointer transition-colors group"
                      >
                        <span className="text-xs flex-1 truncate">{entity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 text-white/40 hover:text-[#2F8FFF] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sentiment Section */}
            <div className="mb-6">
              <button
                onClick={() => setSentimentExpanded(!sentimentExpanded)}
                className="w-full flex items-center justify-between mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/80 transition-colors"
              >
                <span>Sentiment</span>
                {sentimentExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {sentimentExpanded && (
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/[0.06]">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/10">
                    <span className="text-base">😐</span>
                  </div>
                  <span className="text-sm font-medium text-white">0.50</span>
                </div>
              )}
            </div>

            {/* Emotions Section */}
            <div>
              <button
                onClick={() => setEmotionsExpanded(!emotionsExpanded)}
                className="w-full flex items-center justify-between text-xs font-semibold text-white/40 uppercase tracking-wider hover:text-white/80 transition-colors"
              >
                <span>Emotions</span>
                {emotionsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-[#272C41]">
          <div className="p-6">
            {/* Table Container */}
            <div className="bg-[#313750] rounded-lg border border-white/10 overflow-hidden">
              {/* Table Header */}
              <div className="bg-white/[0.04] border-b border-white/10">
                <div className="flex items-center px-6 py-3">
                  <div className="flex-[2]">
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Statement</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Intent</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Entities</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Sentiment</span>
                  </div>
                  <div className="w-10"></div>
                </div>
              </div>

              {/* Table Body */}
              <div>
                {statements.map((statement, index) => (
                  <div
                    key={statement.id}
                    className={`flex items-center px-6 py-4 hover:bg-white/[0.04] transition-colors ${
                      index !== statements.length - 1 ? "border-b border-white/10" : ""
                    }`}
                  >
                    <div className="flex-[2] pr-4 flex items-center gap-2">
                      {editingStatementId === statement.id ? (
                        <>
                          <Input
                            value={editingStatementText}
                            onChange={(e) => setEditingStatementText(e.target.value)}
                            className="flex-1 h-8 text-sm bg-white/10 border-[#2F8FFF] text-white focus-visible:ring-[#2F8FFF]"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveStatement(statement.id)}
                            className="bg-[#10B981] hover:bg-[#059669] text-white h-8 px-3 text-xs"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="h-8 px-3 text-xs border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-white flex-1">{statement.statement}</p>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditStatement(statement.id, statement.statement)}
                            className="h-6 w-6 text-white/40 hover:text-[#2F8FFF] hover:bg-white/10 flex-shrink-0"
                            title="Click here to edit this statement."
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        {statement.intent ? (
                          <div className="bg-[#2F8FFF] text-white px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <span className="truncate max-w-[120px]">{statement.intent}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-4 w-4 p-0 hover:bg-white/20 text-white -mr-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex-1 pr-4">
                      <span className="text-xs text-white/40 italic">Not Set</span>
                    </div>
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/10">
                          <span className="text-sm">😐</span>
                        </div>
                        <span className="text-sm text-white font-medium">{statement.sentiment.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="w-10 flex justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <span className="text-sm text-white/60">Previous</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-[#2F8FFF]"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-[#2F8FFF]"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-[#2F8FFF]"
              >
                3
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-[#2F8FFF]"
              >
                4
              </Button>
              <span className="text-sm text-white/60">...</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 bg-white/10 border-white/10 text-white hover:bg-white/20 hover:text-[#2F8FFF]"
              >
                16
              </Button>
              <span className="text-sm text-white/60">Next</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

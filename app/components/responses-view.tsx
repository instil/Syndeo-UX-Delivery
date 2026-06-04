"use client"

import { Plus, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

export function ResponsesView() {
  const [selectedResponse, setSelectedResponse] = useState("test 1")

  const responses = [
    { id: "test 1", name: "test 1", subtitle: "test" },
    { id: "test 2", name: "test 2", subtitle: "test 2" },
  ]

  return (
    <div className="h-full flex bg-[#F6F8FA]">
      {/* Left List */}
      <div className="w-72 bg-white border-r border-[#DDE5EF] overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-[#DDE5EF]">
          <h2 className="text-lg font-light tracking-tight text-[#1E2535] mb-4">Responses</h2>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2F8FFF] text-white text-sm font-medium rounded-lg hover:bg-[#2680E8]">
            <Plus className="w-4 h-4" />
            Add Response
          </button>
        </div>

        <div className="p-2">
          {responses.map((response) => (
            <button
              key={response.id}
              onClick={() => setSelectedResponse(response.id)}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                selectedResponse === response.id ? "bg-[#F0F6FF] text-[#2F8FFF]" : "hover:bg-[#F6F8FA] text-[#1E2535]"
              }`}
            >
              <div className="text-sm font-medium">{response.name}</div>
              <div className="text-xs text-[#6A738A] mt-0.5">{response.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Detail Panel */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-xl border border-[#DDE5EF] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light tracking-tight text-[#1E2535]">test 1</h2>
            <div className="flex gap-1">
              <button className="p-2 text-[#6A738A] hover:text-[#1E2535] rounded-lg hover:bg-[#F6F8FA]">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-[#6A738A] hover:text-red-500 rounded-lg hover:bg-[#F6F8FA]">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#6A738A] uppercase tracking-wide mb-2 block">
              Default Text
            </label>
            <div className="border border-[#DDE5EF] rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 p-2 border-b border-[#DDE5EF] bg-[#F6F8FA]">
                <button className="p-1 hover:bg-[#DDE5EF] rounded"><strong className="text-sm">B</strong></button>
                <button className="p-1 hover:bg-[#DDE5EF] rounded"><em className="text-sm">I</em></button>
                <button className="p-1 hover:bg-[#DDE5EF] rounded"><u className="text-sm">U</u></button>
                <button className="p-1 hover:bg-[#DDE5EF] rounded"><s className="text-sm">S</s></button>
                <div className="w-px h-4 bg-[#DDE5EF]" />
                <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">≡</button>
                <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">{"</>"}</button>
                <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">🔗</button>
                <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">😊</button>
                <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">Ꞁ</button>
              </div>
              <textarea
                className="w-full p-4 text-sm text-[#1E2535] resize-none focus:outline-none min-h-[200px]"
                defaultValue="test"
              />
            </div>
            <div className="text-right text-xs text-[#6A738A] mt-1">4 of 2000 characters</div>
          </div>
        </div>
      </div>
    </div>
  )
}

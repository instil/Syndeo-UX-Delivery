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
    <div className="h-full flex bg-[#272C41]">
      {/* Left List */}
      <div className="w-72 bg-[#313750] border-r border-white/10 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-light tracking-tight text-white mb-4">Responses</h2>
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
                selectedResponse === response.id
                  ? "bg-[#2F8FFF]/20 text-white border border-[#2F8FFF]"
                  : "hover:bg-white/[0.06] text-white/60"
              }`}
            >
              <div className="text-sm font-medium">{response.name}</div>
              <div className="text-xs text-white/40 mt-0.5">{response.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Detail Panel */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-[#313750] rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light tracking-tight text-white">test 1</h2>
            <div className="flex gap-1">
              <button className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/10">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-white/60 hover:text-red-400 rounded-lg hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-2 block">
              Default Text
            </label>
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 p-2 border-b border-white/10 bg-white/[0.06]">
                <button className="p-1 hover:bg-white/10 rounded text-white"><strong className="text-sm">B</strong></button>
                <button className="p-1 hover:bg-white/10 rounded text-white"><em className="text-sm">I</em></button>
                <button className="p-1 hover:bg-white/10 rounded text-white"><u className="text-sm">U</u></button>
                <button className="p-1 hover:bg-white/10 rounded text-white"><s className="text-sm">S</s></button>
                <div className="w-px h-4 bg-white/10" />
                <button className="p-1 hover:bg-white/10 rounded text-sm text-white">≡</button>
                <button className="p-1 hover:bg-white/10 rounded text-sm text-white">{"</>"}</button>
                <button className="p-1 hover:bg-white/10 rounded text-sm">🔗</button>
                <button className="p-1 hover:bg-white/10 rounded text-sm">😊</button>
                <button className="p-1 hover:bg-white/10 rounded text-sm text-white">Ꞁ</button>
              </div>
              <textarea
                className="w-full p-4 text-sm text-white bg-transparent resize-none focus:outline-none min-h-[200px] placeholder:text-white/40"
                defaultValue="test"
              />
            </div>
            <div className="text-right text-xs text-white/40 mt-1">4 of 2000 characters</div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Info } from "lucide-react"

export function DefaultMessagesView() {
  return (
    <div className="h-full overflow-y-auto bg-[#272C41] p-6">
      <h1 className="text-2xl font-light tracking-tight text-white mb-6">Default Messages</h1>

      {/* Expert Messages Section */}
      <div className="bg-[#313750] rounded-xl border border-white/10 p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-6">Expert Messages</h2>

        {/* Awaiting Expert */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Awaiting Expert</label>
            <Info className="w-4 h-4 text-white/40" />
          </div>
          <p className="text-xs text-white/60 mb-3">
            Sent when a user has completed an outcome but is awaiting an expert to connect with them
          </p>
          <div className="border border-white/10 rounded-lg">
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
              className="w-full p-4 text-sm text-white bg-transparent resize-none focus:outline-none min-h-[120px]"
              defaultValue="Awaiting Expert 2"
            />
          </div>
          <div className="text-right text-xs text-white/40 mt-1">17 of 2000 characters</div>
        </div>

        {/* Return to Automation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Return to Automation</label>
            <Info className="w-4 h-4 text-white/40" />
          </div>
          <p className="text-xs text-white/60 mb-3">Sent when an expert returns a user to chatting with the bot</p>
          <div className="border border-white/10 rounded-lg">
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
              className="w-full p-4 text-sm text-white bg-transparent resize-none focus:outline-none min-h-[120px]"
              defaultValue="Return To Automation 2"
            />
          </div>
          <div className="text-right text-xs text-white/40 mt-1">22 of 2000 characters</div>
        </div>

        {/* Unable to Classify */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Unable to Classify</label>
            <Info className="w-4 h-4 text-white/40" />
          </div>
          <p className="text-xs text-white/60 mb-3">If there is no outcome to handle the users intent</p>
          <div className="border border-white/10 rounded-lg">
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
              className="w-full p-4 text-sm text-white bg-transparent resize-none focus:outline-none min-h-[120px]"
              defaultValue="Unable to classify 2"
            />
          </div>
          <div className="text-right text-xs text-white/40 mt-1">20 of 2000 characters</div>
        </div>
      </div>

      {/* Conversation Events Section */}
      <div className="bg-[#313750] rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-base font-semibold text-white">Conversation Events</h2>
          <span className="text-xs text-white/40">- only on supported platforms</span>
        </div>

        {/* Expert Connection */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Expert Connection</label>
            <Info className="w-4 h-4 text-white/40" />
          </div>
          <p className="text-xs text-white/60 mb-3">
            When an expert assigns a conversation to themselves and "joins" a chat
          </p>
          <div className="border border-white/10 rounded-lg">
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
              className="w-full p-4 text-sm text-white bg-transparent resize-none focus:outline-none min-h-[120px]"
              defaultValue="Expert Connection 2"
            />
          </div>
          <div className="text-right text-xs text-white/40 mt-1">20 of 2000 characters</div>
        </div>
      </div>
    </div>
  )
}

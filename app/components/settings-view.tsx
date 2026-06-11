"use client"

import { useState } from "react"
import { Info, ChevronDown, Plus } from "lucide-react"
import { MessageCircle, Smartphone } from "lucide-react"

export function SettingsView() {
  const [typingDelays, setTypingDelays] = useState([1000, 1000, 1000, 0, 1000])
  const [inactivityTab, setInactivityTab] = useState<"automated" | "inQueue" | "handover">("automated")
  const [inactivityValues, setInactivityValues] = useState({
    automated: [10, 10, 10, 10, 7200],
    inQueue: [5, 10, 10],
    handover: [10, 1, 10, 10],
  })

  const channels = [
    { name: "production 2", icon: MessageCircle },
    { name: "test", icon: MessageCircle },
    { name: "Bohdan test pro...", icon: MessageCircle },
    { name: "PROD test web...", icon: MessageCircle },
    { name: "Test to remove", icon: MessageCircle },
  ]

  const contactCentres = ["Syndeo", "GenesysOpenMessaging", "ContactCenter8x8", "Genesys PureEngage", "Five9"]

  const inactivityChannels = {
    automated: [
      { name: "production", icon: MessageCircle },
      { name: "Slack Channel", icon: MessageCircle },
      { name: "SMS Production Cha...", icon: Smartphone },
      { name: "Test to remove", icon: MessageCircle },
      { name: "Codeseek test page", icon: MessageCircle },
    ],
    inQueue: [
      { name: "Bohdan test product...", icon: MessageCircle },
      { name: "Line channel", icon: MessageCircle },
      { name: "Voice production ch...", icon: MessageCircle },
    ],
    handover: [
      { name: "test", icon: MessageCircle },
      { name: "PROD test web cha...", icon: MessageCircle },
      { name: "DFCX Production Ch...", icon: MessageCircle },
      { name: "Telegram Productio...", icon: MessageCircle },
    ],
  }

  function adjustTypingDelay(idx: number, delta: number) {
    setTypingDelays(prev => prev.map((v, i) => i === idx ? Math.max(0, v + delta) : v))
  }

  function adjustInactivity(tab: keyof typeof inactivityValues, idx: number, delta: number) {
    setInactivityValues(prev => ({
      ...prev,
      [tab]: prev[tab].map((v, i) => i === idx ? Math.max(0, v + delta) : v),
    }))
  }

  return (
    <div className="h-full overflow-y-auto bg-[#272C41] p-6">
      <h1 className="text-2xl font-light tracking-tight text-white mb-6">Settings</h1>

      {/* Typing Delay Settings */}
      <div className="bg-[#313750] rounded-xl border border-white/10 p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-2">Typing Delay Settings</h2>
        <div className="flex items-center gap-2 mb-6">
          <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Typing Delay Per Channel</label>
          <Info className="w-4 h-4 text-white/40" />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {channels.map((channel, idx) => (
            <div key={idx} className="border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-white/60" />
                <span className="text-xs font-medium text-white">{channel.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
                  <button onClick={() => adjustTypingDelay(idx, -100)} className="px-2 py-1 text-[#2F8FFF] hover:bg-white/10 transition-colors text-sm font-medium">−</button>
                  <span className="px-2.5 text-xs font-medium text-white border-x border-white/10">{typingDelays[idx]}</span>
                  <button onClick={() => adjustTypingDelay(idx, 100)} className="px-2 py-1 text-[#2F8FFF] hover:bg-white/10 transition-colors text-sm font-medium">+</button>
                </div>
                <span className="text-xs text-white/60">ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Default Exception Settings */}
      <div className="bg-[#313750] rounded-xl border border-white/10 p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-6">Default Exception Settings</h2>

        <div className="mb-4">
          <label className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2 block">
            Exception Behaviour
          </label>
          <select className="w-full px-4 py-2 border border-white/10 rounded-lg bg-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]">
            <option>Route</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2 block">Route Message</label>
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
              className="w-full p-4 text-sm text-white bg-transparent resize-none focus:outline-none min-h-[100px]"
              defaultValue="Let me find an expert to assist you. We apologise for the inconvenience."
            />
          </div>
          <div className="text-right text-xs text-white/40 mt-1">72 of 2000 characters</div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2 block">Route Method</label>
          <select className="w-full px-4 py-2 border border-white/10 rounded-lg bg-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]">
            <option>By Skill</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2 block">
            Required Skills
          </label>
          <input
            type="text"
            placeholder="Enter a Skill"
            className="w-full px-4 py-2 border border-white/10 rounded-lg bg-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]"
          />
        </div>
      </div>

      {/* Default Route Settings */}
      <div className="bg-[#313750] rounded-xl border border-white/10 p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-6">Default Route Settings</h2>
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-medium text-white/40 uppercase tracking-wide">Contact Centres</label>
          <button className="flex items-center justify-center w-8 h-8 bg-[#2F8FFF] text-white rounded hover:bg-[#1a7ae0]">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {contactCentres.map((centre, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.06] rounded-lg">
              <span className="text-sm text-white">{centre}</span>
              <div className="flex items-center gap-2">
                <button className="text-white/60 hover:text-red-400">🗑️</button>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inactivity Settings */}
      <div className="bg-[#313750] rounded-xl border border-white/10 p-6">
        <h2 className="text-base font-semibold text-white mb-6">Inactivity Settings</h2>

        <div className="mb-4">
          <label className="text-xs font-medium text-white/40 uppercase tracking-wide mb-2 block">
            Monitor Inactivity
          </label>
          <select className="w-full px-4 py-2 border border-white/10 rounded-lg bg-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]">
            <option>Close after inactivity</option>
          </select>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <label className="text-xs font-medium text-white/40 uppercase tracking-wide">
              Inactivity Timer Per Channel
            </label>
            <Info className="w-4 h-4 text-white/40" />
          </div>

          <div className="flex gap-2 mb-6 border-b border-white/10">
            <button onClick={() => setInactivityTab("automated")} className={`px-4 py-2 text-sm font-medium border-b-2 ${inactivityTab === "automated" ? "text-white border-[#2F8FFF]" : "text-white/60 border-transparent hover:text-white"}`}>
              Automated
            </button>
            <button onClick={() => setInactivityTab("inQueue")} className={`px-4 py-2 text-sm font-medium border-b-2 ${inactivityTab === "inQueue" ? "text-white border-[#2F8FFF]" : "text-white/60 border-transparent hover:text-white"}`}>In Queue</button>
            <button onClick={() => setInactivityTab("handover")} className={`px-4 py-2 text-sm font-medium border-b-2 ${inactivityTab === "handover" ? "text-white border-[#2F8FFF]" : "text-white/60 border-transparent hover:text-white"}`}>Handover</button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {inactivityChannels[inactivityTab].map((channel, idx) => (
              <div key={idx} className="border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-white/60" />
                  <span className="text-xs font-medium text-white">{channel.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
                    <button onClick={() => adjustInactivity(inactivityTab, idx, -1)} className="px-2 py-1 text-[#2F8FFF] hover:bg-white/10 transition-colors text-sm font-medium">−</button>
                    <span className="px-2.5 text-xs font-medium text-white border-x border-white/10">{inactivityValues[inactivityTab][idx]}</span>
                    <button onClick={() => adjustInactivity(inactivityTab, idx, 1)} className="px-2 py-1 text-[#2F8FFF] hover:bg-white/10 transition-colors text-sm font-medium">+</button>
                  </div>
                  <span className="text-xs text-white/60">mins</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Info, ChevronDown, Plus } from "lucide-react"
import { MessageCircle, Smartphone } from "lucide-react"

export function SettingsView() {
  const channels = [
    { name: "production 2", icon: MessageCircle, value: 1000 },
    { name: "test", icon: MessageCircle, value: 1000 },
    { name: "Bohdan test pro...", icon: MessageCircle, value: 1000 },
    { name: "PROD test web...", icon: MessageCircle, value: 0 },
    { name: "Test to remove", icon: MessageCircle, value: 1000 },
  ]

  const contactCentres = ["Syndeo", "GenesysOpenMessaging", "ContactCenter8x8", "Genesys PureEngage", "Five9"]

  const inactivityChannels = {
    automated: [
      { name: "production", icon: MessageCircle, value: 10 },
      { name: "Slack Channel", icon: MessageCircle, value: 10, color: "purple" },
      { name: "SMS Production Cha...", icon: Smartphone, value: 10 },
      { name: "Test to remove", icon: MessageCircle, value: 10 },
      { name: "Codeseek test page", icon: MessageCircle, value: 7200, color: "blue" },
    ],
    inQueue: [
      { name: "Bohdan test product...", icon: MessageCircle, value: 5 },
      { name: "Line channel", icon: MessageCircle, value: 10, color: "green" },
      { name: "Voice production ch...", icon: MessageCircle, value: 10, color: "red" },
    ],
    handover: [
      { name: "test", icon: MessageCircle, value: 10 },
      { name: "PROD test web cha...", icon: MessageCircle, value: 1 },
      { name: "DFCX Production Ch...", icon: MessageCircle, value: 10 },
      { name: "Telegram Productio...", icon: MessageCircle, value: 10, color: "blue" },
    ],
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

        <div className="grid grid-cols-3 gap-4">
          {channels.map((channel, idx) => (
            <div key={idx} className="border border-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-white/60" />
                <span className="text-sm font-medium text-white">{channel.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col bg-white/10 rounded px-3 py-2">
                  <button className="text-xs text-[#2F8FFF]">▲</button>
                  <span className="text-sm font-medium text-white my-1">{channel.value}</span>
                  <button className="text-xs text-[#2F8FFF]">▼</button>
                </div>
                <span className="text-xs text-white/60">milliseconds</span>
              </div>
              <button className="mt-3 text-xs text-white/40 hover:text-white/80">⚡</button>
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
            <button className="px-4 py-2 text-sm font-medium text-white border-b-2 border-[#2F8FFF]">
              Automated
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white">In Queue</button>
            <button className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white">Handover</button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {inactivityChannels.automated.map((channel, idx) => (
              <div key={idx} className="border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-white/60" />
                  <span className="text-sm font-medium text-white">{channel.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col bg-white/10 rounded px-3 py-2">
                    <button className="text-xs text-[#2F8FFF]">▲</button>
                    <span className="text-sm font-medium text-white my-1">{channel.value}</span>
                    <button className="text-xs text-[#2F8FFF]">▼</button>
                  </div>
                  <span className="text-xs text-white/60">minutes</span>
                </div>
                <button className="mt-3 text-xs text-white/40 hover:text-white/80">⚡</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

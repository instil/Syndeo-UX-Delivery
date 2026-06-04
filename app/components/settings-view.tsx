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
    <div className="h-full overflow-y-auto bg-[#F6F8FA] p-6">
      <h1 className="text-2xl font-light tracking-tight text-[#1E2535] mb-6">Settings</h1>

      {/* Typing Delay Settings */}
      <div className="bg-white rounded-xl border border-[#DDE5EF] p-6 mb-6">
        <h2 className="text-base font-semibold text-[#1E2535] mb-2">Typing Delay Settings</h2>
        <div className="flex items-center gap-2 mb-6">
          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wide">Typing Delay Per Channel</label>
          <Info className="w-4 h-4 text-[#6A738A]" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {channels.map((channel, idx) => (
            <div key={idx} className="border border-[#DDE5EF] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-[#6A738A]" />
                <span className="text-sm font-medium text-[#1E2535]">{channel.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col bg-[#F6F8FA] rounded px-3 py-2">
                  <button className="text-xs text-[#2F8FFF]">▲</button>
                  <span className="text-sm font-medium text-[#1E2535] my-1">{channel.value}</span>
                  <button className="text-xs text-[#2F8FFF]">▼</button>
                </div>
                <span className="text-xs text-[#6A738A]">milliseconds</span>
              </div>
              <button className="mt-3 text-xs text-[#6A738A] hover:text-[#3B4760]">⚡</button>
            </div>
          ))}
        </div>
      </div>

      {/* Default Exception Settings */}
      <div className="bg-white rounded-xl border border-[#DDE5EF] p-6 mb-6">
        <h2 className="text-base font-semibold text-[#1E2535] mb-6">Default Exception Settings</h2>

        <div className="mb-4">
          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wide mb-2 block">
            Exception Behaviour
          </label>
          <select className="w-full px-4 py-2 border border-[#DDE5EF] rounded-lg bg-[#F6F8FA] text-sm text-[#1E2535] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]">
            <option>Route</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wide mb-2 block">Route Message</label>
          <div className="border border-[#DDE5EF] rounded-lg">
            <div className="flex items-center gap-2 p-2 border-b border-[#E8F0FB] bg-[#F6F8FA]">
              <button className="p-1 hover:bg-[#DDE5EF] rounded">
                <strong className="text-sm">B</strong>
              </button>
              <button className="p-1 hover:bg-[#DDE5EF] rounded">
                <em className="text-sm">I</em>
              </button>
              <button className="p-1 hover:bg-[#DDE5EF] rounded">
                <u className="text-sm">U</u>
              </button>
              <button className="p-1 hover:bg-[#DDE5EF] rounded">
                <s className="text-sm">S</s>
              </button>
              <div className="w-px h-4 bg-[#DDE5EF]" />
              <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">≡</button>
              <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">{"</>"}</button>
              <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">🔗</button>
              <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">😊</button>
              <button className="p-1 hover:bg-[#DDE5EF] rounded text-sm">Ꞁ</button>
            </div>
            <textarea
              className="w-full p-4 text-sm text-[#1E2535] resize-none focus:outline-none min-h-[100px]"
              defaultValue="Let me find an expert to assist you. We apologise for the inconvenience."
            />
          </div>
          <div className="text-right text-xs text-[#6A738A] mt-1">72 of 2000 characters</div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wide mb-2 block">Route Method</label>
          <select className="w-full px-4 py-2 border border-[#DDE5EF] rounded-lg bg-[#F6F8FA] text-sm text-[#1E2535] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]">
            <option>By Skill</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wide mb-2 block">
            Required Skills
          </label>
          <input
            type="text"
            placeholder="Enter a Skill"
            className="w-full px-4 py-2 border border-[#DDE5EF] rounded-lg bg-[#F6F8FA] text-sm text-[#1E2535] placeholder:text-[#6A738A] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]"
          />
        </div>
      </div>

      {/* Default Route Settings */}
      <div className="bg-white rounded-xl border border-[#DDE5EF] p-6 mb-6">
        <h2 className="text-base font-semibold text-[#1E2535] mb-6">Default Route Settings</h2>
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wide">Contact Centres</label>
          <button className="flex items-center justify-center w-8 h-8 bg-[#2F8FFF] text-white rounded hover:bg-[#1a7ae0]">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {contactCentres.map((centre, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-[#F6F8FA] rounded-lg">
              <span className="text-sm text-[#1E2535]">{centre}</span>
              <div className="flex items-center gap-2">
                <button className="text-[#6A738A] hover:text-[#3B4760]">🗑️</button>
                <ChevronDown className="w-4 h-4 text-[#6A738A]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inactivity Settings */}
      <div className="bg-white rounded-xl border border-[#DDE5EF] p-6">
        <h2 className="text-base font-semibold text-[#1E2535] mb-6">Inactivity Settings</h2>

        <div className="mb-4">
          <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wide mb-2 block">
            Monitor Inactivity
          </label>
          <select className="w-full px-4 py-2 border border-[#DDE5EF] rounded-lg bg-[#F6F8FA] text-sm text-[#1E2535] focus:outline-none focus:ring-2 focus:ring-[#2F8FFF]">
            <option>Close after inactivity</option>
          </select>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <label className="text-xs font-medium text-[#6A738A] uppercase tracking-wide">
              Inactivity Timer Per Channel
            </label>
            <Info className="w-4 h-4 text-[#6A738A]" />
          </div>

          <div className="flex gap-2 mb-6 border-b border-[#E8F0FB]">
            <button className="px-4 py-2 text-sm font-medium text-[#1E2535] border-b-2 border-[#2F8FFF]">
              Automated
            </button>
            <button className="px-4 py-2 text-sm font-medium text-[#6A738A] hover:text-[#3B4760]">In Queue</button>
            <button className="px-4 py-2 text-sm font-medium text-[#6A738A] hover:text-[#3B4760]">Handover</button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {inactivityChannels.automated.map((channel, idx) => (
              <div key={idx} className="border border-[#DDE5EF] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-[#6A738A]" />
                  <span className="text-sm font-medium text-[#1E2535]">{channel.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col bg-[#F6F8FA] rounded px-3 py-2">
                    <button className="text-xs text-[#2F8FFF]">▲</button>
                    <span className="text-sm font-medium text-[#1E2535] my-1">{channel.value}</span>
                    <button className="text-xs text-[#2F8FFF]">▼</button>
                  </div>
                  <span className="text-xs text-[#6A738A]">minutes</span>
                </div>
                <button className="mt-3 text-xs text-[#6A738A] hover:text-[#3B4760]">⚡</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

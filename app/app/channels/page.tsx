"use client"

import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Monitor,
  MessageCircle,
  Facebook,
  MessageSquare,
  Smartphone,
  Slack,
  Mail,
  Send,
  Phone,
  Check,
  Zap,
  Trash2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const channels = [
  {
    id: "desktop",
    name: "Desktop",
    displayName: "desktop production",
    type: "Desktop",
    botId: "780769152729088",
    icon: Monitor,
    color: "#808A9F",
  },
  {
    id: "dialogflow-cx",
    name: "DialogFlow CX",
    displayName: "DFCX Production Cha...",
    type: "DialogFlow CX",
    botId: "d4358055-259b-42...",
    icon: MessageCircle,
    color: "#2F8FFF",
  },
  {
    id: "facebook",
    name: "Facebook",
    displayName: "Codeseek test page",
    type: "Facebook",
    botId: "115580038066282",
    icon: Facebook,
    color: "#0866FF",
  },
  {
    id: "line",
    name: "Line",
    displayName: "Line channel",
    type: "Line",
    botId: "Ufadec39888653ff2...",
    icon: MessageSquare,
    color: "#00C300",
  },
  {
    id: "mobile",
    name: "Mobile",
    displayName: "mobile production ch...",
    type: "Mobile",
    botId: "338831446376448",
    icon: Smartphone,
    color: "#6A738A",
  },
  {
    id: "slack",
    name: "Slack",
    displayName: "Slack Channel",
    type: "Slack",
    botId: "A06SAH90URM",
    icon: Slack,
    color: "#611F69",
  },
  {
    id: "sms",
    name: "SMS",
    displayName: "SMS Production Cha...",
    type: "SMS",
    phoneNumber: "+447361582408",
    icon: Mail,
    color: "#64B5F6",
  },
  {
    id: "telegram",
    name: "Telegram",
    displayName: "Telegram Production ...",
    type: "Telegram",
    botId: "8576692908:AAGY4...",
    icon: Send,
    color: "#0088CC",
  },
  {
    id: "voice",
    name: "Voice",
    displayName: "Voice production cha...",
    type: "Voice",
    botId: "128478032691200",
    icon: Phone,
    color: "#D32F2F",
  },
  {
    id: "web-1",
    name: "Web",
    displayName: "Bohdan test producti...",
    type: "Web",
    botId: "220103249494016",
    icon: Globe,
    color: "#5B6B8C",
  },
  {
    id: "web-2",
    name: "Web",
    displayName: "PROD test web chan...",
    type: "Web",
    botId: "542705356636160",
    icon: Globe,
    color: "#5B6B8C",
  },
  {
    id: "web-3",
    name: "Web",
    displayName: "production 2",
    type: "Web",
    botId: "405210333708288",
    icon: Globe,
    color: "#5B6B8C",
  },
  {
    id: "web-4",
    name: "Web",
    displayName: "test",
    type: "Web",
    botId: "592682401398784",
    icon: Globe,
    color: "#5B6B8C",
  },
  {
    id: "web-5",
    name: "Web",
    displayName: "Test to remove",
    type: "Web",
    botId: "183804652158976",
    icon: Globe,
    color: "#5B6B8C",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    displayName: "WhatsApp Productio...",
    type: "WhatsApp",
    botId: "+447488892962",
    icon: Check,
    color: "#25D366",
  },
]

export default function ChannelsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#272C41]">
      <Header dark={true} />

      <main className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
              Your Channels
              <button className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/60 hover:bg-white/20">
                ?
              </button>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-[#2F8FFF] text-white hover:bg-[#2680E8]">
              <Zap className="h-4 w-4 mr-2" />
              Add Test Channel
            </Button>
            <Button className="bg-[#2F8FFF] text-white hover:bg-[#2680E8]">
              <Zap className="h-4 w-4 mr-2" />
              Add Production Channel
            </Button>
            <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
              Widgets
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {channels.map((channel) => {
            const Icon = channel.icon
            return (
              <Link key={channel.id} href={`/channels/${channel.id}`}>
                <Card className="relative bg-[#313750] border-white/10 hover:border-[#2F8FFF]/50 transition-all cursor-pointer group">
                  <div className="absolute top-3 right-3">
                    <Zap className="h-4 w-4 text-white/40" />
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon className="h-8 w-8" style={{ color: channel.color }} />
                      </div>
                    </div>

                    <div className="space-y-2 text-center">
                      <h3 className="font-semibold text-white">{channel.type}</h3>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-white/60">Name:</span>
                        </div>
                        <div className="text-white">{channel.displayName}</div>
                        <div className="mt-2">
                          <span className="text-white/60">
                            {channel.phoneNumber ? "Phone Number:" : "Bot Id:"}
                          </span>
                        </div>
                        <div className="text-white">{channel.phoneNumber || channel.botId}</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-white/60 hover:text-red-400 hover:bg-red-500/10"
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Channel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}

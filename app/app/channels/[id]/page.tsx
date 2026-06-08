import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

const channelVariables: Record<string, string[]> = {
  "dialogflow-cx": [
    "agent_id",
    "boolean",
    "dfcx-date-or-time",
    "dfcx-extraction-entity",
    "dfcx-free-text",
    "dfcx-memory",
    "dfcx-multiple-choice",
    "dfcx-number",
    "dfcx-regex",
    "dfcx-task-type",
    "email",
    "emptyString",
    "firstNames",
    "lastNames",
    "null",
  ],
  default: ["agent_id", "channel", "conversation_id", "user_id", "session_id"],
}

export async function generateStaticParams() {
  return [
    { id: "dialogflow-cx" },
    { id: "desktop" },
    { id: "facebook" },
    { id: "line" },
    { id: "mobile" },
    { id: "slack" },
    { id: "sms" },
    { id: "telegram" },
    { id: "voice" },
    { id: "web" },
    { id: "whatsapp" },
  ]
}

export default async function ChannelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Get variables for this channel type
  const variables = id === "dialogflow-cx" ? channelVariables["dialogflow-cx"] : channelVariables.default

  // Format channel name
  const channelName = id === "dialogflow-cx" ? "DialogFlow CX" : id.charAt(0).toUpperCase() + id.slice(1)

  return (
    <div className="min-h-screen bg-[#272C41]">
      <Header dark={true} />

      <main className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/channels">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-transparent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-white">Your {channelName} Channel</h1>
        </div>

        {/* Configuration Card */}
        <Card className="bg-[#313750] border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                Configuration
                <button className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/60 hover:bg-white/20">
                  ?
                </button>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bot Token */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Bot Token</label>
              <Input
                defaultValue={id === "dialogflow-cx" ? "d4358055-259b-4224-d11a-fd927c133710" : ""}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#2F8FFF]"
                placeholder="Enter bot token"
              />
            </div>

            {/* Variables */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white uppercase tracking-wide">Variables</label>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable) => (
                  <Badge
                    key={variable}
                    variant="secondary"
                    className="bg-[#2F8FFF] text-white hover:bg-[#2680E8] px-3 py-1 text-sm cursor-pointer"
                  >
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <Button className="bg-[#2F8FFF] text-white hover:bg-[#2680E8]">Save</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

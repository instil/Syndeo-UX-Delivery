"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AgentCard } from "@/components/agent-card"
import { AgentModal } from "@/components/agent-modal"
import { Target, MessageCircleQuestion, Compass, Search, Heart, ShoppingCart, TrendingUp, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

const verticals = [
  "Retail",
  "Finance",
  "Healthcare",
  "Housing",
  "Insurance",
  "Travel & Leisure",
  "Utilities",
  "Telecommunications",
]

const agents = {
  Marketing: [
    {
      id: "lead-generation",
      title: "Lead Generation",
      description:
        "Proactively engage website visitors, asking about their shopping preferences or what they're looking to buy, and capture their contact information for future marketing campaigns.",
      icon: Target,
      iconColor: "#9333EA",
    },
    {
      id: "faq",
      title: "FAQ",
      description: "Enable customers to ask questions and receive responses to common questions.",
      icon: MessageCircleQuestion,
      iconColor: "#6B7280",
    },
    {
      id: "discovery",
      title: "Discovery",
      description: "Enable customers to conversationally search for and pinpoint content on a website.",
      icon: Compass,
      iconColor: "#06B6D4",
    },
    {
      id: "product-search",
      title: "Product Search",
      description:
        "Show customer products and services based on their previous browsing or purchase history. Requires access to a customer data or customer relationship platform.",
      icon: Search,
      iconColor: "#6B7280",
    },
    {
      id: "branch-locator",
      title: "Branch Locator",
      description:
        "The Branch Locator AI Agent allows a caller to locate a branch local to their current address. The Agent initially asks for a Postcode, however if the customer cannot provide this then the Agent will ask for an Address instead.",
      icon: MapPin,
      iconColor: "#8B5CF6",
      hasVariants: true,
    },
  ],
  Sales: [
    {
      id: "product-recommendation",
      title: "Product Recommendation",
      description:
        "Recommend products to customers based on previous buying history or information collected during a conversation or journey.",
      icon: Heart,
      iconColor: "#EC4899",
      hasVariants: true,
    },
    {
      id: "cart-abandonment",
      title: "Cart Abandonment",
      description:
        "Offer help with checkout or provide one-time limited discount based on products or time or activity spent in a cart.",
      icon: ShoppingCart,
      iconColor: "#6B7280",
    },
    {
      id: "cross-sell",
      title: "Cross-sell / Up-sell",
      description: "Suggest complementary or premium products during the purchasing process based on need or budget.",
      icon: TrendingUp,
      iconColor: "#10B981",
    },
  ],
}

export default function AIAgentsPage() {
  const [activeVertical, setActiveVertical] = useState("Retail")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const router = useRouter()

  const handleInstall = (agentId: string, variantId?: string) => {
    console.log("[v0] Installing agent:", agentId, "variant:", variantId)
    setTimeout(() => {
      router.push("/integrations")
    }, 500)
  }

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(agentId)
  }

  return (
    <div className="min-h-screen bg-[#272C41]">
      <Header dark={true} />

      <main className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#313750] border-r border-white/10 min-h-[calc(100vh-64px)]">
          <div className="p-6">
            <h2 className="text-base font-semibold text-white mb-4">Your Verticals</h2>
            <nav className="space-y-1">
              {verticals.map((vertical) => (
                <button
                  key={vertical}
                  onClick={() => setActiveVertical(vertical)}
                  className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors relative ${
                    activeVertical === vertical
                      ? "text-white font-medium bg-[#2F8FFF]/20 border border-[#2F8FFF]"
                      : "text-white/60 hover:bg-white/[0.06] hover:text-white/80"
                  }`}
                >
                  {vertical}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {Object.entries(agents).map(([section, items]) => (
            <div key={section} className="mb-8">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-[#4B6CB7] to-[#5B7FC7] rounded-lg px-6 py-4 mb-6">
                <h3 className="text-xl font-semibold text-white">{section}</h3>
              </div>

              {/* Agent Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((agent) => (
                  <AgentCard key={agent.id} {...agent} onClick={() => handleAgentClick(agent.id)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {selectedAgent && (
        <AgentModal
          agentId={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onInstall={(variantId) => handleInstall(selectedAgent, variantId)}
        />
      )}
    </div>
  )
}

"use client"

import {
  X,
  CloudDownload,
  MapPin,
  Target,
  MessageCircleQuestion,
  Compass,
  Search,
  Heart,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AgentModalProps {
  agentId: string
  onClose: () => void
  onInstall?: (variantId?: string) => void
}

const agentConfigs = {
  "product-recommendation": {
    icon: Heart,
    iconColor: "#EC4899",
    title: "Product Recommendation",
    description:
      "Recommend products to customers based on previous buying history or information collected during a conversation or journey.",
    variants: [
      {
        id: "basic",
        title: "Product Recommendation - Basic",
        description: "Basic blueprint for simple product recommendations based on present data.",
      },
      {
        id: "standard",
        title: "Product Recommendation - Standard",
        description: "Standard blueprint for product recommendations based on customer journey in session.",
      },
      {
        id: "enhanced",
        title: "Product Recommendation - Enhanced",
        description: "Enhanced blueprint for product recommendations based on present, past and historic journey data.",
      },
    ],
  },
  "branch-locator": {
    icon: MapPin,
    iconColor: "#8B5CF6",
    title: "Branch Locator",
    description:
      "The Branch Locator AI Agent allows a caller to locate a branch local to their current address. The Agent initially asks for a Postcode, however if the customer cannot provide this then the Agent will ask for an Address instead.",
    additionalInfo: [
      "The customer is then read back a number of possible branches and asked to choose which one they would prefer. If no branches are found, or if none are suitable then the customer can retry up to a configurable limit (by default this is set to 3).",
      "Once the customer has chosen a branch the Agent will advise them of the opening hours for that particular branch.",
    ],
    variants: [
      {
        id: "standard",
        title: "Standard",
        description: "The standard version of this AI Agent",
      },
    ],
  },
  "lead-generation": {
    icon: Target,
    iconColor: "#9333EA",
    title: "Lead Generation",
    description:
      "Proactively engage website visitors, asking about their shopping preferences or what they're looking to buy, and capture their contact information for future marketing campaigns.",
    variants: [
      {
        id: "standard",
        title: "Standard",
        description: "The standard version of this AI Agent",
      },
    ],
  },
  faq: {
    icon: MessageCircleQuestion,
    iconColor: "#6B7280",
    title: "FAQ",
    description: "Enable customers to ask questions and receive responses to common questions.",
    variants: [
      {
        id: "standard",
        title: "Standard",
        description: "The standard version of this AI Agent",
      },
    ],
  },
  discovery: {
    icon: Compass,
    iconColor: "#06B6D4",
    title: "Discovery",
    description: "Enable customers to conversationally search for and pinpoint content on a website.",
    variants: [
      {
        id: "standard",
        title: "Standard",
        description: "The standard version of this AI Agent",
      },
    ],
  },
  "product-search": {
    icon: Search,
    iconColor: "#6B7280",
    title: "Product Search",
    description:
      "Show customer products and services based on their previous browsing or purchase history. Requires access to a customer data or customer relationship platform.",
    variants: [
      {
        id: "standard",
        title: "Standard",
        description: "The standard version of this AI Agent",
      },
    ],
  },
  "cart-abandonment": {
    icon: ShoppingCart,
    iconColor: "#6B7280",
    title: "Cart Abandonment",
    description:
      "Offer help with checkout or provide one-time limited discount based on products or time or activity spent in a cart.",
    variants: [
      {
        id: "standard",
        title: "Standard",
        description: "The standard version of this AI Agent",
      },
    ],
  },
  "cross-sell": {
    icon: TrendingUp,
    iconColor: "#10B981",
    title: "Cross-sell / Up-sell",
    description: "Suggest complementary or premium products during the purchasing process based on need or budget.",
    variants: [
      {
        id: "standard",
        title: "Standard",
        description: "The standard version of this AI Agent",
      },
    ],
  },
}

export function AgentModal({ agentId, onClose, onInstall }: AgentModalProps) {
  const config = agentConfigs[agentId as keyof typeof agentConfigs]
  if (!config) return null

  const Icon = config.icon

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#313750] border-white/10 rounded-xl shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <DialogHeader className="relative pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${config.iconColor}20` }}
            >
              <Icon className="h-5 w-5" style={{ color: config.iconColor }} />
            </div>
            <DialogTitle className="text-xl font-semibold text-white">{config.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-white/60 mb-6">{config.description}</p>

          {config.additionalInfo && (
            <div className="text-sm text-white/60 mb-6 space-y-3">
              {config.additionalInfo.map((info, idx) => (
                <p key={idx}>{info}</p>
              ))}
            </div>
          )}

          <div className="h-1 w-full mb-4 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 via-purple-400 to-pink-400" />

          <div className="space-y-4">
            {config.variants.map((variant) => (
              <div
                key={variant.id}
                className="border border-white/10 rounded-lg p-4 hover:border-[#2F8FFF] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-medium text-white mb-2">{variant.title}</h5>
                    <p className="text-sm text-white/60">{variant.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      onInstall?.(variant.id)
                      onClose()
                    }}
                    className="gap-2 border-[#2F8FFF] text-[#2F8FFF] hover:bg-[#2F8FFF] hover:text-white transition-colors bg-transparent"
                  >
                    <CloudDownload className="h-4 w-4" />
                    Install
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/40 mt-6 text-center">Published by Syndeo</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export interface Outcome {
  id: string
  name: string
  description: string
  updated: string
}

export const mockWelcome: Outcome[] = [
  {
    id: "welcome",
    name: "Welcome",
    description: "Initial greeting and onboarding flow for new users",
    updated: "Just now",
  },
]

export const mockOutcomes: Outcome[] = [
  {
    id: "1",
    name: "Account Setup",
    description: "Guide users through the account creation process",
    updated: "2 days ago",
  },
  {
    id: "2",
    name: "Support Ticket",
    description: "Help users submit and track support requests",
    updated: "5 days ago",
  },
  {
    id: "fs-branch-locator",
    name: "FS_BranchLocator_V1",
    description:
      'The customer has asked where their nearest branch is. The customer may say something like "Where is my nearest branch?" or "I want to do this in branch".',
    updated: "Just now",
  },
  {
    id: "3",
    name: "Re-Mortgage",
    description: "Assist customers with remortgage applications and questions",
    updated: "1 week ago",
  },
  {
    id: "4",
    name: "Product Information",
    description: "Provide detailed information about products and services",
    updated: "1 week ago",
  },
  {
    id: "5",
    name: "Booking Appointment",
    description: "Schedule appointments with available agents",
    updated: "2 weeks ago",
  },
]

export const allOutcomes: Outcome[] = [...mockWelcome, ...mockOutcomes]

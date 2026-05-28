"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SplashScreen } from "@/components/splash-screen"
import { HomepageNewUser } from "@/components/homepage-new-user"
import { HomepageReturningUser } from "@/components/homepage-returning-user"
import { CompactSimulator } from "@/components/compact-simulator"

export default function DashboardPage() {
  const [showSplash, setShowSplash] = useState(true)
  // Toggle this to test new user vs returning user experience
  const [isNewUser, setIsNewUser] = useState(true)

  const handleEnterPrototype = () => {
    setShowSplash(false)
  }

  const handleShowSplash = () => {
    setShowSplash(true)
  }

  if (showSplash) {
    return <SplashScreen onEnter={handleEnterPrototype} />
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <Header onShowSplash={handleShowSplash} showingDashboard={!showSplash} />
      
      {/* Toggle button for testing (can be removed in production) */}
      <div className="fixed top-20 right-6 z-50">
        <button
          onClick={() => setIsNewUser(!isNewUser)}
          className="bg-white border border-[#E8F0FB] text-xs px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow text-[#6A738A]"
        >
          {isNewUser ? "👋 New User" : "👤 Returning User"}
        </button>
      </div>

      <main>
        {isNewUser ? <HomepageNewUser /> : <HomepageReturningUser />}
      </main>
      <CompactSimulator theme={isNewUser ? "default" : "ikea"} />
    </div>
  )
}

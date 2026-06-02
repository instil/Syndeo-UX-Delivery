"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SplashScreen } from "@/components/splash-screen"
import { HomepageNewUser } from "@/components/homepage-new-user"
import { HomepageReturningUser } from "@/components/homepage-returning-user"
import { HomepageReturningUserV2 } from "@/components/homepage-returning-user-v2"
import { HomepageReturningUserV3 } from "@/components/homepage-returning-user-v3"
import { HomepageReturningUserV4 } from "@/components/homepage-returning-user-v4"
import { HomepageReturningUserV4B } from "@/components/homepage-returning-user-v4b"
import { CompactSimulator } from "@/components/compact-simulator"
import { VersionSwitcher } from "@/components/version-switcher"

export default function DashboardPage() {
  const [showSplash, setShowSplash] = useState(true)
  // Toggle this to test new user vs returning user experience
  const [isNewUser, setIsNewUser] = useState(true)
  const [homepageVersion, setHomepageVersion] = useState<"v1" | "v2" | "v3" | "v4" | "v4b">("v4b")

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
    <div
      className={`min-h-screen ${
        !isNewUser && (homepageVersion === "v2" || homepageVersion === "v3" || homepageVersion === "v4" || homepageVersion === "v4b")
          ? "bg-[#272C41]"
          : "bg-[#F6F8FA]"
      }`}
    >
      <Header onShowSplash={handleShowSplash} showingDashboard={!showSplash} dark={!isNewUser && (homepageVersion === "v2" || homepageVersion === "v3" || homepageVersion === "v4" || homepageVersion === "v4b")} />

      <VersionSwitcher
        version={homepageVersion}
        onChange={setHomepageVersion}
        isNewUser={isNewUser}
        onToggleUser={() => setIsNewUser(!isNewUser)}
      />

      <main>
        {isNewUser ? (
          <HomepageNewUser />
        ) : homepageVersion === "v2" ? (
          <HomepageReturningUserV2 />
        ) : homepageVersion === "v3" ? (
          <HomepageReturningUserV3 />
        ) : homepageVersion === "v4" ? (
          <HomepageReturningUserV4 />
        ) : homepageVersion === "v4b" ? (
          <HomepageReturningUserV4B />
        ) : (
          <HomepageReturningUser />
        )}
      </main>
      {(!isNewUser && homepageVersion === "v1") && <CompactSimulator theme="ikea" />}
      {isNewUser && <CompactSimulator theme="default" />}
    </div>
  )
}

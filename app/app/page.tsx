"use client"

import { useState, useEffect } from "react"
import { useSimulatorVisibility } from "@/components/simulator-visibility-context"
import { Header } from "@/components/header"
import { HomepageNewUser } from "@/components/homepage-new-user"
import { HomepageReturningUser } from "@/components/homepage-returning-user"
import { HomepageReturningUserV2 } from "@/components/homepage-returning-user-v2"
import { HomepageReturningUserV3 } from "@/components/homepage-returning-user-v3"
import { HomepageReturningUserV4 } from "@/components/homepage-returning-user-v4"
import { HomepageReturningUserV5 } from "@/components/homepage-returning-user-v5"
import { HomepageReturningUserPhase1 } from "@/components/homepage-returning-user-phase1"
import { HomepageNewUserPhase1 } from "@/components/homepage-new-user-phase1"
import { CompactSimulator } from "@/components/compact-simulator"
import { VersionSwitcher } from "@/components/version-switcher"

type ReturningVersion = "phase1" | "v1" | "v2" | "v3" | "v4" | "v5"

export default function DashboardPage() {
  const [isNewUser, setIsNewUser] = useState(false)
  const [homepageVersion, setHomepageVersion] = useState<ReturningVersion>("phase1")
  const { disable, enable } = useSimulatorVisibility()

  useEffect(() => {
    disable()
    return () => enable()
  }, [disable, enable])

  const isDark = homepageVersion === "phase1" || (!isNewUser && homepageVersion !== "v1")

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#272C41]" : "bg-[#F6F8FA]"}`}>
      <Header onShowSplash={() => {}} showingDashboard={true} dark={isDark} />
      <VersionSwitcher
        version={homepageVersion}
        onChange={setHomepageVersion}
        isNewUser={isNewUser}
        onToggleUser={() => setIsNewUser(!isNewUser)}
      />
      <main>
        {isNewUser && homepageVersion === "phase1" ? (
          <HomepageNewUserPhase1 />
        ) : isNewUser ? (
          <HomepageNewUser />
        ) : homepageVersion === "phase1" ? (
          <HomepageReturningUserPhase1 />
        ) : homepageVersion === "v2" ? (
          <HomepageReturningUserV2 />
        ) : homepageVersion === "v3" ? (
          <HomepageReturningUserV3 />
        ) : homepageVersion === "v4" ? (
          <HomepageReturningUserV4 />
        ) : homepageVersion === "v5" ? (
          <HomepageReturningUserV5 />
        ) : (
          <HomepageReturningUser />
        )}
      </main>
      {(!isNewUser && homepageVersion === "v1") && <CompactSimulator theme="ikea" />}
      {(isNewUser && homepageVersion !== "phase1") && <CompactSimulator theme="default" />}
    </div>
  )
}

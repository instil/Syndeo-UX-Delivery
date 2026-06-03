"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HomepageNewUser } from "@/components/homepage-new-user"
import { HomepageReturningUser } from "@/components/homepage-returning-user"
import { HomepageReturningUserV2 } from "@/components/homepage-returning-user-v2"
import { HomepageReturningUserV3 } from "@/components/homepage-returning-user-v3"
import { HomepageReturningUserV4 } from "@/components/homepage-returning-user-v4"
import { CompactSimulator } from "@/components/compact-simulator"
import { VersionSwitcher } from "@/components/version-switcher"

export default function DashboardPage() {
  const [isNewUser, setIsNewUser] = useState(true)
  const [homepageVersion, setHomepageVersion] = useState<"v1" | "v2" | "v3" | "v4">("v4")

  const isDark = !isNewUser && (homepageVersion === "v2" || homepageVersion === "v3" || homepageVersion === "v4")

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#272C41]" : "bg-[#F6F8FA]"}`}>
      <Header onShowSplash={() => {}} showingDashboard={true} dark={isDark} />
      <VersionSwitcher version={homepageVersion} onChange={setHomepageVersion} isNewUser={isNewUser} onToggleUser={() => setIsNewUser(!isNewUser)} />
      <main>
        {isNewUser ? (
          <HomepageNewUser />
        ) : homepageVersion === "v2" ? (
          <HomepageReturningUserV2 />
        ) : homepageVersion === "v3" ? (
          <HomepageReturningUserV3 />
        ) : homepageVersion === "v4" ? (
          <HomepageReturningUserV4 />
        ) : (
          <HomepageReturningUser />
        )}
      </main>
      {(!isNewUser && homepageVersion === "v1") && <CompactSimulator theme="ikea" />}
      {isNewUser && <CompactSimulator theme="default" />}
    </div>
  )
}

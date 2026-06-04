"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onShowSplash?: () => void
  showingDashboard?: boolean
  dark?: boolean
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function Header({ onShowSplash, showingDashboard, dark }: HeaderProps = {}) {
  const pathname = usePathname()

  return (
    <header className={dark ? "bg-[#272C41]" : "border-b border-[#DDE5EF] bg-white"}>
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {onShowSplash ? (
              <button onClick={onShowSplash} className="flex items-center cursor-pointer">
                <Image
                  src={dark ? `${BASE_PATH}/images/syndeo-logo-white.svg` : `${BASE_PATH}/images/syndeo-logo.png`}
                  alt="SYNDEO"
                  width={120}
                  height={32}
                  priority
                  className="h-8 w-auto"
                />
              </button>
            ) : (
              <Link href="/" className="flex items-center">
                <Image
                  src={dark ? `${BASE_PATH}/images/syndeo-logo-white.svg` : `${BASE_PATH}/images/syndeo-logo.png`}
                  alt="SYNDEO"
                  width={120}
                  height={32}
                  priority
                  className="h-8 w-auto"
                />
              </Link>
            )}

            <nav className="flex items-center h-16">
              {onShowSplash && showingDashboard ? (
                <button
                  onClick={() => {}}
                  className={cn(
                    "h-16 flex items-center px-3 text-sm font-medium transition-colors border-b-4",
                    pathname === "/"
                      ? dark ? "border-[#2F8FFF] text-white" : "border-[#2F8FFF] text-[#2F8FFF]"
                      : dark ? "border-transparent text-white/70 hover:text-white" : "border-transparent text-[#6A738A] hover:text-[#1E2535]",
                  )}
                >
                  Home
                </button>
              ) : (
                <Link
                  href="/"
                  className={cn(
                    "h-16 flex items-center px-3 text-sm font-medium transition-colors border-b-4",
                    pathname === "/"
                      ? dark ? "border-[#2F8FFF] text-white" : "border-[#2F8FFF] text-[#2F8FFF]"
                      : dark ? "border-transparent text-white/70 hover:text-white" : "border-transparent text-[#6A738A] hover:text-[#1E2535]",
                  )}
                >
                  Home
                </Link>
              )}
              <Link
                href="/flows"
                className={cn(
                  "h-16 flex items-center px-3 text-sm font-medium transition-colors border-b-4",
                  pathname?.startsWith("/flows")
                    ? dark ? "border-[#2F8FFF] text-white" : "border-[#2F8FFF] text-[#2F8FFF]"
                    : dark ? "border-transparent text-white/70 hover:text-white" : "border-transparent text-[#6A738A] hover:text-[#1E2535]",
                )}
              >
                Flows
              </Link>
              <Link
                href="/reports"
                className={cn(
                  "h-16 flex items-center px-3 text-sm font-medium transition-colors border-b-4",
                  pathname === "/reports"
                    ? dark ? "border-[#2F8FFF] text-white" : "border-[#2F8FFF] text-[#2F8FFF]"
                    : dark ? "border-transparent text-white/70 hover:text-white" : "border-transparent text-[#6A738A] hover:text-[#1E2535]",
                )}
              >
                Reports
              </Link>
              <Link
                href="/ai-agents"
                className={cn(
                  "h-16 flex items-center px-3 text-sm font-medium transition-colors border-b-4",
                  pathname === "/ai-agents"
                    ? dark ? "border-[#2F8FFF] text-white" : "border-[#2F8FFF] text-[#2F8FFF]"
                    : dark ? "border-transparent text-white/70 hover:text-white" : "border-transparent text-[#6A738A] hover:text-[#1E2535]",
                )}
              >
                AI Agents
              </Link>
              <Link
                href="/ai-workbench"
                className={cn(
                  "h-16 flex items-center px-3 text-sm font-medium transition-colors border-b-4",
                  pathname === "/ai-workbench"
                    ? dark ? "border-[#2F8FFF] text-white" : "border-[#2F8FFF] text-[#2F8FFF]"
                    : dark ? "border-transparent text-white/70 hover:text-white" : "border-transparent text-[#6A738A] hover:text-[#1E2535]",
                )}
              >
                AI Workbench
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-16 gap-1 text-sm font-medium rounded-none border-b-4 hover:bg-transparent",
                      pathname === "/integrations" || pathname?.startsWith("/configuration")
                        ? dark ? "border-[#2F8FFF] text-white" : "border-[#2F8FFF] text-[#2F8FFF]"
                        : dark ? "border-transparent text-white/70 hover:text-white" : "border-transparent text-[#6A738A] hover:text-[#1E2535]",
                    )}
                  >
                    Configuration
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem className="text-[#1E2535] hover:bg-[#F0F6FF] cursor-pointer">Web</DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[#1E2535] hover:bg-[#F0F6FF] cursor-pointer">
                    <Link href="/integrations">Integrations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[#1E2535] hover:bg-[#F0F6FF] cursor-pointer">
                    Deployments
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[#1E2535] hover:bg-[#F0F6FF] cursor-pointer">
                    Transfer
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[#1E2535] hover:bg-[#F0F6FF] cursor-pointer">
                    Business Configuration
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("gap-2", dark ? "text-white hover:bg-white/10" : "text-[#1E2535] hover:bg-[#F0F6FF]")}>
                  <span className="text-sm font-medium">Bohdan Testing Co...</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Switch Organization</DropdownMenuItem>
                <DropdownMenuItem>Organization Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className={cn("relative", dark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-[#6A738A] hover:bg-[#F0F6FF]")}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-[#10B981] rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("rounded-full", dark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-[#6A738A] hover:bg-[#F0F6FF]")}>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

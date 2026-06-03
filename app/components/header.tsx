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
    <header className={dark ? "bg-[#272C41]" : "border-b border-[#E8F0FB] bg-white"}>
      <div className="container mx-auto px-6">
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

            <nav className="flex items-center gap-6">
              {onShowSplash && showingDashboard ? (
                <button
                  onClick={() => {}}
                  className={cn(
                    "text-sm font-medium transition-colors relative",
                    pathname === "/"
                      ? "text-white after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-[#2F8FFF]"
                      : dark ? "text-white hover:text-white/80" : "text-[#6A738A] hover:text-[#2F8FFF]",
                  )}
                >
                  Home
                </button>
              ) : (
                <Link
                  href="/"
                  className={cn(
                    "text-sm font-medium transition-colors relative",
                    pathname === "/"
                      ? "text-white after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-[#2F8FFF]"
                      : dark ? "text-white hover:text-white/80" : "text-[#6A738A] hover:text-[#2F8FFF]",
                  )}
                >
                  Home
                </Link>
              )}
              <Link
                href="/flows"
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  pathname?.startsWith("/flows")
                    ? "text-white after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-[#2F8FFF]"
                    : dark ? "text-white hover:text-white/80" : "text-[#6A738A] hover:text-[#2F8FFF]",
                )}
              >
                Flows
              </Link>
              <Link
                href="/reports"
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  pathname === "/reports"
                    ? "text-white after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-[#2F8FFF]"
                    : dark ? "text-white hover:text-white/80" : "text-[#6A738A] hover:text-[#2F8FFF]",
                )}
              >
                Reports
              </Link>
              <Link
                href="/ai-agents"
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  pathname === "/ai-agents"
                    ? "text-white after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-[#2F8FFF]"
                    : dark ? "text-white hover:text-white/80" : "text-[#6A738A] hover:text-[#2F8FFF]",
                )}
              >
                AI Agents
              </Link>
              <Link
                href="/ai-workbench"
                className={cn(
                  "text-sm font-medium transition-colors relative",
                  pathname === "/ai-workbench"
                    ? "text-white after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-[#2F8FFF]"
                    : dark ? "text-white hover:text-white/80" : "text-[#6A738A] hover:text-[#2F8FFF]",
                )}
              >
                AI Workbench
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-1 text-sm font-medium relative",
                      dark ? "hover:bg-white/10" : "hover:bg-[#E8F0FB]",
                      pathname === "/integrations" || pathname?.startsWith("/configuration")
                        ? "text-white after:absolute after:bottom-[-1px] after:left-3 after:right-3 after:h-0.5 after:bg-[#2F8FFF]"
                        : dark ? "text-white hover:text-white/80" : "text-[#6A738A] hover:text-[#2F8FFF]",
                    )}
                  >
                    Configuration
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem className="text-[#3B4760] hover:bg-[#E8F0FB] cursor-pointer">Web</DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[#3B4760] hover:bg-[#E8F0FB] cursor-pointer">
                    <Link href="/integrations">Integrations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[#3B4760] hover:bg-[#E8F0FB] cursor-pointer">
                    Deployments
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[#3B4760] hover:bg-[#E8F0FB] cursor-pointer">
                    Transfer
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[#3B4760] hover:bg-[#E8F0FB] cursor-pointer">
                    Business Configuration
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("gap-2", dark ? "text-white hover:bg-white/10" : "text-[#3B4760] hover:bg-[#E8F0FB]")}>
                  <span className="text-sm font-medium">Bohdan Testing Co...</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Switch Organization</DropdownMenuItem>
                <DropdownMenuItem>Organization Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className={cn("relative", dark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-[#6A738A] hover:bg-[#E8F0FB]")}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-[#10B981] rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("rounded-full", dark ? "text-white/60 hover:bg-white/10 hover:text-white" : "text-[#6A738A] hover:bg-[#E8F0FB]")}>
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

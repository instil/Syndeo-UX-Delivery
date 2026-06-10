"use client"

import { useSimulatorVisibility } from "@/components/simulator-visibility-context"
import { FloatingSimulatorLauncher } from "@/components/floating-simulator-launcher"

export function SimulatorLauncherWrapper() {
  const { hidden, disabled } = useSimulatorVisibility()
  if (hidden) return null
  return <FloatingSimulatorLauncher disabled={disabled} />
}

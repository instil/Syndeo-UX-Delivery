"use client"

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react"

interface SimulatorVisibilityContextType {
  hidden: boolean
  disabled: boolean
  hide: () => void
  show: () => void
  disable: () => void
  enable: () => void
  /** When set, the floating button calls this instead of opening the flow picker */
  simulatorToggle: (() => void) | null
  registerSimulatorToggle: (fn: (() => void) | null) => void
}

const SimulatorVisibilityContext = createContext<SimulatorVisibilityContextType>({
  hidden: false,
  disabled: false,
  hide: () => {},
  show: () => {},
  disable: () => {},
  enable: () => {},
  simulatorToggle: null,
  registerSimulatorToggle: () => {},
})

export function SimulatorVisibilityProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [simulatorToggle, setSimulatorToggle] = useState<(() => void) | null>(null)
  const hide = useCallback(() => setHidden(true), [])
  const show = useCallback(() => setHidden(false), [])
  const disable = useCallback(() => setDisabled(true), [])
  const enable = useCallback(() => setDisabled(false), [])
  const registerSimulatorToggle = useCallback((fn: (() => void) | null) => {
    setSimulatorToggle(fn ? () => fn : null)
  }, [])
  return (
    <SimulatorVisibilityContext.Provider value={{ hidden, disabled, hide, show, disable, enable, simulatorToggle, registerSimulatorToggle }}>
      {children}
    </SimulatorVisibilityContext.Provider>
  )
}

export function useSimulatorVisibility() {
  return useContext(SimulatorVisibilityContext)
}

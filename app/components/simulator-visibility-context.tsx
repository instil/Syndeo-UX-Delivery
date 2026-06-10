"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface SimulatorVisibilityContextType {
  hidden: boolean
  disabled: boolean
  hide: () => void
  show: () => void
  disable: () => void
  enable: () => void
}

const SimulatorVisibilityContext = createContext<SimulatorVisibilityContextType>({
  hidden: false,
  disabled: false,
  hide: () => {},
  show: () => {},
  disable: () => {},
  enable: () => {},
})

export function SimulatorVisibilityProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const hide = useCallback(() => setHidden(true), [])
  const show = useCallback(() => setHidden(false), [])
  const disable = useCallback(() => setDisabled(true), [])
  const enable = useCallback(() => setDisabled(false), [])
  return (
    <SimulatorVisibilityContext.Provider value={{ hidden, disabled, hide, show, disable, enable }}>
      {children}
    </SimulatorVisibilityContext.Provider>
  )
}

export function useSimulatorVisibility() {
  return useContext(SimulatorVisibilityContext)
}

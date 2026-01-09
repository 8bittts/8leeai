import { useCallback, useState } from "react"
import type { CommandPanel } from "@/lib/commands"

export type ActivePanel = { type: CommandPanel } | { type: "output"; content: string } | null

export interface ActivePanelState {
  activePanel: ActivePanel
  statusMessage: string
  showPanel: (panel: CommandPanel, status: string) => void
  showOutput: (content: string, status: string) => void
  clearPanels: () => void
  setStatusMessage: (message: string) => void
}

export function useActivePanel(): ActivePanelState {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [statusMessage, setStatusMessage] = useState("")

  const clearPanels = useCallback(() => {
    setActivePanel(null)
  }, [])

  const showPanel = useCallback((panel: CommandPanel, status: string) => {
    setActivePanel({ type: panel })
    setStatusMessage(status)
  }, [])

  const showOutput = useCallback((content: string, status: string) => {
    setActivePanel(content ? { type: "output", content } : null)
    setStatusMessage(status)
  }, [])

  return {
    activePanel,
    statusMessage,
    showPanel,
    showOutput,
    clearPanels,
    setStatusMessage,
  }
}

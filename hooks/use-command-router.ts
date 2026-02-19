import { useCallback } from "react"
import { useTheme } from "@/hooks/use-theme"
import { getSystemCommandOutput } from "@/lib/command-handlers"
import {
  isNumericCommand,
  normalizeCommand,
  parseTextCommand,
  pickRandomProjectNumber,
  resolveNumericCommand,
} from "@/lib/command-routing"
import { type CommandDefinition, resolveCommand } from "@/lib/commands"
import {
  DATA_OFFSETS,
  education,
  projectNumberById,
  projects,
  projectsWithUrls,
  volunteer,
} from "@/lib/data"
import { getTheme, isValidThemeId, type ThemeId } from "@/lib/themes"
import { openExternalLink, PROJECTS_PER_PAGE } from "@/lib/utils"
import type { ActivePanelState } from "./use-active-panel"

interface CommandRouterProps {
  panelState: ActivePanelState
  showMoreProjects: () => void
  openProject: (projectNumber: number) => void
  clearToStart: () => void
  triggerFlash: () => void
  visibleProjects: number
  totalProjects: number
  setCommand: (command: string) => void
  suppressVirtualKeyboard: () => void
}

export function useCommandRouter({
  panelState,
  showMoreProjects,
  openProject,
  clearToStart,
  triggerFlash,
  visibleProjects,
  totalProjects,
  setCommand,
  suppressVirtualKeyboard,
}: CommandRouterProps) {
  const { showPanel, showOutput, clearPanels, setStatusMessage, activePanel } = panelState
  const { currentTheme, setTheme } = useTheme()

  const resetInput = useCallback(() => {
    setCommand("")
  }, [setCommand])

  const handleUnknownCommand = useCallback(() => {
    triggerFlash()
    setStatusMessage("")
    resetInput()
  }, [triggerFlash, setStatusMessage, resetInput])

  const switchTheme = useCallback(
    (themeId: ThemeId) => {
      const theme = getTheme(themeId)

      if (themeId === currentTheme) {
        showOutput(
          `Theme: ${themeId} (already active)\n${theme.description}`,
          `${themeId} theme already active`
        )
        return
      }

      setTheme(themeId)
      showOutput(
        `Theme switched to: ${themeId}\n${theme.description}`,
        `Switched to ${themeId} theme`
      )
    },
    [currentTheme, setTheme, showOutput]
  )

  const handleThemeCommand = useCallback(
    (args: string) => {
      if (!args) {
        showPanel("themes", "Available themes displayed")
        return
      }

      const themeId = args.toLowerCase()
      if (isValidThemeId(themeId)) {
        switchTheme(themeId)
        return
      }

      showOutput(`Unknown theme: ${themeId}\nType 'theme' for available themes.`, "Unknown theme")
    },
    [showPanel, showOutput, switchTheme]
  )

  const handleSystemCommand = useCallback(
    (id: string) => {
      clearPanels()
      const output = getSystemCommandOutput(id)
      if (output) {
        showOutput(output.content, output.status)
      }
    },
    [clearPanels, showOutput]
  )

  const handleRandomCommand = useCallback(() => {
    const projectNumber = pickRandomProjectNumber(
      projectsWithUrls,
      projects,
      Math.random,
      projectNumberById
    )

    if (projectNumber === null) {
      setStatusMessage("No projects with links available")
      resetInput()
      return
    }

    openProject(projectNumber)
    setStatusMessage(`Opening random project ${projectNumber} in new tab`)
    resetInput()
  }, [openProject, setStatusMessage, resetInput])

  const handleEmptyCommand = useCallback(() => {
    if (visibleProjects < totalProjects) {
      showMoreProjects()
      const newVisible = Math.min(visibleProjects + PROJECTS_PER_PAGE, totalProjects)
      setStatusMessage(`Loaded ${newVisible} of ${totalProjects} projects`)
    } else {
      setStatusMessage("All projects loaded")
    }

    resetInput()
  }, [visibleProjects, totalProjects, showMoreProjects, setStatusMessage, resetInput])

  const openNumberedItem = useCallback(
    (number: number, url: string | undefined) => {
      if (!url) {
        setStatusMessage("Selected entry has no external link")
        return
      }

      openExternalLink(url)
      setStatusMessage(`Opening entry ${number} in new tab`)
    },
    [setStatusMessage]
  )

  const handleNumericCommand = useCallback(
    (normalized: string) => {
      const number = Number.parseInt(normalized, 10)
      const match = resolveNumericCommand(number, DATA_OFFSETS)

      if (!match) {
        handleUnknownCommand()
        return
      }

      if (match.section === "projects") {
        openProject(number)
        setStatusMessage(`Opening project ${number} in new tab`)
        resetInput()
        return
      }

      if (match.section === "education") {
        openNumberedItem(number, education[match.index]?.url)
        resetInput()
        return
      }

      openNumberedItem(number, volunteer[match.index]?.url)
      resetInput()
    },
    [handleUnknownCommand, openProject, setStatusMessage, openNumberedItem, resetInput]
  )

  const handlePanelResolved = useCallback(
    (def: CommandDefinition): boolean => {
      if (!(def.panel && def.status)) {
        return false
      }

      clearPanels()
      showPanel(def.panel, def.status)
      resetInput()
      return true
    },
    [clearPanels, showPanel, resetInput]
  )

  const handleLinkResolved = useCallback(
    (def: CommandDefinition): boolean => {
      if (!def.url) {
        return false
      }

      openExternalLink(def.url)
      setStatusMessage(`Opening ${def.label} in new tab`)
      resetInput()
      return true
    },
    [setStatusMessage, resetInput]
  )

  const handleClearResolved = useCallback(
    (def: CommandDefinition) => {
      clearPanels()
      clearToStart()
      setStatusMessage(def.status ?? "Terminal cleared")
      resetInput()
    },
    [clearPanels, clearToStart, setStatusMessage, resetInput]
  )

  const handleResolvedCommand = useCallback(
    (cmdKey: string, args: string) => {
      const resolved = resolveCommand(cmdKey)

      if (!resolved) {
        handleUnknownCommand()
        return
      }

      switch (resolved.kind) {
        case "theme":
          clearPanels()
          handleThemeCommand(args)
          resetInput()
          return
        case "echo":
          clearPanels()
          showOutput(args, "Echo")
          resetInput()
          return
        case "system":
          handleSystemCommand(resolved.id)
          resetInput()
          return
        case "panel": {
          const wasHandled = handlePanelResolved(resolved)
          if (!wasHandled) {
            handleUnknownCommand()
          }
          return
        }
        case "link": {
          const wasHandled = handleLinkResolved(resolved)
          if (!wasHandled) {
            handleUnknownCommand()
          }
          return
        }
        case "clear":
          handleClearResolved(resolved)
          return
        case "random":
          handleRandomCommand()
          return
        default:
          handleUnknownCommand()
      }
    },
    [
      handleUnknownCommand,
      clearPanels,
      showOutput,
      handleThemeCommand,
      handleSystemCommand,
      handlePanelResolved,
      handleLinkResolved,
      handleClearResolved,
      handleRandomCommand,
      resetInput,
    ]
  )

  const handleThemeShortcut = useCallback(
    (cmdKey: string) => {
      if (activePanel?.type === "themes" && isValidThemeId(cmdKey)) {
        switchTheme(cmdKey)
        resetInput()
        return true
      }
      return false
    },
    [activePanel, switchTheme, resetInput]
  )

  const handleTextCommand = useCallback(
    (normalized: string) => {
      const { key, args } = parseTextCommand(normalized)

      if (handleThemeShortcut(key)) {
        return
      }

      handleResolvedCommand(key, args)
    },
    [handleThemeShortcut, handleResolvedCommand]
  )

  const handleCommand = useCallback(
    (rawCommand: string) => {
      const normalized = normalizeCommand(rawCommand)

      if (normalized === "") {
        handleEmptyCommand()
        suppressVirtualKeyboard()
        return
      }

      if (isNumericCommand(normalized)) {
        handleNumericCommand(normalized)
        suppressVirtualKeyboard()
        return
      }

      handleTextCommand(normalized)
      suppressVirtualKeyboard()
    },
    [handleEmptyCommand, handleNumericCommand, handleTextCommand, suppressVirtualKeyboard]
  )

  return { handleCommand }
}

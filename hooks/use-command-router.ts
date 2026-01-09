import { useCallback } from "react"
import type { ActivePanelState } from "@/hooks/use-active-panel"
import { useTheme } from "@/hooks/use-theme"
import { getSystemCommandOutput } from "@/lib/command-handlers"
import { type CommandDefinition, resolveCommand } from "@/lib/commands"
import { education, type PortfolioItem, projects, volunteer } from "@/lib/data"
import { isValidThemeId, type ThemeId } from "@/lib/themes"
import { DATA_OFFSETS, openExternalLink, PROJECTS_PER_PAGE } from "@/lib/utils"

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
  const { currentTheme, setTheme, availableThemes } = useTheme()

  const switchTheme = useCallback(
    (themeArg: ThemeId) => {
      const theme = availableThemes.find((t) => t.id === themeArg)
      if (themeArg === currentTheme) {
        showOutput(
          `Theme: ${themeArg} (already active)\n${theme?.description || ""}`,
          `${themeArg} theme already active`
        )
      } else {
        setTheme(themeArg)
        showOutput(
          `Theme switched to: ${themeArg}\n${theme?.description || ""}`,
          `Switched to ${themeArg} theme`
        )
      }
    },
    [availableThemes, currentTheme, setTheme, showOutput]
  )

  const handleThemeCommand = useCallback(
    (args: string) => {
      if (!args) {
        showPanel("themes", "Available themes displayed")
        return
      }

      const themeArg = args.toLowerCase()
      if (isValidThemeId(themeArg)) {
        switchTheme(themeArg)
      } else {
        showOutput(
          `Unknown theme: ${themeArg}\nType 'theme' for available themes.`,
          "Unknown theme"
        )
      }
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
    const projectsWithUrls = projects.filter((project) => project.url?.trim())
    if (projectsWithUrls.length > 0) {
      const randomProject = projectsWithUrls[Math.floor(Math.random() * projectsWithUrls.length)]
      if (randomProject) {
        const projectNumber = projects.findIndex((p) => p.id === randomProject.id) + 1
        openProject(projectNumber)
        setStatusMessage(`Opening random project ${projectNumber} in new tab`)
      }
    }
    setCommand("")
  }, [openProject, setStatusMessage, setCommand])

  const handleEmptyCommand = useCallback(() => {
    if (visibleProjects < totalProjects) {
      showMoreProjects()
      const newVisible = Math.min(visibleProjects + PROJECTS_PER_PAGE, totalProjects)
      setStatusMessage(`Loaded ${newVisible} of ${totalProjects} projects`)
    } else {
      setStatusMessage("All projects loaded")
    }
    setCommand("")
  }, [visibleProjects, totalProjects, showMoreProjects, setStatusMessage, setCommand])

  const openNumberedItem = useCallback(
    (number: number, offset: number, items: ReadonlyArray<PortfolioItem>) => {
      const index = number - offset
      const item = items[index]
      if (item?.url) {
        openExternalLink(item.url)
        setStatusMessage(`Opening entry ${number} in new tab`)
      }
    },
    [setStatusMessage]
  )

  const handleNumericCommand = useCallback(
    (cmd: string) => {
      const number = Number.parseInt(cmd, 10)

      if (number >= DATA_OFFSETS.projects.start && number <= DATA_OFFSETS.projects.end) {
        openProject(number)
        setStatusMessage(`Opening project ${number} in new tab`)
      } else if (number >= DATA_OFFSETS.education.start && number <= DATA_OFFSETS.education.end) {
        openNumberedItem(number, DATA_OFFSETS.education.start, education)
      } else if (number >= DATA_OFFSETS.volunteer.start && number <= DATA_OFFSETS.volunteer.end) {
        openNumberedItem(number, DATA_OFFSETS.volunteer.start, volunteer)
      } else {
        triggerFlash()
        setStatusMessage("")
      }
      setCommand("")
    },
    [openProject, openNumberedItem, triggerFlash, setStatusMessage, setCommand]
  )

  const handleUnknownCommand = useCallback(() => {
    triggerFlash()
    setCommand("")
    setStatusMessage("")
  }, [triggerFlash, setCommand, setStatusMessage])

  const handleResolvedCommand = useCallback(
    (cmdKey: string, args: string) => {
      const resolved = resolveCommand(cmdKey)

      if (!resolved) {
        handleUnknownCommand()
        return
      }

      const handlePanelResolved = (def: CommandDefinition) => {
        if (!(def.panel && def.status)) {
          handleUnknownCommand()
          return
        }
        clearPanels()
        showPanel(def.panel, def.status)
      }

      const handleLinkResolved = (def: CommandDefinition) => {
        if (!def.url) {
          handleUnknownCommand()
          return
        }
        openExternalLink(def.url)
        setCommand("")
        setStatusMessage(`Opening ${def.label} in new tab`)
      }

      const handleClearResolved = (def: CommandDefinition) => {
        clearPanels()
        clearToStart()
        setStatusMessage(def.status ?? "Terminal cleared")
        setCommand("")
      }

      switch (resolved.kind) {
        case "theme":
          clearPanels()
          handleThemeCommand(args)
          setCommand("")
          return
        case "echo":
          clearPanels()
          showOutput(args, "Echo")
          setCommand("")
          return
        case "system":
          handleSystemCommand(resolved.id)
          setCommand("")
          return
        case "panel":
          handlePanelResolved(resolved)
          setCommand("")
          return
        case "link":
          handleLinkResolved(resolved)
          return
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
      showPanel,
      showOutput,
      handleThemeCommand,
      handleSystemCommand,
      handleRandomCommand,
      clearToStart,
      setStatusMessage,
      setCommand,
    ]
  )

  const handleThemeShortcut = useCallback(
    (cmdKey: string) => {
      if (activePanel?.type === "themes" && isValidThemeId(cmdKey)) {
        switchTheme(cmdKey)
        return true
      }
      return false
    },
    [activePanel, switchTheme]
  )

  const handleTextCommand = useCallback(
    (rawCommand: string) => {
      const head = rawCommand.split(/\s+/)[0] ?? ""
      const cmdKey = head.toLowerCase()
      const args = rawCommand.slice(head.length).trim()

      if (handleThemeShortcut(cmdKey)) {
        setCommand("")
        return
      }

      handleResolvedCommand(cmdKey, args)
    },
    [handleThemeShortcut, handleResolvedCommand, setCommand]
  )

  const handleCommand = useCallback(
    (rawCommand: string) => {
      // Strip leading slash to support slash command syntax (e.g., "/education", "/github")
      const normalizedCommand = rawCommand.trim().replace(/^\//, "")

      if (normalizedCommand === "") {
        handleEmptyCommand()
        suppressVirtualKeyboard()
        return
      }

      if (/^\d+$/.test(normalizedCommand)) {
        handleNumericCommand(normalizedCommand)
        suppressVirtualKeyboard()
        return
      }

      handleTextCommand(normalizedCommand)
      suppressVirtualKeyboard()
    },
    [handleEmptyCommand, handleNumericCommand, handleTextCommand, suppressVirtualKeyboard]
  )

  return { handleCommand }
}

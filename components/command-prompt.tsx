"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { DataGridSection } from "@/components/data-grid-section"
import { Section } from "@/components/section"
import { ThemeGridSection } from "@/components/theme-grid-section"
import { useTheme } from "@/hooks/use-theme"
import { useVirtualKeyboardSuppression } from "@/hooks/use-virtual-keyboard-suppression"
import {
  COMMAND_HELP_LINES,
  type CommandDefinition,
  type CommandPanel,
  resolveCommand,
  VALID_COMMANDS,
} from "@/lib/commands"
import { education, type PortfolioItem, projects, volunteer } from "@/lib/data"
import { isValidThemeId, type ThemeId } from "@/lib/themes"
import {
  DATA_OFFSETS,
  interactiveButton,
  interactiveLink,
  openExternalLink,
  PROJECTS_PER_PAGE,
} from "@/lib/utils"

interface CommandPromptProps {
  showMoreProjects: () => void
  openProject: (projectNumber: number) => void
  clearToStart: () => void
  triggerFlash: () => void
  visibleProjects: number
  totalProjects: number
  command: string
  setCommand: (command: string) => void
}

export interface CommandPromptRef {
  focus: () => void
}

type ActivePanel = { type: CommandPanel } | { type: "output"; content: string } | null

export const CommandPrompt = forwardRef<CommandPromptRef, CommandPromptProps>(
  function CommandPromptComponent(
    {
      showMoreProjects,
      openProject,
      clearToStart,
      triggerFlash,
      visibleProjects,
      totalProjects,
      command,
      setCommand,
    },
    ref
  ) {
    const [activePanel, setActivePanel] = useState<ActivePanel>(null)
    const [statusMessage, setStatusMessage] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const { suppressVirtualKeyboard, releaseKeyboardSuppression } =
      useVirtualKeyboardSuppression(inputRef)
    const { currentTheme, setTheme, availableThemes } = useTheme()

    // Auto-focus input on mount (after boot sequence completes)
    useEffect(() => {
      inputRef.current?.focus()
    }, [])

    const clearPanels = () => {
      setActivePanel(null)
    }

    const showPanel = (panel: CommandPanel, status: string) => {
      setActivePanel({ type: panel })
      setStatusMessage(status)
      setCommand("")
    }

    const showOutput = (content: string, status: string) => {
      setActivePanel(content ? { type: "output", content } : null)
      setStatusMessage(status)
      setCommand("")
    }

    const handleRandomCommand = () => {
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
    }

    const switchTheme = (themeArg: ThemeId) => {
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
    }

    const handleThemeCommand = (args: string) => {
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
    }

    const handleSystemCommand = (id: string) => {
      clearPanels()

      if (id === "whoami") {
        showOutput(
          "You're exploring Eight Lee's portfolio terminal.\nType 'help' to see what I can do!",
          "User info displayed"
        )
        return
      }

      if (id === "uname") {
        const birthYear = 1982
        const birthMonth = 10
        const birthDay = 9
        const now = new Date()
        const year = now.getFullYear()
        const birthdayThisYear = new Date(year, birthMonth, birthDay)
        const hasHadBirthday = now >= birthdayThisYear
        const age = year - birthYear - (hasHadBirthday ? 0 : 1)

        showOutput(
          `8leeOS v${age} (Terminal Edition)\nBuilt with Next.js 16.0.3 + React 19.2.0`,
          "System info displayed"
        )
        return
      }

      if (id === "date") {
        showOutput(new Date().toString(), "Current date/time displayed")
        return
      }

      if (id === "stats") {
        const totalCommands = VALID_COMMANDS.length
        showOutput(
          `Portfolio Statistics
${"═".repeat(50)}
Total Projects:        ${projects.length}
Education Entries:     ${education.length}
Volunteer Roles:       ${volunteer.length}
Available Commands:    ${totalCommands}
Technologies:          React, Next.js, TypeScript, AI/ML,
                      Tailwind CSS, Bun, Node.js, Python
Years Active:          20+ years
Latest Project:        ${projects[0]?.name || "N/A"}
Focus Areas:           AI/ML, Full-Stack Web, Systems`,
          "Portfolio statistics displayed"
        )
      }
    }

    const handleEmptyCommand = () => {
      if (visibleProjects < totalProjects) {
        showMoreProjects()
        const newVisible = Math.min(visibleProjects + PROJECTS_PER_PAGE, totalProjects)
        setStatusMessage(`Loaded ${newVisible} of ${totalProjects} projects`)
      } else {
        setStatusMessage("All projects loaded")
      }
      setCommand("")
    }

    const openNumberedItem = (
      number: number,
      offset: number,
      items: ReadonlyArray<PortfolioItem>
    ) => {
      const index = number - offset
      const item = items[index]
      if (item?.url) {
        openExternalLink(item.url)
        setStatusMessage(`Opening entry ${number} in new tab`)
      }
    }

    const handleNumericCommand = (cmd: string) => {
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
    }

    const handleUnknownCommand = () => {
      triggerFlash()
      setCommand("")
      setStatusMessage("")
    }

    const handleThemeResolved = (args: string) => {
      clearPanels()
      handleThemeCommand(args)
    }

    const handleEchoResolved = (args: string) => {
      clearPanels()
      showOutput(args, "Echo")
    }

    const handlePanelResolved = (resolved: CommandDefinition) => {
      if (!(resolved.panel && resolved.status)) {
        handleUnknownCommand()
        return
      }

      clearPanels()
      showPanel(resolved.panel, resolved.status)
    }

    const handleLinkResolved = (resolved: CommandDefinition) => {
      if (!resolved.url) {
        handleUnknownCommand()
        return
      }

      openExternalLink(resolved.url)
      setCommand("")
      setStatusMessage(`Opening ${resolved.label} in new tab`)
    }

    const handleClearResolved = (resolved: CommandDefinition) => {
      clearPanels()
      clearToStart()
      setStatusMessage(resolved.status ?? "Terminal cleared")
      setCommand("")
    }

    const handleResolvedCommand = (cmdKey: string, args: string) => {
      const resolved = resolveCommand(cmdKey)

      if (!resolved) {
        handleUnknownCommand()
        return
      }

      switch (resolved.kind) {
        case "theme":
          handleThemeResolved(args)
          return
        case "echo":
          handleEchoResolved(args)
          return
        case "system":
          handleSystemCommand(resolved.id)
          return
        case "panel":
          handlePanelResolved(resolved)
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
    }

    const handleThemeShortcut = (cmdKey: string) => {
      if (activePanel?.type === "themes" && isValidThemeId(cmdKey)) {
        switchTheme(cmdKey)
        return true
      }

      return false
    }

    const handleTextCommand = (rawCommand: string) => {
      const head = rawCommand.split(/\s+/)[0] ?? ""
      const cmdKey = head.toLowerCase()
      const args = rawCommand.slice(head.length).trim()

      if (handleThemeShortcut(cmdKey)) return

      handleResolvedCommand(cmdKey, args)
    }

    const handleCommand = (e: React.KeyboardEvent) => {
      if (e.key !== "Enter") return

      // Strip leading slash to support slash command syntax (e.g., "/education", "/github")
      const rawCommand = command.trim().replace(/^\//, "")

      if (rawCommand === "") {
        handleEmptyCommand()
        suppressVirtualKeyboard()
        return
      }

      if (/^\d+$/.test(rawCommand)) {
        handleNumericCommand(rawCommand)
        suppressVirtualKeyboard()
        return
      }

      handleTextCommand(rawCommand)
      suppressVirtualKeyboard()
    }

    useImperativeHandle(ref, () => ({
      focus: () => {
        releaseKeyboardSuppression()
        inputRef.current?.focus()
      },
    }))

    const outputContent = activePanel?.type === "output" ? activePanel.content : ""

    return (
      <>
        {/* Help Section */}
        {activePanel?.type === "help" && (
          <Section title="Available Commands" ariaLabel="Available Commands">
            <div className="text-sm space-y-1">
              {COMMAND_HELP_LINES.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Section>
        )}

        {/* Email Section */}
        {activePanel?.type === "email" && (
          <Section title="Contact" ariaLabel="Contact Email">
            <div className="text-sm">
              <a
                href="mailto:jleekun@gmail.com"
                className={interactiveLink("hover:text-theme-accent underline")}
              >
                jleekun@gmail.com
              </a>
            </div>
          </Section>
        )}

        {/* Education Section */}
        {activePanel?.type === "education" && (
          <DataGridSection
            title="Education"
            items={education}
            startOffset={DATA_OFFSETS.education.start}
            ariaLabel="Education"
          />
        )}

        {/* Volunteer Section */}
        {activePanel?.type === "volunteer" && (
          <DataGridSection
            title="Volunteer Experience"
            items={volunteer}
            startOffset={DATA_OFFSETS.volunteer.start}
            ariaLabel="Volunteer Experience"
          />
        )}

        {/* Theme Selection Section */}
        {activePanel?.type === "themes" && <ThemeGridSection />}

        {/* Easter Egg / Command Output */}
        {outputContent && (
          <Section ariaLabel="Command Output">
            <div className="text-sm whitespace-pre-wrap">{outputContent}</div>
          </Section>
        )}

        {/* Command Prompt */}
        <nav className="relative z-10" aria-label="Terminal commands">
          <form className="flex items-center gap-1" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="terminal-input" className="text-theme-primary">
              $:
            </label>
            <input
              ref={inputRef}
              id="terminal-input"
              type="text"
              inputMode="text"
              className={interactiveButton(
                "flex-1 bg-transparent text-theme-primary placeholder:text-theme-muted outline-none"
              )}
              placeholder='Hit "return" for more projects, "help" for all commands'
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleCommand}
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command input"
              aria-describedby="command-instructions"
            />
          </form>
          <p id="command-instructions" className="text-xs text-theme-muted mt-2">
            Commands: email, help, clear
          </p>
        </nav>

        {/* Status announcements for screen readers */}
        <div role="status" aria-live="polite" className="sr-only">
          {statusMessage}
        </div>
      </>
    )
  }
)

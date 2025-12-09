"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { DataGridSection } from "@/components/data-grid-section"
import { useVirtualKeyboardSuppression } from "@/hooks/use-virtual-keyboard-suppression"
import { education, projects, volunteer } from "@/lib/data"
import {
  COMMAND_ALIASES,
  DATA_OFFSETS,
  openExternalLink,
  PROJECTS_PER_PAGE,
  VALID_COMMANDS,
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
    const [showEducation, setShowEducation] = useState(false)
    const [showVolunteer, setShowVolunteer] = useState(false)
    const [showEmail, setShowEmail] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const [displayContent, setDisplayContent] = useState("")
    const [statusMessage, setStatusMessage] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const { suppressVirtualKeyboard, releaseKeyboardSuppression } =
      useVirtualKeyboardSuppression(inputRef)

    // Auto-focus input on mount (after boot sequence completes)
    useEffect(() => {
      inputRef.current?.focus()
    }, [])

    const hideAllSections = () => {
      setShowEducation(false)
      setShowVolunteer(false)
      setShowEmail(false)
      setShowHelp(false)
      setDisplayContent("")
    }

    const handleRandomCommand = () => {
      const projectsWithUrls = projects.filter((p) => p.url && p.url.trim() !== "")
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

    const handleSectionCommand = (cmdLower: string) => {
      if (cmdLower === "education" || cmdLower === "ed") {
        hideAllSections()
        setShowEducation(true)
        setCommand("")
        setStatusMessage(`${COMMAND_ALIASES[cmdLower]} section displayed`)
        return true
      }
      if (cmdLower === "volunteer" || cmdLower === "vol") {
        hideAllSections()
        setShowVolunteer(true)
        setCommand("")
        setStatusMessage(`${COMMAND_ALIASES[cmdLower]} experience section displayed`)
        return true
      }
      return false
    }

    const handleTerminalCommand = (cmdLower: string) => {
      if (cmdLower === "clear") {
        hideAllSections()
        clearToStart()
        setStatusMessage("Terminal cleared")
        return true
      }
      if (cmdLower === "email") {
        hideAllSections()
        setShowEmail(true)
        setCommand("")
        setStatusMessage("Contact email displayed")
        return true
      }
      if (cmdLower === "help") {
        hideAllSections()
        setShowHelp(true)
        setCommand("")
        setStatusMessage("Available commands displayed")
        return true
      }
      if (cmdLower === "random") {
        handleRandomCommand()
        return true
      }
      return false
    }

    const handleSocialCommand = () => {
      hideAllSections()
      setShowHelp(true)
      setCommand("")
      setStatusMessage("Social and professional links displayed")
    }

    // Easter egg command handlers
    const handleEasterEggCommands = (cmd: string): boolean => {
      const cmdLower = cmd.toLowerCase()

      if (cmdLower === "whoami") {
        hideAllSections()
        setDisplayContent(
          "You're exploring Eight Lee's portfolio terminal.\nType 'help' to see what I can do!"
        )
        setCommand("")
        setStatusMessage("User info displayed")
        return true
      }

      if (cmdLower === "uname") {
        hideAllSections()
        // Calculate age using same logic as boot sequence
        const birthYear = 1982
        const birthMonth = 10 // November (0-indexed)
        const birthDay = 9
        const now = new Date()
        const year = now.getFullYear()
        const birthdayThisYear = new Date(year, birthMonth, birthDay)
        const hasHadBirthday = now >= birthdayThisYear
        const age = year - birthYear - (hasHadBirthday ? 0 : 1)

        setDisplayContent(
          `8leeOS v${age} (Terminal Edition)\nBuilt with Next.js 16.0.3 + React 19.2.0`
        )
        setCommand("")
        setStatusMessage("System info displayed")
        return true
      }

      if (cmdLower === "date") {
        hideAllSections()
        setDisplayContent(new Date().toString())
        setCommand("")
        setStatusMessage("Current date/time displayed")
        return true
      }

      if (cmdLower.startsWith("echo ")) {
        hideAllSections()
        const text = cmd.slice(5) // Remove 'echo ' prefix (case-insensitive via original cmd)
        setDisplayContent(text || "")
        setCommand("")
        setStatusMessage("Echo")
        return true
      }

      if (cmdLower === "stats") {
        hideAllSections()
        const totalCommands = VALID_COMMANDS.length
        setDisplayContent(
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
Focus Areas:           AI/ML, Full-Stack Web, Systems`
        )
        setCommand("")
        setStatusMessage("Portfolio statistics displayed")
        return true
      }

      return false
    }

    // Map command aliases to their canonical forms
    const normalizeCommand = (cmd: string): string => {
      const cmdLower = cmd.toLowerCase()
      if (
        cmdLower === "resume" ||
        cmdLower === "cv" ||
        cmdLower === "about" ||
        cmdLower === "bio"
      ) {
        return "education"
      }
      if (cmdLower === "contact" || cmdLower === "reach" || cmdLower === "hello") {
        return "email"
      }
      return cmdLower
    }

    const handleExternalLinkCommand = (cmdLower: string) => {
      const links = {
        github: "https://github.com/8bittts/8leeai",
        wellfound: "https://wellfound.com/u/eightlee",
        linkedin: "https://www.linkedin.com/in/8lee/",
        li: "https://www.linkedin.com/in/8lee/",
        x: "https://twitter.com/8bit",
        twitter: "https://twitter.com/8bit",
        // Experiments portal access
        zendesk: "https://8lee.ai/experiments/zendesk",
        zen: "https://8lee.ai/experiments/zendesk",
      } as const

      type LinkKey = keyof typeof links
      const isValidLinkKey = (key: string): key is LinkKey => key in links

      if (isValidLinkKey(cmdLower)) {
        openExternalLink(links[cmdLower])
        setCommand("")
        setStatusMessage(`Opening ${COMMAND_ALIASES[cmdLower] || cmdLower} in new tab`)
        return true
      }
      return false
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
      items: ReadonlyArray<{ readonly url: string; readonly [key: string]: unknown }>
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

    const handleUnrecognizedCommand = (cmd: string) => {
      if (cmd === "") {
        handleEmptyCommand()
      } else if (/^\d+$/.test(cmd)) {
        handleNumericCommand(cmd)
      } else {
        triggerFlash()
        setCommand("")
        setStatusMessage("")
      }
    }

    const handleCommand = (e: React.KeyboardEvent) => {
      if (e.key !== "Enter") return

      // Strip leading slash to support slash command syntax (e.g., "/education", "/github")
      const cmd = command.trim().replace(/^\//, "")
      const cmdLower = normalizeCommand(cmd)

      // Handle easter egg commands first (uses original cmd for echo to preserve case)
      if (handleEasterEggCommands(cmd)) {
        suppressVirtualKeyboard()
        return
      }

      // Handle social command separately (shows help with social links)
      if (cmdLower === "social") {
        handleSocialCommand()
        suppressVirtualKeyboard()
        return
      }

      const handled =
        handleSectionCommand(cmdLower) ||
        handleTerminalCommand(cmdLower) ||
        handleExternalLinkCommand(cmdLower)

      if (!handled) {
        handleUnrecognizedCommand(cmd)
      }

      suppressVirtualKeyboard()
    }

    useImperativeHandle(ref, () => ({
      focus: () => {
        releaseKeyboardSuppression()
        inputRef.current?.focus()
      },
    }))

    return (
      <>
        {/* Help Section */}
        {showHelp && (
          <section className="mb-8" aria-label="Available Commands">
            <h2 className="text-xl font-bold mb-4">Available Commands</h2>
            <div className="text-sm space-y-1">
              <p>• enter · Load more projects (15 per page)</p>
              <p>• email (contact, hello, reach) · Email address</p>
              <p>• help · Show this help screen</p>
              <p>• education (ed, resume, cv, about, bio) · Education background</p>
              <p>• volunteer (vol) · Volunteer experience</p>
              <p>• github · Link to this project</p>
              <p>• wellfound · Wellfound profile</p>
              <p>• linkedin (li) · LinkedIn profile</p>
              <p>• twitter/x · X/Twitter profile</p>
              <p>• social · Show all social links</p>
              <p>• random · Open a random project</p>
              <p>• clear · Reset terminal</p>
              <p>• whoami · User info</p>
              <p>• uname · System info</p>
              <p>• date · Current date/time</p>
              <p>• echo [text] · Echo text back</p>
              <p>• stats · Portfolio statistics</p>
            </div>
          </section>
        )}

        {/* Email Section */}
        {showEmail && (
          <section className="mb-8" aria-label="Contact Email">
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <div className="text-sm">
              <a
                href="mailto:jleekun@gmail.com"
                className="hover:text-green-400 transition-colors underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded-sm"
              >
                jleekun@gmail.com
              </a>
            </div>
          </section>
        )}

        {/* Education Section */}
        {showEducation && (
          <DataGridSection
            title="Education"
            items={education}
            startOffset={DATA_OFFSETS.education.start}
            ariaLabel="Education"
          />
        )}

        {/* Volunteer Section */}
        {showVolunteer && (
          <DataGridSection
            title="Volunteer Experience"
            items={volunteer}
            startOffset={DATA_OFFSETS.volunteer.start}
            ariaLabel="Volunteer Experience"
          />
        )}

        {/* Easter Egg / Command Output */}
        {displayContent && (
          <section className="mb-8" aria-label="Command Output">
            <div className="text-sm whitespace-pre-wrap">{displayContent}</div>
          </section>
        )}

        {/* Command Prompt */}
        <nav className="relative z-10" aria-label="Terminal commands">
          <form className="flex items-center gap-1" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="terminal-input" className="text-green-500">
              $:
            </label>
            <input
              ref={inputRef}
              id="terminal-input"
              type="text"
              inputMode="text"
              className="flex-1 bg-transparent text-green-500 placeholder:text-green-700 outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded-sm"
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
          <p id="command-instructions" className="text-xs text-green-700 mt-2">
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

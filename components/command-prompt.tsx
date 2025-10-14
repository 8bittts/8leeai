"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { DataGridSection } from "@/components/data-grid-section"
import { useVirtualKeyboardSuppression } from "@/hooks/use-virtual-keyboard-suppression"
import { education, volunteer } from "@/lib/data"
import {
  COMMAND_DISPLAY_LIST,
  DATA_OFFSETS,
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

export const CommandPrompt = forwardRef<CommandPromptRef, CommandPromptProps>(
  function CommandPrompt(
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
    const [statusMessage, setStatusMessage] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const { suppressVirtualKeyboard, releaseKeyboardSuppression } =
      useVirtualKeyboardSuppression(inputRef)

    // Extract command handlers to reduce complexity
    const handleSectionCommand = (cmdLower: string) => {
      if (cmdLower === "education" || cmdLower === "ed") {
        setShowEducation(true)
        setShowVolunteer(false)
        setCommand("")
        setStatusMessage("Education section displayed")
        return true
      }
      if (cmdLower === "volunteer" || cmdLower === "vol") {
        setShowVolunteer(true)
        setShowEducation(false)
        setCommand("")
        setStatusMessage("Volunteer experience section displayed")
        return true
      }
      return false
    }

    const handleTerminalCommand = (cmdLower: string) => {
      if (cmdLower === "clear") {
        setShowEducation(false)
        setShowVolunteer(false)
        setShowEmail(false)
        clearToStart()
        setStatusMessage("Terminal cleared")
        return true
      }
      if (cmdLower === "email") {
        setShowEmail(true)
        setShowEducation(false)
        setShowVolunteer(false)
        setCommand("")
        setStatusMessage("Contact email displayed")
        return true
      }
      return false
    }

    const handleExternalLinkCommand = (cmdLower: string) => {
      const links = {
        github: "https://github.com/8bittts/8leeai",
        wellfound: "https://wellfound.com/u/eightlee",
        deathnote: "https://deathnote.ai",
      } as const

      type LinkKey = keyof typeof links
      const isValidLinkKey = (key: string): key is LinkKey => key in links

      if (isValidLinkKey(cmdLower)) {
        openExternalLink(links[cmdLower])
        setCommand("")
        setStatusMessage(`Opening ${cmdLower} in new tab`)
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

    const handleCommand = (e: React.KeyboardEvent) => {
      if (e.key !== "Enter") return

      // Strip leading slash to support slash command syntax (e.g., "/education", "/github")
      const cmd = command.trim().replace(/^\//, "")
      const cmdLower = cmd.toLowerCase()

      const handled =
        handleSectionCommand(cmdLower) ||
        handleTerminalCommand(cmdLower) ||
        handleExternalLinkCommand(cmdLower)

      if (!handled) {
        if (cmd === "") {
          handleEmptyCommand()
        } else if (/^\d+$/.test(cmd)) {
          handleNumericCommand(cmd)
        } else {
          // Invalid command: Flash screen and clear
          triggerFlash()
          setCommand("")
          setStatusMessage("")
        }
      }

      suppressVirtualKeyboard()
    }

    useImperativeHandle(ref, () => ({
      focus: () => {
        releaseKeyboardSuppression()
        inputRef.current?.focus()
      },
    }))

    useEffect(() => {
      inputRef.current?.focus()
      return () => {
        releaseKeyboardSuppression()
      }
    }, [releaseKeyboardSuppression])

    return (
      <>
        {/* Email Section */}
        {showEmail && (
          <section className="mb-8" aria-label="Contact Email">
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <div className="text-sm">
              <a
                href="mailto:jleekun@gmail.com"
                className="hover:text-green-400 transition-colors underline"
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
              className="flex-1 bg-transparent text-green-500 placeholder:text-gray-500 outline-none"
              placeholder="Load more (enter), open project (e.g. '01'), or commands below"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleCommand}
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command input"
              aria-describedby="command-instructions"
            />
          </form>
          <p id="command-instructions" className="text-xs text-gray-500 mt-2">
            Commands: {COMMAND_DISPLAY_LIST.join(", ")}
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

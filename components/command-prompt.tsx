"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { education, volunteer } from "@/lib/data"
import { DATA_OFFSETS, formatIndex, openExternalLink } from "@/lib/utils"

interface CommandPromptProps {
  showMoreProjects: () => void
  openProject: (projectNumber: number) => void
  resetProjects: () => void
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
      resetProjects: _resetProjects,
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

    const handleCommand = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        const cmd = command.trim()
        const cmdLower = cmd.toLowerCase()

        if (cmdLower === "education" || cmdLower === "ed") {
          setShowEducation(true)
          setShowVolunteer(false)
          setCommand("")
          setStatusMessage("Education section displayed")
        } else if (cmdLower === "volunteer" || cmdLower === "vol") {
          setShowVolunteer(true)
          setShowEducation(false)
          setCommand("")
          setStatusMessage("Volunteer experience section displayed")
        } else if (cmdLower === "clear") {
          setShowEducation(false)
          setShowVolunteer(false)
          setShowEmail(false)
          clearToStart()
          setStatusMessage("Terminal cleared")
        } else if (cmdLower === "email") {
          setShowEmail(true)
          setShowEducation(false)
          setShowVolunteer(false)
          setCommand("")
          setStatusMessage("Contact email displayed")
        } else if (cmdLower === "github") {
          openExternalLink("https://github.com/8bittts")
          setCommand("")
          setStatusMessage("Opening GitHub profile in new tab")
        } else if (cmdLower === "wellfound") {
          openExternalLink("https://wellfound.com/u/eightlee")
          setCommand("")
          setStatusMessage("Opening Wellfound profile in new tab")
        } else if (cmdLower === "download") {
          openExternalLink("https://github.com/8bittts/8leeai")
          setCommand("")
          setStatusMessage("Opening GitHub repository in new tab")
        } else if (cmd === "") {
          if (visibleProjects < totalProjects) {
            showMoreProjects()
            const newVisible = Math.min(visibleProjects + 10, totalProjects)
            setStatusMessage(`Loaded ${newVisible} of ${totalProjects} projects`)
          } else {
            setStatusMessage("All projects loaded")
          }
          setCommand("")
        } else if (/^\d+$/.test(cmd)) {
          const number = parseInt(cmd, 10)
          if (number >= DATA_OFFSETS.projects.start && number <= DATA_OFFSETS.projects.end) {
            openProject(number)
            setStatusMessage(`Opening project ${number} in new tab`)
          } else if (
            number >= DATA_OFFSETS.education.start &&
            number <= DATA_OFFSETS.education.end
          ) {
            const eduIndex = number - DATA_OFFSETS.education.start
            if (education[eduIndex]?.url) {
              openExternalLink(education[eduIndex].url)
              setStatusMessage(`Opening education entry ${number} in new tab`)
            }
          } else if (
            number >= DATA_OFFSETS.volunteer.start &&
            number <= DATA_OFFSETS.volunteer.end
          ) {
            const volIndex = number - DATA_OFFSETS.volunteer.start
            if (volunteer[volIndex]?.url) {
              openExternalLink(volunteer[volIndex].url)
              setStatusMessage(`Opening volunteer entry ${number} in new tab`)
            }
          } else {
            triggerFlash()
            setStatusMessage("")
          }
          setCommand("")
        } else {
          triggerFlash()
          setCommand("")
          setStatusMessage("")
        }

        // Keep focus on input after handling command
        setTimeout(() => {
          inputRef.current?.focus()
        }, 0)
      }
    }

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus()
      },
    }))

    useEffect(() => {
      inputRef.current?.focus()
    }, [])

    return (
      <>
        {/* Email Section */}
        {showEmail && (
          <section className="mb-8" aria-label="Contact Email">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Contact</h2>
            <div className="text-sm sm:text-base">
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
          <section className="mb-8" aria-label="Education">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Education</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-xs sm:text-sm">
              {education.map((item, index) => (
                <div key={item.id} className="flex">
                  <span className="mr-3 text-gray-500">
                    {formatIndex(index + DATA_OFFSETS.education.start - 1)}.
                  </span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault()
                        openExternalLink(item.url)
                      }}
                      className="hover:text-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${item.name} (opens in new tab)`}
                    >
                      {item.linkWord
                        ? item.name.split(new RegExp(`(${item.linkWord})`, "i")).map((part, i) =>
                            part.toLowerCase() === item.linkWord.toLowerCase() ? (
                              <span key={i} className="underline">
                                {part}
                              </span>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )
                        : item.name}
                    </a>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Volunteer Section */}
        {showVolunteer && (
          <section className="mb-8" aria-label="Volunteer Experience">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Volunteer Experience</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-xs sm:text-sm">
              {volunteer.map((item, index) => (
                <div key={item.id} className="flex">
                  <span className="mr-3 text-gray-500">
                    {formatIndex(index + DATA_OFFSETS.volunteer.start - 1)}.
                  </span>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault()
                        openExternalLink(item.url)
                      }}
                      className="hover:text-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${item.name} (opens in new tab)`}
                    >
                      {item.linkWord
                        ? item.name.split(new RegExp(`(${item.linkWord})`, "i")).map((part, i) =>
                            part.toLowerCase() === item.linkWord.toLowerCase() ? (
                              <span key={i} className="underline">
                                {part}
                              </span>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )
                        : item.name}
                    </a>
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Command Prompt */}
        <nav className="relative z-10" aria-label="Terminal commands">
          <form className="flex items-center gap-1" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="terminal-input" className="text-green-500">
              $
            </label>
            <input
              ref={inputRef}
              id="terminal-input"
              type="text"
              className="flex-1 bg-transparent text-green-500 placeholder:text-gray-500 outline-none"
              placeholder="Enter to load more, # to open project, or command name"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleCommand}
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command input"
              aria-describedby="command-instructions"
            />
          </form>
          <p id="command-instructions" className="text-xs sm:text-sm text-gray-500 mt-2">
            Available commands: {visibleProjects < totalProjects && "Enter (load more projects), "}
            1-{visibleProjects} (open project by number), email, github, wellfound, education,
            volunteer, download, clear
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

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
    const inputRef = useRef<HTMLInputElement>(null)

    const handleCommand = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        const cmd = command.trim()
        const cmdLower = cmd.toLowerCase()

        if (cmdLower === "education" || cmdLower === "ed") {
          setShowEducation(true)
          setShowVolunteer(false)
          setCommand("")
        } else if (cmdLower === "volunteer" || cmdLower === "vol") {
          setShowVolunteer(true)
          setShowEducation(false)
          setCommand("")
        } else if (cmdLower === "clear") {
          setShowEducation(false)
          setShowVolunteer(false)
          setShowEmail(false)
          clearToStart()
        } else if (cmdLower === "email") {
          setShowEmail(true)
          setShowEducation(false)
          setShowVolunteer(false)
          setCommand("")
        } else if (cmdLower === "github") {
          openExternalLink("https://github.com/8bittts")
          setCommand("")
        } else if (cmdLower === "wellfound") {
          openExternalLink("https://wellfound.com/u/eightlee")
          setCommand("")
        } else if (cmdLower === "download") {
          openExternalLink("https://github.com/8bittts/8leeai")
          setCommand("")
        } else if (cmd === "") {
          if (visibleProjects < totalProjects) {
            showMoreProjects()
          }
          setCommand("")
        } else if (/^\d+$/.test(cmd)) {
          const number = parseInt(cmd, 10)
          if (number >= DATA_OFFSETS.projects.start && number <= DATA_OFFSETS.projects.end) {
            openProject(number)
          } else if (
            number >= DATA_OFFSETS.education.start &&
            number <= DATA_OFFSETS.education.end
          ) {
            const eduIndex = number - DATA_OFFSETS.education.start
            if (education[eduIndex]?.url) {
              openExternalLink(education[eduIndex].url)
            }
          } else if (
            number >= DATA_OFFSETS.volunteer.start &&
            number <= DATA_OFFSETS.volunteer.end
          ) {
            const volIndex = number - DATA_OFFSETS.volunteer.start
            if (volunteer[volIndex]?.url) {
              openExternalLink(volunteer[volIndex].url)
            }
          } else {
            // Invalid number - trigger global flash
            triggerFlash()
          }
          setCommand("")
        } else {
          // Invalid command - trigger global flash for any unrecognized text
          triggerFlash()
          setCommand("")
        }
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
                <div
                  key={item.id}
                  className={`flex ${item.url ? "hover:text-green-400 transition-colors cursor-pointer" : ""}`}
                  onClick={() => openExternalLink(item.url)}
                  role={item.url ? "link" : "text"}
                  tabIndex={item.url ? 0 : -1}
                  onKeyDown={(e) => {
                    if (item.url && (e.key === "Enter" || e.key === " ")) {
                      openExternalLink(item.url)
                    }
                  }}
                >
                  <span className="mr-3 text-gray-500">
                    {formatIndex(index + DATA_OFFSETS.education.start - 1)}.
                  </span>
                  <span>
                    {item.url && item.linkWord
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
                  </span>
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
                <div
                  key={item.id}
                  className={`flex ${item.url ? "hover:text-green-400 transition-colors cursor-pointer" : ""}`}
                  onClick={() => openExternalLink(item.url)}
                  role={item.url ? "link" : "text"}
                  tabIndex={item.url ? 0 : -1}
                  onKeyDown={(e) => {
                    if (item.url && (e.key === "Enter" || e.key === " ")) {
                      openExternalLink(item.url)
                    }
                  }}
                >
                  <span className="mr-3 text-gray-500">
                    {formatIndex(index + DATA_OFFSETS.volunteer.start - 1)}.
                  </span>
                  <span>
                    {item.url && item.linkWord
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
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Command Prompt */}
        <footer className="relative z-10" role="contentinfo">
          <form className="flex items-center gap-1" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="terminal-input" className="text-green-500">
              $
            </label>
            <span className="inline-block w-2 h-4 bg-green-500 animate-pulse" aria-hidden="true" />
            <input
              ref={inputRef}
              id="terminal-input"
              type="text"
              className="flex-1 bg-transparent outline-none text-green-500 placeholder:text-gray-600"
              placeholder="Hit Enter to see more, type # to see project details, or keywords below..."
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleCommand}
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command input"
            />
          </form>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Commands: {visibleProjects < totalProjects && "Enter (more) | "}# (open) | email |
            github | wellfound | education | volunteer | download | clear
          </p>
        </footer>
      </>
    )
  }
)

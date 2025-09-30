"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
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
    const keyboardReleaseRef = useRef<(() => void) | null>(null)

    const releaseKeyboardSuppression = useCallback(() => {
      keyboardReleaseRef.current?.()
      keyboardReleaseRef.current = null
    }, [])

    const suppressVirtualKeyboard = () => {
      const input = inputRef.current
      if (!input) return

      const prefersTouch = globalThis?.matchMedia?.("(pointer: coarse)")?.matches ?? false
      if (!prefersTouch) {
        requestAnimationFrame(() => {
          try {
            input.focus({ preventScroll: true })
          } catch {
            input.focus()
          }
        })
        return
      }

      releaseKeyboardSuppression()

      const virtualKeyboard = (
        navigator as unknown as {
          readonly virtualKeyboard?: { hide?: () => Promise<void> }
        }
      ).virtualKeyboard

      const fallbackSuppress = () => {
        const previousInputMode = input.getAttribute("inputmode")
        const wasReadOnly = input.hasAttribute("readonly")

        input.setAttribute("inputmode", "none")
        input.setAttribute("readonly", "true")

        const cleanup = () => {
          if (!wasReadOnly) {
            input.removeAttribute("readonly")
          }
          if (previousInputMode) {
            input.setAttribute("inputmode", previousInputMode)
          } else {
            input.removeAttribute("inputmode")
          }
          keyboardReleaseRef.current = null
        }

        const allowInput = () => {
          cleanup()
          requestAnimationFrame(() => {
            try {
              input.focus({ preventScroll: true })
            } catch {
              input.focus()
            }
            input.setSelectionRange?.(input.value.length, input.value.length)
          })
        }

        input.addEventListener("pointerdown", allowInput, { once: true })
        input.addEventListener("keydown", allowInput, { once: true })

        keyboardReleaseRef.current = () => {
          input.removeEventListener("pointerdown", allowInput)
          input.removeEventListener("keydown", allowInput)
          cleanup()
        }

        requestAnimationFrame(() => {
          input.blur()
          requestAnimationFrame(() => {
            try {
              input.focus({ preventScroll: true })
            } catch {
              input.focus()
            }
            input.setSelectionRange?.(input.value.length, input.value.length)
          })
        })
      }

      if (virtualKeyboard?.hide) {
        virtualKeyboard.hide().catch(() => {
          fallbackSuppress()
        })
        requestAnimationFrame(() => {
          input.setSelectionRange?.(input.value.length, input.value.length)
        })
        return
      }

      fallbackSuppress()
    }

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
      const links: Record<string, string> = {
        github: "https://github.com/8bittts/8leeai",
        wellfound: "https://wellfound.com/u/eightlee",
        deathnote: "https://deathnote.ai",
      }
      const url = links[cmdLower]
      if (url) {
        openExternalLink(url)
        setCommand("")
        setStatusMessage(`Opening ${cmdLower} in new tab`)
        return true
      }
      return false
    }

    const handleEmptyCommand = () => {
      if (visibleProjects < totalProjects) {
        showMoreProjects()
        const newVisible = Math.min(visibleProjects + 10, totalProjects)
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
      if (items[index]?.url) {
        openExternalLink(items[index].url)
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

      const cmd = command.trim()
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
          <section className="mb-8" aria-label="Education">
            <h2 className="text-xl font-bold mb-4">Education</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
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
                      {item.linkWord && item.linkWord.trim() !== ""
                        ? item.name.split(new RegExp(`(${item.linkWord})`, "i")).map((part, i) =>
                            part.toLowerCase() === item.linkWord?.toLowerCase() ? (
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
            <h2 className="text-xl font-bold mb-4">Volunteer Experience</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
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
                      {item.linkWord && item.linkWord.trim() !== ""
                        ? item.name.split(new RegExp(`(${item.linkWord})`, "i")).map((part, i) =>
                            part.toLowerCase() === item.linkWord?.toLowerCase() ? (
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
              inputMode="text"
              className="flex-1 bg-transparent text-green-500 placeholder:text-gray-500 outline-none"
              placeholder="Load more (enter), open project (##), or commands below"
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
            Type: email, education, volunteer, github, wellfound, deathnote, clear
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

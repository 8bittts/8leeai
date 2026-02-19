"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { DataGridSection } from "@/components/data-grid-section"
import { Section } from "@/components/section"
import { ThemeGridSection } from "@/components/theme-grid-section"
import { useActivePanel } from "@/hooks/use-active-panel"
import { useCommandRouter } from "@/hooks/use-command-router"
import { useVirtualKeyboardSuppression } from "@/hooks/use-virtual-keyboard-suppression"
import { COMMAND_HELP_LINES } from "@/lib/commands"
import { DATA_OFFSETS, education, volunteer } from "@/lib/data"
import { interactive } from "@/lib/utils"

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
    const inputRef = useRef<HTMLInputElement>(null)
    const { suppressVirtualKeyboard, releaseKeyboardSuppression } =
      useVirtualKeyboardSuppression(inputRef)

    const panelState = useActivePanel()
    const { activePanel, statusMessage } = panelState

    const { handleCommand } = useCommandRouter({
      panelState,
      showMoreProjects,
      openProject,
      clearToStart,
      triggerFlash,
      visibleProjects,
      totalProjects,
      setCommand,
      suppressVirtualKeyboard,
    })

    // Auto-focus input on mount (after boot sequence completes)
    useEffect(() => {
      inputRef.current?.focus()
    }, [])

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key !== "Enter") return
      handleCommand(command)
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
                className={interactive("hover:text-theme-accent underline")}
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
              className={interactive(
                "flex-1 bg-transparent text-theme-primary placeholder:text-theme-muted outline-none"
              )}
              placeholder="'Return' for more projects, 'help' for commands. {•̃_•̃}"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal command input"
              aria-describedby="command-instructions"
            />
          </form>
          <p id="command-instructions" className="text-xs text-theme-muted mt-2">
            Commands: email | help | clear
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

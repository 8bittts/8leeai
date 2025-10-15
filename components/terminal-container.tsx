"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BootSequence } from "@/components/boot-sequence"
import { CommandPrompt, type CommandPromptRef } from "@/components/command-prompt"
import { CVContent } from "@/components/cv-content"
import { MatrixBackground } from "@/components/matrix-background"
import { projects } from "@/lib/data"
import { openExternalLink, PROJECTS_PER_PAGE } from "@/lib/utils"

export function TerminalContainer() {
  const [bootComplete, setBootComplete] = useState(false)
  const [visibleProjects, setVisibleProjects] = useState(PROJECTS_PER_PAGE)
  const [command, setCommand] = useState("")
  const [isFlashing, setIsFlashing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const commandPromptRef = useRef<CommandPromptRef>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioPlayedRef = useRef(false)

  useEffect(() => {
    audioRef.current = new Audio("/cj.m4a")
    audioRef.current.volume = 0.02
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleBootComplete = () => {
    setBootComplete(true)
    // Play audio on boot-to-content transition
    if (!audioPlayedRef.current && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Intentionally empty - audio is optional enhancement
      })
      audioPlayedRef.current = true
    }
  }

  const showMoreProjects = useCallback(() => {
    setVisibleProjects((prev) => Math.min(prev + PROJECTS_PER_PAGE, projects.length))
  }, [])

  const clearToStart = useCallback(() => {
    setBootComplete(false)
    setVisibleProjects(PROJECTS_PER_PAGE)
    setCommand("")
    setTimeout(() => setBootComplete(true), 100)
  }, [])

  const triggerFlash = useCallback(() => {
    setIsFlashing(true)
    setErrorMessage("Invalid command")
    setTimeout(() => {
      setIsFlashing(false)
      setErrorMessage("")
    }, 150)
  }, [])

  const openProject = useCallback((projectNumber: number) => {
    const project = projects[projectNumber - 1]
    if (project?.url) {
      openExternalLink(project.url)
    }
  }, [])

  return (
    <div
      className={`h-full w-full flex flex-col relative overflow-hidden ${isFlashing ? "animate-pulse bg-red-900/20" : ""} transition-colors duration-150`}
    >
      {/* Background branding */}
      <header>
        {/* Mobile: Matrix-style background effect */}
        <MatrixBackground />

        {/* Desktop: Small top-right logo */}
        <div
          className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 text-green-500 text-xs font-mono hidden md:block z-20"
          role="img"
          aria-label="Eight Lee logo"
        >
          <pre aria-hidden="true">
            {` ░▒▓██████▓▒░
░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░
 ░▒▓██████▓▒░
░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░
 ░▒▓██████▓▒░  `}
          </pre>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {!bootComplete && <BootSequence onComplete={handleBootComplete} />}
        {bootComplete && <CVContent visibleProjects={visibleProjects} setCommand={setCommand} />}
      </main>

      {bootComplete && (
        <div className="sticky bottom-0 bg-black p-4 sm:p-6 lg:p-8 pt-0">
          <CommandPrompt
            ref={commandPromptRef}
            showMoreProjects={showMoreProjects}
            openProject={openProject}
            clearToStart={clearToStart}
            triggerFlash={triggerFlash}
            visibleProjects={visibleProjects}
            totalProjects={projects.length}
            command={command}
            setCommand={setCommand}
          />
        </div>
      )}

      {/* Error announcements for screen readers */}
      <div role="alert" aria-live="assertive" className="sr-only">
        {errorMessage}
      </div>
    </div>
  )
}

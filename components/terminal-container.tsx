"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { BootSequence } from "@/components/boot-sequence"
import { CommandPrompt, type CommandPromptRef } from "@/components/command-prompt"
import { CVContent } from "@/components/cv-content"
import { projects } from "@/lib/data"
import { openExternalLink } from "@/lib/utils"

const PROJECTS_PER_PAGE = 10

export function TerminalContainer() {
  const [bootComplete, setBootComplete] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [visibleProjects, setVisibleProjects] = useState(PROJECTS_PER_PAGE)
  const [command, setCommand] = useState("")
  const [isFlashing, setIsFlashing] = useState(false)
  const commandPromptRef = useRef<CommandPromptRef>(null)

  const handleBootComplete = () => {
    setBootComplete(true)
  }

  const handleUserInteraction = useCallback(() => {
    if (bootComplete && !showContent) {
      setShowContent(true)

      const audio = new Audio("/cj.m4a")
      audio.volume = 0.05
      audio.play().catch(() => {})
    }
  }, [bootComplete, showContent])

  useEffect(() => {
    if (bootComplete) {
      const handleClick = () => handleUserInteraction()
      const handleKeyDown = () => handleUserInteraction()

      document.addEventListener("click", handleClick)
      document.addEventListener("keydown", handleKeyDown)

      return () => {
        document.removeEventListener("click", handleClick)
        document.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [bootComplete, handleUserInteraction])

  const showMoreProjects = useCallback(() => {
    setVisibleProjects((prev) => Math.min(prev + PROJECTS_PER_PAGE, projects.length))
  }, [])

  const resetProjects = useCallback(() => {
    setVisibleProjects(PROJECTS_PER_PAGE)
  }, [])

  const clearToStart = useCallback(() => {
    setShowContent(false)
    setVisibleProjects(PROJECTS_PER_PAGE)
    setCommand("")
  }, [])

  const triggerFlash = useCallback(() => {
    setIsFlashing(true)
    setTimeout(() => setIsFlashing(false), 150)
  }, [])

  const openProject = useCallback((projectNumber: number) => {
    const project = projects[projectNumber - 1]
    if (project?.url) {
      openExternalLink(project.url)
    }
  }, [])

  const handleContainerClick = useCallback(() => {
    if (showContent) {
      commandPromptRef.current?.focus()
    }
  }, [showContent])

  return (
    <div
      className={`h-full w-full flex flex-col relative overflow-hidden ${isFlashing ? "animate-pulse bg-red-900/20" : ""} transition-colors duration-150`}
      onClick={handleContainerClick}
    >
      {/* ASCII Brand Mark */}
      <div
        className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 text-green-500 text-xs font-mono hidden md:block z-20"
        aria-label="8 logo"
      >
        <pre>
          {` ░▒▓██████▓▒░
░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░
 ░▒▓██████▓▒░
░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░
 ░▒▓██████▓▒░  `}
        </pre>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {!showContent && <BootSequence onComplete={handleBootComplete} />}
        {showContent && (
          <CVContent
            visibleProjects={visibleProjects}
            showMoreProjects={showMoreProjects}
            setCommand={setCommand}
          />
        )}
      </div>

      {showContent && (
        <div className="sticky bottom-0 bg-black p-4 sm:p-6 lg:p-8 pt-0">
          <CommandPrompt
            ref={commandPromptRef}
            showMoreProjects={showMoreProjects}
            openProject={openProject}
            resetProjects={resetProjects}
            clearToStart={clearToStart}
            triggerFlash={triggerFlash}
            visibleProjects={visibleProjects}
            totalProjects={projects.length}
            command={command}
            setCommand={setCommand}
          />
        </div>
      )}
    </div>
  )
}

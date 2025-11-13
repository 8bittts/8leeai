"use client"

import { useEffect, useRef, useState } from "react"
import { BootSequence } from "@/components/boot-sequence"
import { CVContent } from "@/components/cv-content"
import { MatrixBackground } from "@/components/matrix-background"
import { CommandPrompt, type CommandPromptRef } from "./components/command-prompt"

export default function ZendeskDemo() {
  const [bootComplete, setBootComplete] = useState(false)
  const [visibleProjects, setVisibleProjects] = useState(15)
  const [command, setCommand] = useState("")
  const commandPromptRef = useRef<CommandPromptRef>(null)

  // Load Zendesk Web Widget
  useEffect(() => {
    const script = document.createElement("script")
    script.id = "ze-snippet"
    script.src =
      "https://static.zdassets.com/ekr/snippet.js?key=af64a072-5f19-47f4-9f3e-b6108435e64b"
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existingScript = document.getElementById("ze-snippet")
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  const clearToStart = () => {
    setBootComplete(false)
    setVisibleProjects(15)
    setCommand("")
  }

  const triggerFlash = () => {
    const terminal = document.querySelector("[data-terminal]")
    if (terminal) {
      terminal.classList.add("animate-flash")
      setTimeout(() => {
        terminal.classList.remove("animate-flash")
      }, 200)
    }
  }

  const openProject = (projectNumber: number) => {
    const { projects } = require("@/lib/data")
    const project = projects[projectNumber - 1]
    if (project?.url) {
      const newWindow = window.open(project.url, "_blank")
      if (newWindow) {
        newWindow.opener = null
      }
    }
  }

  return (
    <main
      className="min-h-screen w-full bg-black text-green-500 font-mono relative flex flex-col lg:flex-row overflow-x-hidden"
      data-terminal={true}
    >
      <MatrixBackground />

      <div className="relative z-10 flex-1 flex flex-col">
        {bootComplete ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 lg:px-6 pt-4">
              <CVContent visibleProjects={visibleProjects} />
            </div>

            <div className="px-4 lg:px-6 pb-4">
              <CommandPrompt
                ref={commandPromptRef}
                showMoreProjects={() => setVisibleProjects((prev) => prev + 15)}
                openProject={openProject}
                clearToStart={clearToStart}
                triggerFlash={triggerFlash}
                visibleProjects={visibleProjects}
                totalProjects={64}
                command={command}
                setCommand={setCommand}
              />
            </div>
          </>
        ) : (
          <BootSequence onComplete={() => setBootComplete(true)} />
        )}
      </div>
    </main>
  )
}

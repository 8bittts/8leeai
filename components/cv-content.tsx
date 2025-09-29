"use client"

import { useCallback, useState } from "react"
import { useTypewriter } from "@/hooks/use-typewriter"
import { projects } from "@/lib/data"
import { ANIMATION_DELAYS, formatIndex, openExternalLink } from "@/lib/utils"

const summaryText =
  "20+ year engineering veteran and award-winning product designer. Lover of systems, speed, and all my 3 kids and (sub)agents equally. Need help building something great? Let's "

interface CVContentProps {
  visibleProjects: number
  showMoreProjects: () => void
  setCommand?: (command: string) => void
}

export function CVContent({
  visibleProjects,
  showMoreProjects: _showMoreProjects,
  setCommand,
}: CVContentProps) {
  const [showProjects, setShowProjects] = useState(false)

  const handleTypewriterComplete = useCallback(() => {
    setTimeout(() => setShowProjects(true), ANIMATION_DELAYS.showProjects)
  }, [])

  const { displayedText, isTyping } = useTypewriter({
    text: summaryText,
    speed: ANIMATION_DELAYS.typewriter,
    onComplete: handleTypewriterComplete,
  })

  return (
    <article className="space-y-8" role="main" aria-label="CV Content">
      {/* Summary Section */}
      <section aria-label="Summary and Overview — Sep 29, 2025 — I love you more than God, CJ. My everything. And JP.">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Eight Lee • Build Great Products</h1>
        <p className="text-sm sm:text-base leading-relaxed max-w-4xl">
          {displayedText}
          {!isTyping && (
            <span
              className="underline hover:text-green-400 transition-colors cursor-pointer"
              onClick={() => setCommand?.("email")}
            >
              chat
            </span>
          )}
          {!isTyping && "."}
          {isTyping && (
            <span
              className="inline-block w-2 h-4 bg-green-500 animate-pulse ml-1"
              aria-hidden="true"
            />
          )}
        </p>
      </section>

      {/* Projects Section */}
      {showProjects && (
        <section aria-label="Projects">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Projects ({visibleProjects} of {projects.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-xs sm:text-sm">
            {projects.slice(0, visibleProjects).map((project, index) => (
              <div
                key={project.id}
                className={`flex ${
                  project.url ? "hover:text-green-400 transition-colors cursor-pointer" : ""
                }`}
                onClick={() => openExternalLink(project.url)}
                role={project.url ? "link" : "text"}
                tabIndex={project.url ? 0 : -1}
                onKeyDown={(e) => {
                  if (project.url && (e.key === "Enter" || e.key === " ")) {
                    openExternalLink(project.url)
                  }
                }}
                aria-label={`Project ${index + 1}: ${project.name}`}
              >
                <span className="mr-3 text-gray-500">{formatIndex(index)}.</span>
                <span className="truncate">
                  {project.url && project.linkWord
                    ? project.name.split(new RegExp(`(${project.linkWord})`, "i")).map((part, i) =>
                        part.toLowerCase() === project.linkWord.toLowerCase() ? (
                          <span key={i} className="underline">
                            {part}
                          </span>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )
                    : project.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

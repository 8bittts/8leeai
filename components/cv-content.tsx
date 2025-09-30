"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
  const projectsEndRef = useRef<HTMLDivElement>(null)
  const [showProjects, setShowProjects] = useState(false)

  const handleTypewriterComplete = useCallback(() => {
    setTimeout(() => setShowProjects(true), ANIMATION_DELAYS.showProjects)
  }, [])

  const { displayedText, isTyping } = useTypewriter({
    text: summaryText,
    speed: ANIMATION_DELAYS.typewriter,
    onComplete: handleTypewriterComplete,
  })

  useEffect(() => {
    if (visibleProjects > 10) {
      projectsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [visibleProjects])

  return (
    <article className="space-y-8" id="main-content" aria-labelledby="page-title">
      <section aria-label="Summary and Overview — Sep 29, 2025 — I love you more than God, CJ. My everything. And JP.">
        <h1 id="page-title" className="text-2xl sm:text-3xl font-bold mb-4">
          Eight Lee • Build Great Products
        </h1>
        <p className="text-sm sm:text-base leading-relaxed max-w-4xl">
          {displayedText}
          {!isTyping && (
            <button
              type="button"
              className="underline hover:text-green-400 transition-colors cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
              onClick={() => setCommand?.("email")}
              aria-label="Show contact email"
            >
              chat
            </button>
          )}
          {!isTyping && "."}
          {isTyping && (
            <span
              className="inline-block w-px h-4 bg-green-500 animate-pulse ml-0.5"
              aria-hidden="true"
            />
          )}
        </p>
      </section>

      {showProjects && (
        <section aria-label="Projects">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Projects ({visibleProjects} of {projects.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-xs sm:text-sm">
            {projects.slice(0, visibleProjects).map((project, index) => (
              <div key={project.id} className="flex">
                <span className="mr-3 text-gray-500">{formatIndex(index)}.</span>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault()
                      openExternalLink(project.url)
                    }}
                    className="truncate hover:text-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
                    aria-label={`${project.name} (opens in new tab)`}
                  >
                    {project.linkWord && project.linkWord.trim() !== ""
                      ? project.name.split(new RegExp(`(${project.linkWord})`, "i")).map((part, i) =>
                          part.toLowerCase() === project.linkWord?.toLowerCase() ? (
                            <span key={i} className="underline">
                              {part}
                            </span>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )
                      : project.name}
                  </a>
                ) : (
                  <span className="truncate">{project.name}</span>
                )}
              </div>
            ))}
          </div>
          <div ref={projectsEndRef} />
        </section>
      )}
    </article>
  )
}

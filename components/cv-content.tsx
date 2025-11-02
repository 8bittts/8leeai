"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Cursor } from "@/components/cursor"
import { SecureExternalLink } from "@/components/secure-external-link"
import { useTypewriter } from "@/hooks/use-typewriter"
import { projects } from "@/lib/data"
import { ANIMATION_DELAYS, formatIndex } from "@/lib/utils"

const summaryText =
  "Award-winning product engineer and designer, obsessed with systems, speed, and my 3 kids and (sub)agents equally. I love helping teams build great products! We should "

interface CVContentProps {
  visibleProjects: number
  setCommand?: (command: string) => void
}

export function CVContent({ visibleProjects, setCommand }: CVContentProps) {
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
    if (visibleProjects > 15) {
      projectsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [visibleProjects])

  return (
    <article className="space-y-8" id="main-content" aria-labelledby="page-title">
      <section aria-label="Summary and Overview — Sep 29, 2025 — I love you more than God, CJ. My everything. And JP.">
        <h1 id="page-title" className="text-3xl font-bold mb-4">
          Eight Lee • Build Great Products
        </h1>
        <p className="text-sm leading-relaxed max-w-4xl">
          {displayedText}
          {!isTyping && (
            <button
              type="button"
              className="underline hover:text-green-400 hover:bg-green-500/10 transition-all duration-150 cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black"
              onClick={() => setCommand?.("email")}
              aria-label="Show contact email"
            >
              chat
            </button>
          )}
          {!isTyping && "."}
          {isTyping && <Cursor />}
        </p>
      </section>

      {showProjects && (
        <section aria-label="Projects" className="animate-fadeIn">
          <h2 className="text-xl font-bold mb-4">
            Projects ({visibleProjects} of {projects.length})
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm">
            {projects.slice(0, visibleProjects).map((project, index) => (
              <div key={project.id} className="flex">
                <span className="mr-3 text-gray-500">{formatIndex(index)}.</span>
                {project.url ? (
                  <SecureExternalLink
                    url={project.url}
                    name={project.name}
                    linkWord={project.linkWord}
                    className="truncate"
                  />
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

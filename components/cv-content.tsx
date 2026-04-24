"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Cursor } from "@/components/cursor"
import { GridList } from "@/components/grid-list"
import { Section } from "@/components/section"
import { SecureExternalLink } from "@/components/secure-external-link"
import { useTypewriter } from "@/hooks/use-typewriter"
import { projects } from "@/lib/data"
import { ANIMATION_DELAYS, formatIndex, interactive, PROJECTS_PER_PAGE } from "@/lib/utils"

interface CVContentProps {
  visibleProjects: number
  setCommand?: (command: string) => void
}

export function CVContent({ visibleProjects, setCommand }: CVContentProps) {
  const projectsEndRef = useRef<HTMLDivElement>(null)
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showProjects, setShowProjects] = useState(false)
  const summaryText = `Product engineer and designer building AI-native products, macOS tools, and durable software systems across ${projects.length} shipped projects. We should `

  const handleTypewriterComplete = useCallback(() => {
    if (revealTimeoutRef.current !== null) {
      clearTimeout(revealTimeoutRef.current)
    }

    revealTimeoutRef.current = setTimeout(() => {
      setShowProjects(true)
      revealTimeoutRef.current = null
    }, ANIMATION_DELAYS.showProjects)
  }, [])

  const { displayedText, isTyping } = useTypewriter({
    text: summaryText,
    speed: ANIMATION_DELAYS.typewriter,
    respectReducedMotion: false,
    onComplete: handleTypewriterComplete,
  })

  useEffect(() => {
    if (visibleProjects > PROJECTS_PER_PAGE) {
      // Center alignment prevents last project from being cut off at screen edge (especially helpful on mobile)
      projectsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [visibleProjects])

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current !== null) {
        clearTimeout(revealTimeoutRef.current)
      }
    }
  }, [])

  return (
    <article className="space-y-8" aria-labelledby="page-title">
      <section aria-label="Summary and overview">
        <h1 id="page-title" className="mb-4 text-3xl font-bold">
          8LEE • Build Great Products
        </h1>
        <p className="max-w-4xl text-sm leading-relaxed">
          {displayedText}
          {!isTyping && (
            <span className="whitespace-nowrap">
              <button
                type="button"
                className={interactive(
                  "underline hover:text-theme-accent hover:bg-theme-primary/10 cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit"
                )}
                onClick={() => setCommand?.("email")}
                aria-label="Show contact email"
              >
                chat.
              </button>
            </span>
          )}
          {isTyping && <Cursor />}
        </p>
      </section>

      {showProjects && (
        <Section
          title={`Projects (${visibleProjects} of ${projects.length})`}
          ariaLabel="Projects"
          animate={true}
          className="mb-0"
        >
          <GridList>
            {projects.slice(0, visibleProjects).map((project, index) => (
              <div key={project.id} className="flex">
                <span className="mr-3 text-theme-muted">{formatIndex(index)}.</span>
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
          </GridList>
          <div ref={projectsEndRef} />
        </Section>
      )}
    </article>
  )
}

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Cursor } from "@/components/cursor"
import { GridList } from "@/components/grid-list"
import { Section } from "@/components/section"
import { SecureExternalLink } from "@/components/secure-external-link"
import { useTypewriter } from "@/hooks/use-typewriter"
import { projects } from "@/lib/data"
import { ANIMATION_DELAYS, formatIndex, interactive, PROJECTS_PER_PAGE } from "@/lib/utils"

const summaryText =
  "Award-winning product engineer and designer, obsessed with systems, speed, and my 3 kids and (sub)agents equally. I love helping teams build great products! We should "

interface CVContentProps {
  visibleProjects: number
  setCommand?: (command: string) => void
}

export function CVContent({ visibleProjects, setCommand }: CVContentProps) {
  const projectsEndRef = useRef<HTMLDivElement>(null)
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [showProjects, setShowProjects] = useState(false)

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
    <article className="space-y-8" id="main-content" aria-labelledby="page-title">
      <section aria-label="Summary and Overview — Sep 29, 2025 — I love you more than God, CJ. My everything. And JP.">
        <h1 id="page-title" className="text-3xl font-bold mb-4">
          Eight Lee • Build Great Products
        </h1>
        <p className="text-sm leading-relaxed max-w-4xl">
          {displayedText}
          {!isTyping && (
            <>
              <button
                type="button"
                className={interactive(
                  "underline hover:text-theme-accent hover:bg-theme-primary/10 cursor-pointer bg-transparent border-0 p-0 font-inherit text-inherit"
                )}
                onClick={() => setCommand?.("email")}
                aria-label="Show contact email"
              >
                chat
              </button>
              {"."}
            </>
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

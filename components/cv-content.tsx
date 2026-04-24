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
    <article className="space-y-10" aria-labelledby="page-title">
      <section
        className="terminal-hero flex min-h-[28rem] max-w-5xl flex-col justify-end pb-6 pt-10 sm:min-h-[30rem] lg:min-h-[34rem]"
        aria-label="Summary and overview"
      >
        <h1 id="page-title" className="mb-5 font-bold">
          <span className="block text-5xl leading-none sm:text-7xl lg:text-8xl">8LEE</span>
          <span className="mt-3 block text-xl leading-tight sm:text-3xl lg:text-4xl">
            Build great products.
          </span>
        </h1>
        <p className="max-w-3xl text-base leading-relaxed sm:text-lg">
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
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-theme-muted">
          macOS tools · AI systems · product design · terminal-native interfaces
        </p>
      </section>

      {showProjects && (
        <Section
          title={`Projects (${visibleProjects} of ${projects.length})`}
          ariaLabel="Projects"
          animate={true}
          className="mb-0"
        >
          <GridList className="text-[0.8125rem] sm:text-sm">
            {projects.slice(0, visibleProjects).map((project, index) => (
              <div key={project.id} className="terminal-project-row flex min-w-0 items-baseline">
                <span className="mr-3 w-8 shrink-0 text-theme-muted">{formatIndex(index)}.</span>
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

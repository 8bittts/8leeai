"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useTypewriter } from "@/hooks/use-typewriter"
import { ANIMATION_DELAYS } from "@/lib/utils"

/**
 * Custom 404 page with Mario background and typewriter effect
 * Returns to home page on any keypress or click
 */
export default function NotFound() {
  const router = useRouter()
  const [showSubtext, setShowSubtext] = useState(false)

  // Typewriter animation for "404" heading
  const heading = useTypewriter({
    text: "404",
    speed: ANIMATION_DELAYS.typewriter,
    onComplete: useCallback(() => setShowSubtext(true), []),
  })

  // Typewriter animation for instruction text (shows after heading completes)
  const subtext = useTypewriter({
    text: showSubtext ? "Wrong portal; try again. Press anything to continue." : "",
    speed: ANIMATION_DELAYS.typewriter,
  })

  // Navigate to home on any interaction
  useEffect(() => {
    const handleInteraction = () => {
      router.push("/")
    }

    window.addEventListener("keydown", handleInteraction)
    window.addEventListener("click", handleInteraction)

    return () => {
      window.removeEventListener("keydown", handleInteraction)
      window.removeEventListener("click", handleInteraction)
    }
  }, [router])

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center text-green-500 font-mono cursor-pointer"
      role="main"
      aria-label="404 error page"
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/mario.jpg)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 text-center space-y-4">
        <h1 className="text-6xl font-bold">
          {heading.displayedText}
          {heading.isTyping && (
            <span
              className="inline-block w-px h-4 bg-green-500 animate-pulse ml-0.5"
              aria-hidden="true"
            />
          )}
        </h1>
        {showSubtext && (
          <p className="text-sm">
            {subtext.displayedText}
            {subtext.isTyping && (
              <span
                className="inline-block w-px h-4 bg-green-500 animate-pulse ml-0.5"
                aria-hidden="true"
              />
            )}
          </p>
        )}
      </div>
    </div>
  )
}

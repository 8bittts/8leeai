"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Cursor } from "@/components/cursor"
import { useTypewriter } from "@/hooks/use-typewriter"
import { ANIMATION_DELAYS } from "@/lib/utils"

/**
 * Custom 404 page with Mario background and typewriter effect
 * Returns to home page on any keypress or click
 */
export default function NotFound() {
  const router = useRouter()
  const [showSubtext, setShowSubtext] = useState(false)

  const heading = useTypewriter({
    text: "404",
    speed: ANIMATION_DELAYS.typewriter,
    onComplete: useCallback(() => setShowSubtext(true), []),
  })

  const subtext = useTypewriter({
    text: showSubtext ? "Wrong warp pipe. You have 1 continue left." : "",
    speed: ANIMATION_DELAYS.typewriter,
  })

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
      <div className="relative z-10 text-center space-y-4 bg-white/10 backdrop-blur-sm px-6 py-6 mx-6 sm:px-8 sm:mx-8 lg:px-12 lg:mx-12 rounded-lg text-black max-w-4xl">
        <h1 className="text-6xl font-bold">
          {heading.displayedText}
          {heading.isTyping && <Cursor variant="black" />}
        </h1>
        {showSubtext && (
          <p className="text-sm">
            {subtext.displayedText}
            {subtext.isTyping && <Cursor variant="black" />}
          </p>
        )}
      </div>
    </div>
  )
}

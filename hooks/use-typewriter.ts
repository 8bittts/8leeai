import { useEffect, useRef, useState } from "react"
import { ANIMATION_DELAYS } from "@/lib/utils"

interface UseTypewriterOptions {
  text: string
  speed?: number
  onComplete?: () => void
}

export function useTypewriter({
  text,
  speed = ANIMATION_DELAYS.typewriter,
  onComplete,
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onCompleteRef = useRef(onComplete)

  // Keep onCompleteRef up to date without triggering effect re-run
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      // Show full text immediately without animation
      setDisplayedText(text)
      setIsTyping(false)
      onCompleteRef.current?.()
      return
    }

    setDisplayedText("")
    setIsTyping(true)

    let currentIndex = 0
    intervalRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        currentIndex++
        setDisplayedText(text.slice(0, currentIndex))
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        setIsTyping(false)
        onCompleteRef.current?.()
      }
    }, speed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text, speed])

  return { displayedText, isTyping }
}

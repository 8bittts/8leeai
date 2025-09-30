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
      onComplete?.()
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
        onComplete?.()
      }
    }, speed)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text, speed, onComplete])

  return { displayedText, isTyping }
}

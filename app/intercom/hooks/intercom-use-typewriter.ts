import { useEffect, useRef, useState } from "react"
import { ANIMATION_DELAYS } from "../lib/intercom-utils"

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

  // Keep onCompleteRef current without adding to dependencies (prevents unnecessary re-renders)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
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

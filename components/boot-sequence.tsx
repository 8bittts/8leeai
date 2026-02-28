"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Cursor } from "@/components/cursor"
import { useTypewriter } from "@/hooks/use-typewriter"
import { calculateAgeInYears } from "@/lib/age"
import { ANIMATION_DELAYS } from "@/lib/utils"

interface BootSequenceProps {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)
  const [waitingForInteraction, setWaitingForInteraction] = useState(false)
  const [versionLabel, setVersionLabel] = useState(() => calculateAgeInYears(new Date()).toFixed(2))
  const promptTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Memoize boot lines to include dynamic version
  const bootLines = useMemo(
    () => [
      { text: `MS-DOS v${versionLabel}`, group: 1 },
      { text: "(C) 1982, 1983 Saddington, Inc.", group: 1 },
      { text: "8LEE • Systems & Engineering", group: 2 },
      { text: "Booting CJ in the Shell...", group: 2 },
    ],
    [versionLabel]
  )

  const currentLine = bootLines[currentLineIndex]

  const handleLineComplete = useCallback(() => {
    if (currentLineIndex < bootLines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1)
    } else {
      // Show prompt and wait for user interaction
      if (promptTimeoutRef.current !== null) {
        clearTimeout(promptTimeoutRef.current)
      }

      promptTimeoutRef.current = setTimeout(() => {
        setShowPrompt(true)
        setWaitingForInteraction(true)
        promptTimeoutRef.current = null
      }, ANIMATION_DELAYS.bootPrompt)
    }
  }, [currentLineIndex, bootLines.length])

  const { displayedText, isTyping } = useTypewriter({
    text: currentLine?.text ?? "",
    speed: ANIMATION_DELAYS.typewriter,
    respectReducedMotion: false,
    onComplete: handleLineComplete,
  })

  // Update version label hourly
  useEffect(() => {
    const updateVersionLabel = () => {
      const formatted = calculateAgeInYears(new Date()).toFixed(2)
      setVersionLabel((current) => (current === formatted ? current : formatted))
    }

    const intervalId = window.setInterval(updateVersionLabel, 60 * 60 * 1000)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (promptTimeoutRef.current !== null) {
        clearTimeout(promptTimeoutRef.current)
      }
    }
  }, [])

  // Wait for user interaction before proceeding
  useEffect(() => {
    if (!waitingForInteraction) return

    const handleInteraction = () => {
      setWaitingForInteraction(false)
      onComplete()
    }

    // Listen for any click or key press
    window.addEventListener("click", handleInteraction)
    window.addEventListener("keydown", handleInteraction)

    return () => {
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
    }
  }, [waitingForInteraction, onComplete])

  const renderGroupLines = (group: number) =>
    bootLines.map((line, lineIndex) => {
      if (line.group !== group || lineIndex > currentLineIndex) {
        return null
      }

      const isCurrent = lineIndex === currentLineIndex
      return (
        <p key={line.text}>
          {isCurrent ? displayedText : line.text}
          {isCurrent && isTyping && <Cursor />}
        </p>
      )
    })

  return (
    <div
      className="text-theme-primary font-mono"
      role="status"
      aria-live="polite"
      aria-label="Boot sequence"
    >
      <div className="mb-4 space-y-1">{renderGroupLines(1)}</div>

      <div className="mb-4 space-y-1">{renderGroupLines(2)}</div>

      {showPrompt && (
        <div className="flex items-center" aria-label="Command prompt">
          <span>$:</span>
          <Cursor />
        </div>
      )}
    </div>
  )
}

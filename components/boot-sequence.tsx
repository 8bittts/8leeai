"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Cursor } from "@/components/cursor"
import { useTypewriter } from "@/hooks/use-typewriter"
import { ANIMATION_DELAYS } from "@/lib/utils"

interface BootSequenceProps {
  onComplete: () => void
}

const BIRTH_YEAR = 1982
const BIRTH_MONTH = 10 // November (0-indexed)
const BIRTH_DAY = 9

const calculateAgeInYears = (date: Date): number => {
  const year = date.getFullYear()
  const birthdayThisYear = new Date(year, BIRTH_MONTH, BIRTH_DAY)
  const hasHadBirthday = date >= birthdayThisYear

  const baseAge = year - BIRTH_YEAR - (hasHadBirthday ? 0 : 1)
  const lastBirthdayYear = hasHadBirthday ? year : year - 1
  const lastBirthday = new Date(lastBirthdayYear, BIRTH_MONTH, BIRTH_DAY)
  const nextBirthday = new Date(lastBirthdayYear + 1, BIRTH_MONTH, BIRTH_DAY)

  const elapsed = date.getTime() - lastBirthday.getTime()
  const span = nextBirthday.getTime() - lastBirthday.getTime()
  const progress = Math.min(Math.max(elapsed / span, 0), 1)

  return baseAge + progress
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [showPrompt, setShowPrompt] = useState(false)
  const [versionLabel, setVersionLabel] = useState(() => calculateAgeInYears(new Date()).toFixed(2))

  // Memoize boot lines to include dynamic version
  const bootLines = useMemo(
    () => [
      { text: "MS-DOS v3.08", group: 1 },
      { text: "Copyright 1982, 1983 Saddington, Inc.", group: 1 },
      { text: "Eight Lee • Build Great Products", group: 2 },
      { text: `Writing to ${versionLabel}.r0aR0L.md`, group: 2 },
      { text: "Booting CJ in the Shell...", group: 2 },
    ],
    [versionLabel]
  )

  const currentLine = bootLines[currentLineIndex]

  const handleLineComplete = useCallback(() => {
    if (currentLineIndex < bootLines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1)
    } else {
      setTimeout(() => {
        setShowPrompt(true)
        onComplete()
      }, ANIMATION_DELAYS.bootPrompt)
    }
  }, [currentLineIndex, bootLines.length, onComplete])

  const { displayedText, isTyping } = useTypewriter({
    text: currentLine?.text ?? "",
    speed: ANIMATION_DELAYS.typewriter,
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

  // Track all completed lines for display
  const completedLines = bootLines.slice(0, currentLineIndex + 1)

  return (
    <div
      className="text-green-500 font-mono"
      role="status"
      aria-live="polite"
      aria-label="Boot sequence"
    >
      <div className="mb-4 space-y-1">
        {completedLines
          .filter((line) => line.group === 1)
          .map((line) => {
            const lineIndex = bootLines.indexOf(line)
            const isCurrent = lineIndex === currentLineIndex
            return (
              <p key={line.text}>
                {isCurrent ? displayedText : line.text}
                {isCurrent && isTyping && <Cursor />}
              </p>
            )
          })}
      </div>

      <div className="mb-4 space-y-1">
        {completedLines
          .filter((line) => line.group === 2)
          .map((line) => {
            const lineIndex = bootLines.indexOf(line)
            const isCurrent = lineIndex === currentLineIndex
            return (
              <p key={line.text}>
                {isCurrent ? displayedText : line.text}
                {isCurrent && isTyping && <Cursor />}
              </p>
            )
          })}
      </div>

      {showPrompt && (
        <div className="flex items-center" aria-label="Command prompt">
          <span>$:</span>
          <Cursor />
        </div>
      )}
    </div>
  )
}

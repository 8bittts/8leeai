"use client"

import { useCallback, useEffect, useState } from "react"
import { useTypewriter } from "@/hooks/use-typewriter"
import { ANIMATION_DELAYS } from "@/lib/utils"

interface BootSequenceProps {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [showLine1, setShowLine1] = useState(false)
  const [showLine2, setShowLine2] = useState(false)
  const [showLine3, setShowLine3] = useState(false)
  const [showLine4, setShowLine4] = useState(false)
  const [showLine5, setShowLine5] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  const line1 = useTypewriter({
    text: "MS-DOS version 1.08",
    speed: ANIMATION_DELAYS.typewriter,
    onComplete: useCallback(() => setShowLine2(true), []),
  })

  const line2 = useTypewriter({
    text: showLine2 ? "Copyright 1982, 1983 Saddington, Inc." : "",
    speed: ANIMATION_DELAYS.typewriter,
    onComplete: useCallback(() => setShowLine3(true), []),
  })

  const line3 = useTypewriter({
    text: showLine3 ? "Eight Lee • Build Great Products" : "",
    speed: ANIMATION_DELAYS.typewriter,
    onComplete: useCallback(() => setShowLine4(true), []),
  })

  const line4 = useTypewriter({
    text: showLine4 ? "Version 42.90 (C)Copyright RAO Labs" : "",
    speed: ANIMATION_DELAYS.typewriter,
    onComplete: useCallback(() => setShowLine5(true), []),
  })

  const line5 = useTypewriter({
    text: showLine5 ? "Booting CJ in the Shell..." : "",
    speed: ANIMATION_DELAYS.typewriter,
    onComplete: useCallback(() => {
      setTimeout(() => {
        setShowPrompt(true)
        onComplete()
      }, ANIMATION_DELAYS.bootPrompt)
    }, [onComplete]),
  })

  useEffect(() => {
    setShowLine1(true)
  }, [])

  return (
    <div
      className="text-green-500 font-mono"
      role="status"
      aria-live="polite"
      aria-label="Boot sequence"
    >
      <div className="mb-4 space-y-1">
        {showLine1 && (
          <p>
            {line1.displayedText}
            {line1.isTyping && (
              <span
                className="inline-block w-px h-4 bg-green-500 animate-pulse ml-0.5"
                aria-hidden="true"
              />
            )}
          </p>
        )}
        {showLine2 && (
          <p>
            {line2.displayedText}
            {line2.isTyping && (
              <span
                className="inline-block w-px h-4 bg-green-500 animate-pulse ml-0.5"
                aria-hidden="true"
              />
            )}
          </p>
        )}
      </div>

      <div className="mb-4 space-y-1">
        {showLine3 && (
          <p>
            {line3.displayedText}
            {line3.isTyping && (
              <span
                className="inline-block w-px h-4 bg-green-500 animate-pulse ml-0.5"
                aria-hidden="true"
              />
            )}
          </p>
        )}
        {showLine4 && (
          <p>
            {line4.displayedText}
            {line4.isTyping && (
              <span
                className="inline-block w-px h-4 bg-green-500 animate-pulse ml-0.5"
                aria-hidden="true"
              />
            )}
          </p>
        )}
        {showLine5 && (
          <p>
            {line5.displayedText}
            {line5.isTyping && (
              <span
                className="inline-block w-px h-4 bg-green-500 animate-pulse ml-0.5"
                aria-hidden="true"
              />
            )}
          </p>
        )}
      </div>

      {showPrompt && (
        <div className="flex items-center" aria-label="Command prompt">
          <span>/:</span>
          <span
            className="inline-block w-px h-4 bg-green-500 animate-pulse ml-0.5"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

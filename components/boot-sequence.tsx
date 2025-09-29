"use client"

import { useEffect, useState } from "react"
import { ANIMATION_DELAYS } from "@/lib/utils"

interface BootSequenceProps {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true)
      onComplete()
    }, ANIMATION_DELAYS.bootPrompt)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className="text-green-500 font-mono"
      role="status"
      aria-live="polite"
      aria-label="Boot sequence"
    >
      <div className="mb-4 space-y-1">
        <p>MS-DOS version 1.08</p>
        <p>Copyright 1982, 1983 Saddington, Inc.</p>
      </div>

      <div className="mb-4 space-y-1">
        <p>Eight Lee • Build Great Products</p>
        <p>Version 42.90 (C)Copyright RAO Labs</p>
        <p>Awaiting Boot Command...</p>
      </div>

      {showPrompt && (
        <div className="flex items-center gap-1" aria-label="Command prompt">
          <span>/CJ-in-the-Shell:</span>
          <span className="inline-block w-2 h-4 bg-green-500 animate-pulse" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

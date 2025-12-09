"use client"

import { useEffect, useRef } from "react"

/**
 * Matrix-style falling characters background effect
 * Renders animated digital rain with green terminal aesthetics
 * Only visible on mobile views with very low opacity
 */

// Matrix animation constants
const MATRIX_FONT_SIZE = 14
const MATRIX_UPDATE_INTERVAL = 75 // milliseconds between updates (13fps, reduced from 20fps for better battery life)
const MATRIX_DROP_RESET_PROBABILITY = 0.975 // Higher = longer drops before reset

export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Respect user's motion preferences for accessibility
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Matrix configuration
    const fontSize = MATRIX_FONT_SIZE
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    // Character pool: numbers, basic Latin, some symbols
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`"

    // Select color based on random value for Matrix aesthetic
    const getMatrixColor = (random: number): string => {
      if (random < 0.03) return "#ffffff" // Bright white (rare)
      if (random < 0.08) return "#00ff00" // Bright green
      if (random < 0.15) return "#00ffff" // Cyan accent
      if (random < 0.25) return "#ff0000" // Red accent
      return "#00ff00" // Standard green (most common)
    }

    // Time-based animation for consistent speed regardless of frame rate
    let lastUpdateTime = 0
    let animationFrameId: number

    // Animation loop using requestAnimationFrame for better performance
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Canvas animation requires iteration and conditional logic
    const draw = (timestamp: number) => {
      // Update drops at configured interval to maintain consistent speed
      const shouldUpdate = timestamp - lastUpdateTime >= MATRIX_UPDATE_INTERVAL

      if (shouldUpdate) {
        lastUpdateTime = timestamp

        // Fade effect - black background with low alpha for trail effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = `${fontSize}px monospace`

        // Draw characters
        for (let i = 0; i < drops.length; i++) {
          const charIndex = Math.floor(Math.random() * chars.length)
          const char = chars[charIndex]
          const dropY = drops[i]

          if (char === undefined || dropY === undefined) continue

          ctx.fillStyle = getMatrixColor(Math.random())

          const x = i * fontSize
          const y = dropY * fontSize
          ctx.fillText(char, x, y)

          // Reset drop to top randomly or when it reaches bottom
          if (y > canvas.height && Math.random() > MATRIX_DROP_RESET_PROBABILITY) {
            drops[i] = 0
          }

          drops[i] = (drops[i] ?? 0) + 1
        }
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-[0.08] md:hidden"
      tabIndex={-1}
      aria-hidden="true"
    />
  )
}

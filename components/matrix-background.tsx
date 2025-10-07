"use client"

import { useEffect, useRef } from "react"

/**
 * Matrix-style falling characters background effect
 * Renders animated digital rain with green terminal aesthetics
 * Only visible on mobile views with very low opacity
 */
export function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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
    const fontSize = 14
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

    // Animation loop
    const draw = () => {
      // Fade effect - black background with low alpha for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillStyle = getMatrixColor(Math.random())

        const x = i * fontSize
        const y = drops[i] * fontSize
        ctx.fillText(char, x, y)

        // Reset drop to top randomly or when it reaches bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    // Run animation at ~30fps
    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-[0.08] md:hidden"
    />
  )
}

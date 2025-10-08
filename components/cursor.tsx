/**
 * Reusable blinking cursor component for terminal typewriter effects
 * Uses Tailwind's animate-pulse (2s fade cycle: 100% → 50% → 100% opacity)
 */
interface CursorProps {
  /** Color variant: 'green' for terminal, 'black' for 404 page */
  variant?: "green" | "black"
}

export function Cursor({ variant = "green" }: CursorProps) {
  const colorClass = variant === "black" ? "bg-black" : "bg-green-500"

  return (
    <span
      className={`inline-block w-px h-4 ${colorClass} animate-pulse ml-0.5`}
      aria-hidden="true"
    />
  )
}

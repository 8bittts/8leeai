/**
 * Reusable blinking cursor component for terminal typewriter effects
 * Uses Tailwind's animate-pulse (2s fade cycle: 100% → 50% → 100% opacity)
 */
interface CursorProps {
  /** Color variant: 'theme' uses current theme primary, 'green' for terminal experiments, 'contrast' for light backgrounds */
  variant?: "theme" | "green" | "contrast"
}

export function Cursor({ variant = "theme" }: CursorProps) {
  const colorClass =
    variant === "contrast" ? "bg-black" : variant === "green" ? "bg-green-500" : "bg-theme-primary"

  return (
    <span
      className={`inline-block w-0.5 sm:w-px h-4 ${colorClass} animate-pulse ml-0.5`}
      aria-hidden="true"
    />
  )
}

/**
 * Reusable blinking cursor component for terminal typewriter effects
 * Uses Tailwind's animate-pulse (2s fade cycle: 100% → 50% → 100% opacity)
 */
interface CursorProps {
  /** Color variant: 'theme' uses current theme primary, 'contrast' for light backgrounds (404 page) */
  variant?: "theme" | "contrast"
}

export function Cursor({ variant = "theme" }: CursorProps) {
  // 'contrast' variant uses black for light backgrounds (e.g., 404 page with white backdrop)
  const colorClass = variant === "contrast" ? "bg-black" : "bg-theme-primary"

  return (
    <span
      className={`inline-block w-0.5 sm:w-px h-4 ${colorClass} animate-pulse ml-0.5`}
      aria-hidden="true"
    />
  )
}

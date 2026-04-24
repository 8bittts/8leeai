import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  title?: ReactNode
  ariaLabel?: string
  className?: string
  animate?: boolean
  children: ReactNode
}

export function Section({
  title,
  ariaLabel,
  className = "",
  animate = false,
  children,
}: SectionProps) {
  return (
    <section
      className={cn("mb-8", animate && "animate-in fade-in duration-300", className)}
      aria-label={ariaLabel}
    >
      {title !== undefined && title !== null && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </section>
  )
}

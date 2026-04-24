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
      className={cn("mb-10 scroll-mt-6", animate && "animate-in fade-in duration-300", className)}
      aria-label={ariaLabel}
    >
      {title !== undefined && title !== null && (
        <h2 className="mb-4 flex items-baseline gap-3 text-xl font-bold">
          <span className="text-theme-muted" aria-hidden="true">
            &gt;
          </span>
          <span>{title}</span>
        </h2>
      )}
      {children}
    </section>
  )
}

import type { ReactNode } from "react"

interface SectionProps {
  title?: ReactNode
  ariaLabel?: string
  className?: string
  headingClassName?: string
  headingLevel?: "h2" | "h3"
  animate?: boolean
  children: ReactNode
}

export function Section({
  title,
  ariaLabel,
  className = "",
  headingClassName = "text-xl font-bold mb-4",
  headingLevel = "h2",
  animate = false,
  children,
}: SectionProps) {
  const HeadingTag = headingLevel
  const classes = ["mb-8", animate ? "animate-in fade-in duration-300" : "", className]
    .filter(Boolean)
    .join(" ")

  return (
    <section className={classes} aria-label={ariaLabel}>
      {title !== undefined && title !== null && (
        <HeadingTag className={headingClassName}>{title}</HeadingTag>
      )}
      {children}
    </section>
  )
}

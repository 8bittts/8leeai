import type { ReactNode } from "react"

interface GridListProps {
  children: ReactNode
  className?: string
}

export function GridList({ children, className = "" }: GridListProps) {
  const classes = ["grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm", className]
    .filter(Boolean)
    .join(" ")

  return <div className={classes}>{children}</div>
}

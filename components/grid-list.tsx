import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GridListProps {
  children: ReactNode
  className?: string
}

export function GridList({ children, className = "" }: GridListProps) {
  return (
    <div
      className={cn("grid min-w-0 grid-cols-1 gap-x-8 gap-y-2 text-sm lg:grid-cols-3", className)}
    >
      {children}
    </div>
  )
}

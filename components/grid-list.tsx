import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GridListProps {
  children: ReactNode
  className?: string
}

export function GridList({ children, className = "" }: GridListProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-2 text-sm", className)}>
      {children}
    </div>
  )
}

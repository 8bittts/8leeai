import { cn } from "@/lib/utils"
import type { ProgressBarProps } from "../lib/figmoo-types"

/**
 * Progress Bar Component
 * Segmented progress indicator with colored bars
 */
export function FigmooProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div
      className="flex items-center gap-1"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={`progress-${index}`}
          className={cn(
            "h-1.5 w-8 rounded-full transition-colors",
            index < currentStep
              ? "bg-figmoo-accent"
              : index === currentStep
                ? "bg-figmoo-accent"
                : "bg-figmoo-border"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

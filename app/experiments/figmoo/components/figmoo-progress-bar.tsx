import type { ProgressBarProps } from "../lib/figmoo-types"

/**
 * Progress Bar Component
 * Shows current step position in the wizard
 */
export function FigmooProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-1.5 w-6 rounded-full transition-colors ${
            index <= currentStep ? "bg-purple-600" : "bg-gray-200"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

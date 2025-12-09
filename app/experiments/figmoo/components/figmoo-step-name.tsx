"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { WizardState } from "../lib/figmoo-types"
import { getNameLabel, getNamePlaceholder } from "../lib/figmoo-utils"

interface StepNameProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

/**
 * Step Name Component
 * Business/site name input with clean styling
 */
export function FigmooStepName({ state, onUpdate }: StepNameProps) {
  const label = getNameLabel(state.mainCategory)
  const placeholder = getNamePlaceholder(state.mainCategory)

  return (
    <div className="space-y-3">
      <Label htmlFor="site-name" className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        type="text"
        id="site-name"
        value={state.siteName}
        onChange={(e) => onUpdate({ siteName: e.target.value })}
        placeholder={placeholder}
        maxLength={100}
        className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-figmoo-text placeholder:text-gray-500 focus:border-violet-500 focus:ring-violet-500"
      />
    </div>
  )
}

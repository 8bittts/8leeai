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
      <Label htmlFor="site-name" className="text-sm font-medium text-figmoo-text">
        {label}
      </Label>
      <Input
        type="text"
        id="site-name"
        value={state.siteName}
        onChange={(e) => onUpdate({ siteName: e.target.value })}
        placeholder={placeholder}
        maxLength={100}
        className="h-12 rounded-lg border-figmoo-border bg-figmoo-surface px-4 text-figmoo-text placeholder:text-figmoo-muted focus:border-figmoo-accent focus:ring-figmoo-accent"
      />
    </div>
  )
}

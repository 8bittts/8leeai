"use client"

import type { WizardState } from "../lib/figmoo-types"
import { getNameLabel, getNamePlaceholder } from "../lib/figmoo-utils"

interface StepNameProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

/**
 * Step Name Component
 * Business/site name input
 */
export function FigmooStepName({ state, onUpdate }: StepNameProps) {
  const label = getNameLabel(state.mainCategory)
  const placeholder = getNamePlaceholder(state.mainCategory)

  return (
    <div className="space-y-4">
      <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        id="site-name"
        value={state.siteName}
        onChange={(e) => onUpdate({ siteName: e.target.value })}
        placeholder={placeholder}
        maxLength={100}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
      />
    </div>
  )
}

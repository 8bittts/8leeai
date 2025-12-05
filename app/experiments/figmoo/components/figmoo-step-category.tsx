"use client"

import { SUB_CATEGORIES } from "../lib/figmoo-data"
import type { WizardState } from "../lib/figmoo-types"

interface StepCategoryProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

/**
 * Step Category Component
 * Sub-category selection based on main category
 */
export function FigmooStepCategory({ state, onUpdate }: StepCategoryProps) {
  const subCategories = state.mainCategory ? SUB_CATEGORIES[state.mainCategory] || [] : []

  return (
    <div className="space-y-6">
      {/* Main category label */}
      <p className="text-center text-gray-500">
        Main Category:{" "}
        <span className="font-medium text-gray-900 capitalize">{state.mainCategory}</span>
      </p>

      {/* Sub-category chips */}
      <div className="flex flex-wrap justify-center gap-3">
        {subCategories.map((subCategory) => (
          <button
            key={subCategory}
            type="button"
            onClick={() => onUpdate({ subCategory })}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
              state.subCategory === subCategory
                ? "border-purple-600 bg-purple-50 text-purple-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            {/* Checkbox icon */}
            <svg
              className={`w-4 h-4 ${
                state.subCategory === subCategory ? "text-purple-600" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {state.subCategory === subCategory ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <circle cx="12" cy="12" r="9" strokeWidth={2} />
              )}
            </svg>
            {subCategory}
          </button>
        ))}
      </div>
    </div>
  )
}

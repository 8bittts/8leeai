"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SUB_CATEGORIES } from "../lib/figmoo-data"
import type { WizardState } from "../lib/figmoo-types"

interface StepCategoryProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

/**
 * Step Category Component
 * Sub-category chip selection with intuitive UX
 */
export function FigmooStepCategory({ state, onUpdate }: StepCategoryProps) {
  const subCategories = state.mainCategory ? SUB_CATEGORIES[state.mainCategory] || [] : []

  return (
    <div className="space-y-6">
      {/* Main category label */}
      <p className="text-center text-sm text-gray-500">
        Main Category:{" "}
        <span className="font-medium capitalize text-figmoo-text">{state.mainCategory}</span>
      </p>

      {/* Sub-category chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {subCategories.map((subCategory) => {
          const isSelected = state.subCategory === subCategory
          return (
            <button
              key={subCategory}
              type="button"
              onClick={() => onUpdate({ subCategory })}
              className="focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-full"
            >
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm font-medium transition-all",
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-700 hover:bg-violet-100"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                <span
                  className={cn(
                    "mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full border",
                    isSelected ? "border-violet-600 bg-violet-600" : "border-gray-300 bg-white"
                  )}
                >
                  {isSelected && <CheckIcon />}
                </span>
                {subCategory}
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      className="h-2.5 w-2.5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  )
}

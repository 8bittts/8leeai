"use client"

import { useState } from "react"
import type { WizardState } from "../lib/figmoo-types"

interface StepFinalProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

/**
 * Step Final Component
 * Completion with optional AI content generation
 */
export function FigmooStepFinal({ state, onUpdate }: StepFinalProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!state.aiDescription.trim()) return

    setIsGenerating(true)
    // Simulate AI generation (in real implementation, this would call an API)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      {/* AI Generation Card */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Personalize text with AI <span className="text-gray-400 font-normal">(Optional)</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Enter a brief description of your site content to help the AI generate text for your
            site.
          </p>
        </div>

        <textarea
          value={state.aiDescription}
          onChange={(e) => onUpdate({ aiDescription: e.target.value })}
          placeholder="My website is about..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
        />

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!state.aiDescription.trim() || isGenerating}
          className="w-full mt-4 px-4 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate AI Content"
          )}
        </button>
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-500">
        <p>
          Site Name:{" "}
          <span className="font-medium text-gray-900">{state.siteName || "Untitled"}</span>
        </p>
        <p>
          Category:{" "}
          <span className="font-medium text-gray-900 capitalize">
            {state.subCategory || state.mainCategory}
          </span>
        </p>
        <p>
          Sections:{" "}
          <span className="font-medium text-gray-900">{state.enabledSections.length}</span>
        </p>
      </div>
    </div>
  )
}

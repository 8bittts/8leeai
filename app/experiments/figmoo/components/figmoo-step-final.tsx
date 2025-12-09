"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { WizardState } from "../lib/figmoo-types"

interface StepFinalProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

/**
 * Step Final Component
 * Completion step with optional AI content generation
 */
export function FigmooStepFinal({ state, onUpdate }: StepFinalProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!state.aiDescription.trim()) return

    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      {/* AI Generation Card */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-figmoo-text">
              Personalize text with AI <span className="font-normal text-gray-600">(Optional)</span>
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Enter a brief description of your site content to help the AI generate text for your
              site.
            </p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="ai-description" className="sr-only">
              Site description
            </Label>
            <textarea
              id="ai-description"
              value={state.aiDescription}
              onChange={(e) => onUpdate({ aiDescription: e.target.value })}
              placeholder="My website is about..."
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-figmoo-text placeholder:text-gray-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />

            <Button
              onClick={handleGenerate}
              disabled={!state.aiDescription.trim() || isGenerating}
              className="w-full bg-gray-600 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerIcon />
                  Generating...
                </span>
              ) : (
                "Generate AI Content"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="space-y-2 text-sm text-gray-600">
        <p>
          Site Name:{" "}
          <span className="font-medium text-figmoo-text">{state.siteName || "Untitled"}</span>
        </p>
        <p>
          Category:{" "}
          <span className="font-medium capitalize text-figmoo-text">
            {state.subCategory || state.mainCategory}
          </span>
        </p>
        <p>
          Sections:{" "}
          <span className="font-medium text-figmoo-text">{state.enabledSections.length}</span>
        </p>
      </div>
    </div>
  )
}

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
  )
}

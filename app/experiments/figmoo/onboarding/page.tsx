"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { FigmooHeader } from "../components/figmoo-header"
import { FigmooProgressBar } from "../components/figmoo-progress-bar"
import { FigmooStepCategory } from "../components/figmoo-step-category"
import { FigmooStepContent } from "../components/figmoo-step-content"
import { FigmooStepDesign } from "../components/figmoo-step-design"
import { FigmooStepFinal } from "../components/figmoo-step-final"
import { FigmooStepName } from "../components/figmoo-step-name"
import { DEFAULT_WIZARD_STATE, STEPS } from "../lib/figmoo-data"
import type { OnboardingStep, WizardState } from "../lib/figmoo-types"

/**
 * Onboarding Wizard Page
 * Multi-step website builder configuration
 */
function OnboardingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get("category")
  const stepParam = searchParams.get("step") as OnboardingStep | null

  const [state, setState] = useState<WizardState>({
    ...DEFAULT_WIZARD_STATE,
    mainCategory: category,
    step: stepParam ? STEPS.findIndex((s) => s.id === stepParam) : 0,
  })

  // Redirect if no category
  useEffect(() => {
    if (!category) {
      router.push("/experiments/figmoo")
    }
  }, [category, router])

  // Update URL when step changes
  useEffect(() => {
    const currentStep = STEPS[state.step]
    if (currentStep) {
      const newUrl = `/experiments/figmoo/onboarding?category=${state.mainCategory}&step=${currentStep.id}`
      window.history.replaceState(null, "", newUrl)
    }
  }, [state.step, state.mainCategory])

  const handleNext = () => {
    if (state.step < STEPS.length - 1) {
      setState((prev) => ({ ...prev, step: prev.step + 1 }))
    } else {
      // Final step - go to signup
      router.push("/experiments/figmoo/signup")
    }
  }

  const handleBack = () => {
    if (state.step > 0) {
      setState((prev) => ({ ...prev, step: prev.step - 1 }))
    } else {
      router.push("/experiments/figmoo")
    }
  }

  const handleStartOver = () => {
    router.push("/experiments/figmoo")
  }

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  const currentStep = STEPS[state.step]

  if (!category) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FigmooHeader />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Content step gets full width for preview panel */}
        {currentStep?.id === "content" ? (
          <FigmooStepContent
            state={state}
            onUpdate={updateState}
            onNext={handleNext}
            onBack={handleBack}
            onStartOver={handleStartOver}
          />
        ) : (
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {/* Header with Progress */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{currentStep?.title}</h1>
                  <p className="text-gray-600 mt-2">{currentStep?.description}</p>
                </div>
                <FigmooProgressBar currentStep={state.step} totalSteps={STEPS.length} />
              </div>

              {/* Step Content */}
              {currentStep?.id === "category" && (
                <FigmooStepCategory state={state} onUpdate={updateState} />
              )}

              {currentStep?.id === "name" && (
                <FigmooStepName state={state} onUpdate={updateState} />
              )}

              {currentStep?.id === "design" && (
                <FigmooStepDesign state={state} onUpdate={updateState} />
              )}

              {currentStep?.id === "final" && (
                <FigmooStepFinal state={state} onUpdate={updateState} />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                >
                  {currentStep?.nextButtonLabel}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingLoading />}>
      <OnboardingContent />
    </Suspense>
  )
}

function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  )
}

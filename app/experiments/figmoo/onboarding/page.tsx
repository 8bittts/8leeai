"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
 * Multi-step website builder configuration inspired by great design patterns
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
    <div className="min-h-screen bg-figmoo-bg">
      <FigmooHeader />

      <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
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
          <div className="mx-auto max-w-xl">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardContent className="p-8">
                {/* Header with Progress */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-figmoo-text">{currentStep?.title}</h1>
                    <p className="mt-2 text-gray-500">{currentStep?.description}</p>
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
                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                  <Button variant="ghost" onClick={handleBack} className="text-gray-600">
                    <ArrowLeftIcon />
                    Back
                  </Button>

                  <Button
                    onClick={handleNext}
                    className="rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                  >
                    {currentStep?.nextButtonLabel}
                    <ArrowRightIcon />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
    <div className="flex min-h-screen items-center justify-center bg-figmoo-bg">
      <div className="text-gray-500">Loading...</div>
    </div>
  )
}

function ArrowLeftIcon() {
  return (
    <svg
      className="mr-1 h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      className="ml-1 h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

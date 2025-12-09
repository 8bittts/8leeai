"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SECTIONS } from "../lib/figmoo-data"
import type { WizardState } from "../lib/figmoo-types"
import { FigmooProgressBar } from "./figmoo-progress-bar"
import { FigmooSitePreview } from "./figmoo-site-preview"

interface StepContentProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
  onNext: () => void
  onBack: () => void
  onStartOver: () => void
}

/**
 * Step Content Component
 * Section builder with live preview panel
 */
export function FigmooStepContent({
  state,
  onUpdate,
  onNext,
  onBack,
  onStartOver,
}: StepContentProps) {
  const defaultSections = SECTIONS.filter((s) => s.defaultEnabled)
  const additionalSections = SECTIONS.filter((s) => !s.defaultEnabled)

  const toggleSection = (sectionId: string) => {
    const newSections = state.enabledSections.includes(sectionId)
      ? state.enabledSections.filter((id) => id !== sectionId)
      : [...state.enabledSections, sectionId]
    onUpdate({ enabledSections: newSections })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left Panel - Section Builder */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardContent className="p-8">
          {/* Header with Progress */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-figmoo-text">Homepage Content</h1>
              <p className="mt-1 text-sm text-gray-600">
                This is just a starting point. You can add more sections after creating your site.
              </p>
            </div>
            <FigmooProgressBar currentStep={2} totalSteps={5} />
          </div>

          {/* Default Sections */}
          <div className="mb-6 space-y-2">
            {defaultSections.map((section) => (
              <SectionToggle
                key={section.id}
                id={section.id}
                name={section.name}
                enabled={state.enabledSections.includes(section.id)}
                onToggle={() => toggleSection(section.id)}
              />
            ))}
          </div>

          {/* Add a Section */}
          <div className="mb-6">
            <p className="mb-3 text-sm font-medium text-gray-700">Add a Section</p>
            <div className="flex flex-wrap gap-2">
              {additionalSections.map((section) => {
                const isSelected = state.enabledSections.includes(section.id)
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-full"
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "cursor-pointer px-3 py-1.5 text-sm transition-all",
                        isSelected
                          ? "border-violet-600 bg-violet-50 text-violet-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      )}
                    >
                      <span className="mr-1 text-gray-600">+</span>
                      {section.name}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onStartOver}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 rounded-sm"
            >
              Start Over
            </button>

            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="text-gray-600">
                <ArrowLeftIcon />
                Back
              </Button>

              <Button
                onClick={onNext}
                className="rounded-lg bg-violet-600 text-white hover:bg-violet-700"
              >
                Design
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Panel - Live Preview */}
      <div className="hidden lg:block">
        <FigmooSitePreview state={state} />
      </div>
    </div>
  )
}

/**
 * Section Toggle Component
 * Individual toggleable section item with checkbox
 */
function SectionToggle({
  id,
  name,
  enabled,
  onToggle,
}: {
  id: string
  name: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 transition-all",
        enabled ? "bg-gray-50" : "bg-white opacity-60"
      )}
    >
      <Checkbox
        id={`section-${id}`}
        checked={enabled}
        onCheckedChange={onToggle}
        className="border-gray-300 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600"
      />
      <Label
        htmlFor={`section-${id}`}
        className={cn(
          "cursor-pointer text-sm font-medium",
          enabled ? "text-figmoo-text" : "text-gray-600"
        )}
      >
        {name}
      </Label>
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

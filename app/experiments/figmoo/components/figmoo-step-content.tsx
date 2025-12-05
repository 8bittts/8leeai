"use client"

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
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Panel - Section Builder */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {/* Header with Progress */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homepage Content</h1>
            <p className="text-gray-600 mt-1 text-sm">
              This is just a starting point. You can add more sections after creating your site.
            </p>
          </div>
          <FigmooProgressBar currentStep={2} totalSteps={5} />
        </div>

        {/* Default Sections */}
        <div className="space-y-2 mb-6">
          {defaultSections.map((section) => (
            <SectionToggle
              key={section.id}
              name={section.name}
              enabled={state.enabledSections.includes(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* Add a Section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Add a Section</p>
          <div className="flex flex-wrap gap-2">
            {additionalSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                  state.enabledSections.includes(section.id)
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="text-gray-400">+</span>
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onStartOver}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            Start Over
          </button>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
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
              onClick={onNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Design
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

      {/* Right Panel - Live Preview */}
      <div className="hidden lg:block">
        <FigmooSitePreview state={state} />
      </div>
    </div>
  )
}

/**
 * Section Toggle Component
 * Individual toggleable section item
 */
function SectionToggle({
  name,
  enabled,
  onToggle,
}: {
  name: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
        enabled ? "bg-gray-50" : "bg-white opacity-60"
      }`}
    >
      <svg
        className={`w-5 h-5 ${enabled ? "text-gray-600" : "text-gray-300"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {enabled ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        )}
      </svg>
      <span className={`text-sm font-medium ${enabled ? "text-gray-900" : "text-gray-400"}`}>
        {name}
      </span>
    </button>
  )
}

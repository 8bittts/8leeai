"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { PasswordGate } from "../_shared/password-gate"
import { FigmooAnimatedShowcase } from "./components/figmoo-animated-showcase"
import { FigmooCategoryCard } from "./components/figmoo-category-card"
import { FigmooHeader } from "./components/figmoo-header"
import { MAIN_CATEGORIES } from "./lib/figmoo-data"

/**
 * Figmoo Landing Page
 * Frictionless website builder experiment
 */
export default function FigmooLandingPage() {
  return (
    <PasswordGate title="Figmoo" sessionKey="figmoo_auth">
      <FigmooContent />
    </PasswordGate>
  )
}

function FigmooContent() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleNext = () => {
    if (selectedCategory) {
      router.push(`/experiments/figmoo/onboarding?category=${selectedCategory}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FigmooHeader />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Panel - Category Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              What do you need a website for?
            </h1>
            <p className="text-gray-600 mb-8">Select the most suitable category below.</p>

            <div className="space-y-4">
              {MAIN_CATEGORIES.map((category) => (
                <FigmooCategoryCard
                  key={category.id}
                  category={category}
                  selected={selectedCategory === category.id}
                  onSelect={() => setSelectedCategory(category.id)}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedCategory}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
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

          {/* Right Panel - Animated Showcase */}
          <div className="hidden lg:block">
            <FigmooAnimatedShowcase />
          </div>
        </div>
      </main>
    </div>
  )
}

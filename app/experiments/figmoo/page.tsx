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
 * Umso-inspired frictionless website builder
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
    <div className="min-h-screen">
      <FigmooHeader />

      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-16 pb-8 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#171a1a] leading-tight mb-6">
              The Easiest Way to Build a Website
            </h1>
            <p className="text-lg sm:text-xl text-[#171a1a]/60 max-w-2xl mx-auto mb-10">
              Create a beautiful website in minutes. No design skills required.
            </p>
          </div>
        </section>

        {/* Category Selection */}
        <section className="pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Panel - Category Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#171a1a]/10 p-8">
                <h2 className="text-2xl font-bold text-[#171a1a] mb-2">
                  What do you need a website for?
                </h2>
                <p className="text-[#171a1a]/60 mb-8">Select the most suitable category below.</p>

                <div className="space-y-3">
                  {MAIN_CATEGORIES.map((category) => (
                    <FigmooCategoryCard
                      key={category.id}
                      category={category}
                      selected={selectedCategory === category.id}
                      onSelect={() => setSelectedCategory(category.id)}
                    />
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!selectedCategory}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#171a1a] text-white font-medium rounded-full hover:bg-[#171a1a]/90 focus:outline-none focus:ring-2 focus:ring-[#171a1a] focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Build your website
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
        </section>
      </main>
    </div>
  )
}

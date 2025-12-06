"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FigmooCategoryCard } from "./components/figmoo-category-card"
import { FigmooHeader } from "./components/figmoo-header"
import { MAIN_CATEGORIES } from "./lib/figmoo-data"

/**
 * Figmoo Landing Page
 * Frictionless website builder entry point inspired by great product design
 */
export default function FigmooLandingPage() {
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

      <main id="main-content" className="px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-figmoo-text sm:text-5xl lg:text-6xl">
            The Easiest Way To Build a Website.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            You don&apos;t need any experience to build a beautiful website for yourself, your small
            business, or anything else. Don&apos;t believe us? See for yourself!
          </p>
        </section>

        {/* Category Selection */}
        <section className="mx-auto mt-12 max-w-xl">
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-figmoo-text">
                What do you need a website for?
              </h2>
              <p className="mt-2 text-gray-500">Select the most suitable category below.</p>

              <div className="mt-8 space-y-3">
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
                <Button
                  onClick={handleNext}
                  disabled={!selectedCategory}
                  size="lg"
                  className="w-full rounded-xl bg-figmoo-button py-6 text-base font-medium text-white hover:bg-figmoo-button/90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                >
                  Next
                  <ArrowRightIcon />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mx-auto mt-16 max-w-4xl text-center">
          <p className="text-sm text-gray-400">
            Made with Figmoo - A frictionless website builder experiment
          </p>
        </footer>
      </main>
    </div>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      className="ml-2 h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

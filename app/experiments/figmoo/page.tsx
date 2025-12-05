"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FigmooAnimatedShowcase } from "./components/figmoo-animated-showcase"
import { FigmooCategoryCard } from "./components/figmoo-category-card"
import { FigmooHeader } from "./components/figmoo-header"
import { MAIN_CATEGORIES } from "./lib/figmoo-data"

const CORRECT_PASSWORD = "booya"
const SESSION_KEY = "figmoo_auth"

/**
 * Figmoo Landing Page
 * Frictionless website builder experiment
 * Password protected (password: booya)
 */
export default function FigmooLandingPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Check sessionStorage on mount
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem(SESSION_KEY)
    if (sessionAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(SESSION_KEY, "true")
      setError("")
    } else {
      setError("Incorrect password")
      setPassword("")
    }
  }

  const handleNext = () => {
    if (selectedCategory) {
      router.push(`/experiments/figmoo/onboarding?category=${selectedCategory}`)
    }
  }

  // Show nothing while checking session
  if (isLoading) {
    return null
  }

  // Show password form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white border-2 border-purple-500 p-8 rounded-2xl shadow-lg">
            <div className="flex justify-center mb-6">
              <svg
                className="w-12 h-12 text-purple-600"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <path d="M8 8h16v16H8V8z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M12 12h8v8h-8v-8z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-purple-600 text-2xl mb-2 font-semibold text-center">Figmoo</h1>
            <p className="text-gray-500 text-sm mb-6 text-center">Frictionless Website Builder</p>
            <p className="text-gray-400 text-xs mb-6 text-center">Enter password to access</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  // biome-ignore lint/a11y/noAutofocus: Password input should auto-focus for better UX on password gate
                  autoFocus={true}
                  className="w-full bg-gray-50 text-gray-900 border-2 border-purple-200 px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Access
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Show main interface if authenticated
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

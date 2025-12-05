import Link from "next/link"

/**
 * Figmoo Header Component
 * Navigation bar with logo and links
 */
export function FigmooHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/experiments/figmoo"
            className="flex items-center gap-2 text-gray-900 hover:text-purple-600 transition-colors"
          >
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M8 8h16v16H8V8z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 12h8v8h-8v-8z" fill="currentColor" />
            </svg>
            <span className="font-semibold text-lg">Figmoo</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Documentation
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Changelog
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Feedback
            </Link>
            <Link
              href="/experiments/figmoo/signup"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/experiments/figmoo/signup"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign up
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="sm:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

import Link from "next/link"

/**
 * Figmoo 404 Not Found Page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-figmoo-surface flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-figmoo-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-figmoo-text mb-2">Page not found</h2>
        <p className="text-figmoo-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/experiments/figmoo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-figmoo-accent text-white font-medium rounded-lg hover:bg-figmoo-accent-hover transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Figmoo
        </Link>
      </div>
    </div>
  )
}

import Link from "next/link"

/**
 * Figmoo Header Component
 * Umso-inspired minimal navigation
 * Colors: bg #faf7f4, text #2c2c2c, buttons #17161a
 */
export function FigmooHeader() {
  return (
    <header className="bg-[#faf7f4]">
      <div className="max-w-[1280px] mx-auto px-[30px]">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link
            href="/experiments/figmoo"
            className="text-[#2c2c2c] font-semibold text-xl hover:opacity-70 transition-opacity"
          >
            figmoo
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-8">
            <Link
              href="#"
              className="text-sm text-[#3c3c3c] hover:text-[#2c2c2c] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-sm text-[#3c3c3c] hover:text-[#2c2c2c] transition-colors"
            >
              Examples
            </Link>
            <Link
              href="#"
              className="text-sm text-[#3c3c3c] hover:text-[#2c2c2c] transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/experiments/figmoo/signup"
              className="text-sm text-[#3c3c3c] hover:text-[#2c2c2c] transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/experiments/figmoo/signup"
              className="inline-flex items-center px-5 py-2.5 bg-[#17161a] text-white text-sm font-medium rounded-[11px] hover:bg-[#17161a]/90 transition-colors"
            >
              Build your website
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="sm:hidden p-2 text-[#3c3c3c] hover:text-[#2c2c2c]"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

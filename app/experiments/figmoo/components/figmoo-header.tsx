"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * Figmoo Header
 * Clean navigation with modern design patterns
 */
export function FigmooHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-figmoo-bg/95 backdrop-blur supports-[backdrop-filter]:bg-figmoo-bg/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/experiments/figmoo"
          className="flex items-center gap-2 text-figmoo-text"
        >
          <FigmooLogo />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/experiments/figmoo"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-figmoo-text"
          >
            Documentation
          </Link>
          <Link
            href="/experiments/figmoo"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-figmoo-text"
          >
            Changelog
          </Link>
          <Link
            href="/experiments/figmoo"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-figmoo-text"
          >
            Feedback
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-figmoo-text hover:bg-transparent"
            asChild
          >
            <Link href="/experiments/figmoo/signup">Log in</Link>
          </Button>
          <Button
            size="sm"
            className="rounded-lg bg-violet-600 text-white hover:bg-violet-700"
            asChild
          >
            <Link href="/experiments/figmoo/signup">
              Sign up
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function FigmooLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Figmoo logo"
      role="img"
    >
      <path
        d="M6 8C6 5.79086 7.79086 4 10 4H22C24.2091 4 26 5.79086 26 8V24C26 26.2091 24.2091 28 22 28H10C7.79086 28 6 26.2091 6 24V8Z"
        fill="currentColor"
      />
      <path d="M11 11H21" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 16H21" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 21H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  )
}

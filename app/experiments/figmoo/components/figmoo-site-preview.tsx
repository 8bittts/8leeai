"use client"

import { Card } from "@/components/ui/card"
import { FONTS, SECTIONS, THEMES } from "../lib/figmoo-data"
import type { WizardState } from "../lib/figmoo-types"

interface SitePreviewProps {
  state: WizardState
}

/**
 * Site Preview Component
 * Live preview of the website being built
 */
export function FigmooSitePreview({ state }: SitePreviewProps) {
  const selectedFont = FONTS.find((f) => f.id === state.selectedFont)
  const selectedTheme = THEMES.find((t) => t.id === state.selectedTheme)

  const enabledSectionData = SECTIONS.filter((s) => state.enabledSections.includes(s.id))

  return (
    <Card className="overflow-hidden border-gray-200 bg-white shadow-lg">
      {/* Browser Chrome */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-100 px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800"
            aria-label="Go back"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800"
            aria-label="Go forward"
          >
            <ChevronRightIcon />
          </button>
        </div>

        <div className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-center text-sm text-gray-600">
          example.com
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800"
            aria-label="Add bookmark"
          >
            <PlusIcon />
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-800"
            aria-label="Bookmark"
          >
            <BookmarkIcon />
          </button>
        </div>
      </div>

      {/* Website Preview Content */}
      <div
        className="h-[500px] overflow-y-auto bg-[var(--preview-bg)] font-[family-name:var(--preview-font)]"
        style={
          {
            "--preview-font": selectedFont?.family || "system-ui",
            "--preview-bg": selectedTheme?.colors[3] || "#FFFFFF",
            "--preview-primary": selectedTheme?.colors[0] || "#1A1A1A",
            "--preview-accent": selectedTheme?.colors[2] || "#7C3AED",
          } as React.CSSProperties
        }
      >
        {/* Navigation Preview */}
        <nav className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <span className="font-semibold text-[var(--preview-primary)]">
            {state.siteName || "Your Site"}
          </span>
          <div className="hidden items-center gap-4 text-sm sm:flex">
            <span className="text-gray-600">Features</span>
            <span className="text-gray-600">Another One</span>
            <span className="text-gray-600">Team</span>
            <span className="rounded-full border border-[var(--preview-accent)] px-3 py-1 text-xs text-[var(--preview-accent)]">
              Learn More
            </span>
            <span className="rounded-full bg-[var(--preview-primary)] px-3 py-1 text-xs text-white">
              Get Started
            </span>
          </div>
        </nav>

        {/* Sections */}
        <div className="space-y-8 p-6">
          {enabledSectionData.map((section) => (
            <PreviewSection key={section.id} sectionId={section.id} />
          ))}

          {enabledSectionData.length === 0 && (
            <div className="py-12 text-center text-gray-600">
              Select sections to preview your website
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

/**
 * Preview Section Component
 * Renders a preview of each section type
 * Uses CSS custom properties from parent for theming
 */
function PreviewSection({ sectionId }: { sectionId: string }) {
  switch (sectionId) {
    case "hero":
      return (
        <div className="py-8">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="mb-4 text-3xl font-bold text-[var(--preview-primary)]">
                Welcome to Your Beautiful{" "}
                <span className="text-[var(--preview-accent)]">new Website</span>
              </h1>
              <p className="mb-6 text-gray-600">
                Tell your visitors more about what you do and why they should choose you.
              </p>
              <div className="flex gap-3">
                <span className="rounded-lg bg-[var(--preview-accent)] px-4 py-2 text-sm text-white">
                  Learn More
                </span>
                <span className="rounded-lg bg-[var(--preview-primary)] px-4 py-2 text-sm text-white">
                  Get Started
                </span>
              </div>
            </div>
            <div className="h-48 rounded-xl bg-gradient-to-br from-[var(--preview-accent)]/30 to-[var(--preview-primary)]/30" />
          </div>
        </div>
      )

    case "logos":
      return (
        <div className="border-y border-gray-100 py-6 text-center">
          <p className="mb-4 text-xs text-gray-600">Trusted by imaginary Companies</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <span>Podium</span>
            <span>M.C.P.</span>
            <span>EPISM</span>
            <span>lecoid</span>
            <span>Unwined</span>
            <span>Pallace</span>
          </div>
        </div>
      )

    case "features":
      return (
        <div className="py-8">
          <h2 className="mb-2 text-xl font-bold text-[var(--preview-primary)]">Grid</h2>
          <p className="mb-6 text-sm text-gray-600">
            Great for displaying multiple features and things like that.
          </p>
          <div className="h-24 rounded-lg bg-[var(--preview-accent)]" />
        </div>
      )

    case "team":
      return (
        <div className="py-8">
          <h2 className="mb-4 text-xl font-bold text-[var(--preview-primary)]">Meet the Team</h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={`team-${i}`} className="text-center">
                <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-[var(--preview-accent)]/30" />
                <p className="text-sm font-medium text-[var(--preview-primary)]">Team Member</p>
                <p className="text-xs text-gray-600">Role</p>
              </div>
            ))}
          </div>
        </div>
      )

    case "form":
      return (
        <div className="py-8">
          <h2 className="mb-4 text-xl font-bold text-[var(--preview-primary)]">Get in Touch</h2>
          <div className="max-w-sm space-y-3">
            <div className="h-10 rounded-lg bg-gray-100" />
            <div className="h-10 rounded-lg bg-gray-100" />
            <div className="h-24 rounded-lg bg-gray-100" />
            <div className="h-10 rounded-lg bg-[var(--preview-accent)]" />
          </div>
        </div>
      )

    case "tiered-pricing":
    case "single-pricing":
      return (
        <div className="py-8">
          <h2 className="mb-4 text-xl font-bold text-[var(--preview-primary)]">Pricing</h2>
          <div className="grid grid-cols-3 gap-4">
            {["Basic", "Pro", "Enterprise"].map((plan) => (
              <div key={plan} className="rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm font-medium text-[var(--preview-primary)]">{plan}</p>
                <p className="my-2 text-2xl font-bold text-[var(--preview-accent)]">$99</p>
                <div className="space-y-1">
                  <div className="h-2 rounded bg-gray-100" />
                  <div className="h-2 rounded bg-gray-100" />
                  <div className="h-2 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case "testimonials":
    case "testimonial":
    case "reviews":
      return (
        <div className="py-8">
          <h2 className="mb-4 text-xl font-bold text-[var(--preview-primary)]">What People Say</h2>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-6">
            <p className="mb-4 italic text-gray-600">
              "This is an amazing product that has changed how we work!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--preview-accent)]/30" />
              <div>
                <p className="text-sm font-medium text-[var(--preview-primary)]">Happy Customer</p>
                <p className="text-xs text-gray-600">CEO, Company</p>
              </div>
            </div>
          </div>
        </div>
      )

    case "faq":
      return (
        <div className="py-8">
          <h2 className="mb-4 text-xl font-bold text-[var(--preview-primary)]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {["How does it work?", "What's included?", "Can I cancel?"].map((q) => (
              <div key={q} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-[var(--preview-primary)]">{q}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case "stats":
      return (
        <div className="py-8">
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { value: "100+", label: "Customers" },
              { value: "99%", label: "Uptime" },
              { value: "24/7", label: "Support" },
              { value: "5x", label: "Faster" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-[var(--preview-accent)]">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return (
        <div className="py-8">
          <div className="flex h-32 items-center justify-center rounded-lg bg-[var(--preview-accent)]/10 text-sm text-gray-600">
            {sectionId.replace(/-/g, " ")} section
          </div>
        </div>
      )
  }
}

function ChevronLeftIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
  )
}

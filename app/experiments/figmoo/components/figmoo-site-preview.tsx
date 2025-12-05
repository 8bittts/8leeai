"use client"

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Browser Chrome */}
      <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
        <div className="flex gap-2">
          <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Go back">
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
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            aria-label="Go forward"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex-1 bg-white rounded-full px-4 py-1.5 text-sm text-gray-400 text-center border border-gray-200">
          example.com
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            aria-label="Add bookmark"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Bookmark">
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
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Website Preview Content */}
      <div
        className="h-[500px] overflow-y-auto"
        style={{
          fontFamily: selectedFont?.family || "system-ui",
          backgroundColor: selectedTheme?.colors[3] || "#FFFFFF",
        }}
      >
        {/* Navigation Preview */}
        <nav className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <span className="font-semibold" style={{ color: selectedTheme?.colors[0] || "#1A1A1A" }}>
            {state.siteName || "Your Site"}
          </span>
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <span className="text-gray-500">Features</span>
            <span className="text-gray-500">Another One</span>
            <span className="text-gray-500">Team</span>
            <span
              className="px-3 py-1 rounded-full border text-xs"
              style={{
                borderColor: selectedTheme?.colors[2] || "#7C3AED",
                color: selectedTheme?.colors[2] || "#7C3AED",
              }}
            >
              Learn More
            </span>
            <span
              className="px-3 py-1 rounded-full text-white text-xs"
              style={{ backgroundColor: selectedTheme?.colors[0] || "#7C3AED" }}
            >
              Get Started
            </span>
          </div>
        </nav>

        {/* Sections */}
        <div className="p-6 space-y-8">
          {enabledSectionData.map((section) => (
            <PreviewSection key={section.id} sectionId={section.id} theme={selectedTheme} />
          ))}

          {enabledSectionData.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Select sections to preview your website
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Preview Section Component
 * Renders a preview of each section type
 */
function PreviewSection({ sectionId, theme }: { sectionId: string; theme?: { colors: string[] } }) {
  const primaryColor = theme?.colors[0] || "#1A1A1A"
  const accentColor = theme?.colors[2] || "#7C3AED"

  switch (sectionId) {
    case "hero":
      return (
        <div className="py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
                Welcome to Your Beautiful <span style={{ color: accentColor }}>new Website</span>
              </h1>
              <p className="text-gray-600 mb-6">
                Tell your visitors more about what you do and why they should choose you.
              </p>
              <div className="flex gap-3">
                <span
                  className="px-4 py-2 rounded-lg text-white text-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  Learn More
                </span>
                <span
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                >
                  Get Started
                </span>
              </div>
            </div>
            <div
              className="rounded-xl h-48"
              style={{
                background: `linear-gradient(135deg, ${accentColor}30 0%, ${primaryColor}30 100%)`,
              }}
            />
          </div>
        </div>
      )

    case "logos":
      return (
        <div className="py-6 text-center border-y border-gray-100">
          <p className="text-xs text-gray-400 mb-4">Trusted by imaginary Companies</p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
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
          <h2 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
            Grid
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Great for displaying multiple features and things like that.
          </p>
          <div className="h-24 rounded-lg" style={{ backgroundColor: accentColor }} />
        </div>
      )

    case "team":
      return (
        <div className="py-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
            Meet the Team
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: `${accentColor}30` }}
                />
                <p className="text-sm font-medium" style={{ color: primaryColor }}>
                  Team Member
                </p>
                <p className="text-xs text-gray-400">Role</p>
              </div>
            ))}
          </div>
        </div>
      )

    case "form":
      return (
        <div className="py-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
            Get in Touch
          </h2>
          <div className="space-y-3 max-w-sm">
            <div className="h-10 rounded-lg bg-gray-100" />
            <div className="h-10 rounded-lg bg-gray-100" />
            <div className="h-24 rounded-lg bg-gray-100" />
            <div className="h-10 rounded-lg" style={{ backgroundColor: accentColor }} />
          </div>
        </div>
      )

    case "tiered-pricing":
    case "single-pricing":
      return (
        <div className="py-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
            Pricing
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {["Basic", "Pro", "Enterprise"].map((plan) => (
              <div key={plan} className="p-4 rounded-lg border border-gray-200 text-center">
                <p className="font-medium text-sm" style={{ color: primaryColor }}>
                  {plan}
                </p>
                <p className="text-2xl font-bold my-2" style={{ color: accentColor }}>
                  $99
                </p>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-100 rounded" />
                  <div className="h-2 bg-gray-100 rounded" />
                  <div className="h-2 bg-gray-100 rounded" />
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
          <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
            What People Say
          </h2>
          <div className="p-6 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-gray-600 italic mb-4">
              "This is an amazing product that has changed how we work!"
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: `${accentColor}30` }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: primaryColor }}>
                  Happy Customer
                </p>
                <p className="text-xs text-gray-400">CEO, Company</p>
              </div>
            </div>
          </div>
        </div>
      )

    case "faq":
      return (
        <div className="py-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {["How does it work?", "What's included?", "Can I cancel?"].map((q) => (
              <div key={q} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-sm font-medium" style={{ color: primaryColor }}>
                  {q}
                </p>
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
                <p className="text-2xl font-bold" style={{ color: accentColor }}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return (
        <div className="py-8">
          <div
            className="h-32 rounded-lg flex items-center justify-center text-sm text-gray-400"
            style={{ backgroundColor: `${accentColor}10` }}
          >
            {sectionId.replace(/-/g, " ")} section
          </div>
        </div>
      )
  }
}

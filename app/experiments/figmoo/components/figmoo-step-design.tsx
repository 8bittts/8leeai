"use client"

import { useState } from "react"
import { FONTS, THEMES } from "../lib/figmoo-data"
import type { WizardState } from "../lib/figmoo-types"

interface StepDesignProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

/**
 * Step Design Component
 * Font and theme selection
 */
export function FigmooStepDesign({ state, onUpdate }: StepDesignProps) {
  const [fontPage, setFontPage] = useState(0)
  const [themePage, setThemePage] = useState(0)

  const fontsPerPage = 4
  const themesPerPage = 16

  const visibleFonts = FONTS.slice(fontPage * fontsPerPage, (fontPage + 1) * fontsPerPage)
  const visibleThemes = THEMES.slice(themePage * themesPerPage, (themePage + 1) * themesPerPage)

  const totalFontPages = Math.ceil(FONTS.length / fontsPerPage)
  const totalThemePages = Math.ceil(THEMES.length / themesPerPage)

  return (
    <div className="space-y-8">
      {/* Font Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500">Fonts</h3>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setFontPage(Math.max(0, fontPage - 1))}
              disabled={fontPage === 0}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              aria-label="Previous fonts"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setFontPage(Math.min(totalFontPages - 1, fontPage + 1))}
              disabled={fontPage >= totalFontPages - 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              aria-label="Next fonts"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {visibleFonts.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => onUpdate({ selectedFont: font.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                state.selectedFont === font.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-lg font-semibold mb-1" style={{ fontFamily: font.family }}>
                {font.name}
              </p>
              <p className="text-xs text-gray-400">Body Text Font</p>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500">Themes</h3>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setThemePage(Math.max(0, themePage - 1))}
              disabled={themePage === 0}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              aria-label="Previous themes"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setThemePage(Math.min(totalThemePages - 1, themePage + 1))}
              disabled={themePage >= totalThemePages - 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
              aria-label="Next themes"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {visibleThemes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onUpdate({ selectedTheme: theme.id })}
              className={`p-2 rounded-full border-2 transition-all ${
                state.selectedTheme === theme.id
                  ? "border-purple-600"
                  : "border-transparent hover:border-gray-200"
              }`}
              aria-label={`Select ${theme.name} theme`}
            >
              <div className="flex items-center justify-center gap-0.5 px-2 py-1 rounded-full bg-gray-100">
                {theme.colors.slice(0, 4).map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

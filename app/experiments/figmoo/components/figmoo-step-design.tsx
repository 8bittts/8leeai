"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { FONTS, THEMES } from "../lib/figmoo-data"
import type { WizardState } from "../lib/figmoo-types"

interface StepDesignProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
}

/**
 * Step Design Component
 * Font and theme color selection with clean UI patterns
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
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-figmoo-muted">Fonts</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setFontPage(Math.max(0, fontPage - 1))}
              disabled={fontPage === 0}
              className="text-figmoo-muted hover:text-figmoo-text disabled:opacity-30"
              aria-label="Previous fonts"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setFontPage(Math.min(totalFontPages - 1, fontPage + 1))}
              disabled={fontPage >= totalFontPages - 1}
              className="text-figmoo-muted hover:text-figmoo-text disabled:opacity-30"
              aria-label="Next fonts"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {visibleFonts.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => onUpdate({ selectedFont: font.id })}
              aria-label={`Select ${font.name} font`}
              aria-pressed={state.selectedFont === font.id}
              className={cn(
                "rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-figmoo-accent focus:ring-offset-2",
                state.selectedFont === font.id
                  ? "border-figmoo-accent bg-figmoo-accent-light"
                  : "border-figmoo-border bg-white hover:border-figmoo-border-hover"
              )}
              style={{ "--preview-font": font.family } as React.CSSProperties}
            >
              <p className="mb-1 text-lg font-semibold font-[family-name:var(--preview-font)]">
                {font.name}
              </p>
              <p className="text-xs text-figmoo-muted">Body Text Font</p>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-figmoo-muted">Themes</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setThemePage(Math.max(0, themePage - 1))}
              disabled={themePage === 0}
              className="text-figmoo-muted hover:text-figmoo-text disabled:opacity-30"
              aria-label="Previous themes"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setThemePage(Math.min(totalThemePages - 1, themePage + 1))}
              disabled={themePage >= totalThemePages - 1}
              className="text-figmoo-muted hover:text-figmoo-text disabled:opacity-30"
              aria-label="Next themes"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {visibleThemes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onUpdate({ selectedTheme: theme.id })}
              className={cn(
                "rounded-full border-2 p-2 transition-all",
                state.selectedTheme === theme.id
                  ? "border-figmoo-accent"
                  : "border-transparent hover:border-figmoo-border"
              )}
              aria-label={`Select ${theme.name} theme`}
            >
              <div className="flex items-center justify-center gap-0.5 rounded-full bg-figmoo-surface-hover px-2 py-1">
                {theme.colors.slice(0, 4).map((color, i) => (
                  <div
                    key={`${theme.id}-color-${i}`}
                    className="h-4 w-4 rounded-full bg-[var(--swatch-color)]"
                    style={{ "--swatch-color": color } as React.CSSProperties}
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

function ChevronLeftIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

"use client"

import { useTheme } from "@/hooks/use-theme"

/**
 * ThemeSwitcher
 *
 * Floating button that cycles through available themes.
 * Positioned in bottom-right corner with theme-aware styling.
 */
export function ThemeSwitcher() {
  const { currentTheme, setTheme, availableThemes, theme } = useTheme()

  const cycleTheme = () => {
    const currentIndex = availableThemes.findIndex((t) => t.id === currentTheme)
    const nextIndex = (currentIndex + 1) % availableThemes.length
    const nextTheme = availableThemes[nextIndex]
    if (nextTheme) {
      setTheme(nextTheme.id)
    }
  }

  // Theme-specific icon display
  const getThemeIcon = () => {
    switch (currentTheme) {
      case "terminal":
        return (
          <span className="text-xs" aria-hidden="true">
            {">_"}
          </span>
        )
      case "8bit":
        return (
          <span className="text-xs font-bold" aria-hidden="true">
            8B
          </span>
        )
      default:
        return (
          <span className="text-xs" aria-hidden="true">
            TH
          </span>
        )
    }
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center bg-theme-bg text-theme-fg border-theme-border transition-all duration-150 hover:bg-theme-primary hover:text-theme-bg focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2 focus:ring-offset-theme-bg"
      style={{
        borderWidth: "var(--theme-border-width)",
        borderStyle: "var(--theme-border-style)",
        borderRadius: "var(--theme-border-radius)",
        boxShadow: "var(--theme-shadow)",
      }}
      aria-label={`Current theme: ${theme.name}. Click to switch theme.`}
      title={`Theme: ${theme.name} - Click to cycle`}
    >
      {getThemeIcon()}
    </button>
  )
}

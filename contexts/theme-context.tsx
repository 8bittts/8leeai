"use client"

import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { DEFAULT_THEME, getTheme, isValidThemeId, THEME_STORAGE_KEY, themeList } from "@/lib/themes"
import type { ThemeContextValue, ThemeId } from "@/lib/themes/types"

/** Theme context - null when accessed outside provider */
export const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: React.ReactNode
  /** Optional default theme override */
  defaultTheme?: ThemeId
}

/**
 * ThemeProvider
 *
 * Wraps the application to provide theme context.
 * Handles localStorage persistence and SSR-safe initialization.
 */
export function ThemeProvider({ children, defaultTheme = DEFAULT_THEME }: ThemeProviderProps) {
  // Initialize with default, will sync from localStorage in useEffect
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(defaultTheme)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load theme from localStorage on mount (client-side only)
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && isValidThemeId(stored)) {
      setCurrentTheme(stored)
    }
    setIsHydrated(true)
  }, [])

  // Apply theme to document when it changes
  useEffect(() => {
    if (!isHydrated) return

    const theme = getTheme(currentTheme)

    // Set data-theme attribute for CSS selectors
    document.documentElement.setAttribute("data-theme", currentTheme)

    // Apply CSS custom properties
    const root = document.documentElement
    root.style.setProperty("--theme-bg", theme.colors.background)
    root.style.setProperty("--theme-fg", theme.colors.foreground)
    root.style.setProperty("--theme-primary", theme.colors.primary)
    root.style.setProperty("--theme-secondary", theme.colors.secondary)
    root.style.setProperty("--theme-accent", theme.colors.accent)
    root.style.setProperty("--theme-muted", theme.colors.muted)
    root.style.setProperty("--theme-border", theme.colors.border)
    root.style.setProperty("--theme-success", theme.colors.success)
    root.style.setProperty("--theme-error", theme.colors.error)
    root.style.setProperty("--theme-warning", theme.colors.warning)

    // Typography
    root.style.setProperty("--theme-font-primary", theme.fonts.primary)
    root.style.setProperty("--theme-font-mono", theme.fonts.mono)
    root.style.setProperty("--theme-font-size", theme.fonts.sizeBase)
    root.style.setProperty("--theme-line-height", theme.fonts.lineHeight)

    // Borders
    root.style.setProperty("--theme-border-width", theme.borders.width)
    root.style.setProperty("--theme-border-style", theme.borders.style)
    root.style.setProperty("--theme-border-radius", theme.borders.radius)

    // Shadows
    root.style.setProperty("--theme-shadow", theme.shadows.default)
    root.style.setProperty("--theme-shadow-hover", theme.shadows.hover)
    root.style.setProperty("--theme-shadow-active", theme.shadows.active)

    // Animation
    root.style.setProperty("--theme-duration", theme.animation.duration)
    root.style.setProperty("--theme-timing", theme.animation.timing)
  }, [currentTheme, isHydrated])

  // Theme setter with localStorage persistence
  const setTheme = useCallback((id: ThemeId) => {
    setCurrentTheme(id)
    localStorage.setItem(THEME_STORAGE_KEY, id)
  }, [])

  // Reset to default terminal theme
  const resetTheme = useCallback(() => {
    setCurrentTheme(DEFAULT_THEME)
    localStorage.removeItem(THEME_STORAGE_KEY)
  }, [])

  // Memoize context value
  const value = useMemo<ThemeContextValue>(
    () => ({
      currentTheme,
      theme: getTheme(currentTheme),
      setTheme,
      resetTheme,
      availableThemes: themeList,
    }),
    [currentTheme, setTheme, resetTheme]
  )

  // Prevent flash by not rendering until hydrated
  // Use a wrapper div that applies theme classes for SSR
  return (
    <ThemeContext.Provider value={value}>
      <div
        data-theme={currentTheme}
        className="contents"
        style={
          isHydrated
            ? undefined
            : {
                // SSR fallback styles (terminal theme)
                ["--theme-bg" as string]: "#000000",
                ["--theme-fg" as string]: "#22c55e",
              }
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

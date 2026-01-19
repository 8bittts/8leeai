"use client"

import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import {
  DEFAULT_THEME,
  getTheme,
  getThemeStyleTags,
  isValidThemeId,
  THEME_STORAGE_KEY,
  themeList,
} from "@/lib/themes"
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

    const themeStyles = getThemeStyleTags(currentTheme)
    if (themeStyles.length > 0) {
      document.documentElement.setAttribute("data-theme-style", themeStyles.join(" "))
    } else {
      document.documentElement.removeAttribute("data-theme-style")
    }

    // Apply CSS custom properties in single batch (avoids 20+ reflows)
    const root = document.documentElement
    root.style.cssText = `
      --theme-bg: ${theme.colors.background};
      --theme-fg: ${theme.colors.foreground};
      --theme-primary: ${theme.colors.primary};
      --theme-secondary: ${theme.colors.secondary};
      --theme-accent: ${theme.colors.accent};
      --theme-muted: ${theme.colors.muted};
      --theme-border: ${theme.colors.border};
      --theme-error: ${theme.colors.error};
      --theme-font-primary: ${theme.fonts.primary};
      --theme-font-mono: ${theme.fonts.mono};
      --theme-font-size: ${theme.fonts.sizeBase};
      --theme-line-height: ${theme.fonts.lineHeight};
      --theme-border-width: ${theme.borders.width};
      --theme-border-style: ${theme.borders.style};
      --theme-border-radius: ${theme.borders.radius};
      --theme-shadow: ${theme.shadows.default};
      --theme-shadow-hover: ${theme.shadows.hover};
      --theme-shadow-active: ${theme.shadows.active};
      --theme-duration: ${theme.animation.duration};
      --theme-timing: ${theme.animation.timing};
    `
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
  // Use CSS class for SSR fallback instead of inline styles
  return (
    <ThemeContext.Provider value={value}>
      <div
        data-theme={currentTheme}
        className={isHydrated ? "contents" : "contents ssr-theme-fallback"}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

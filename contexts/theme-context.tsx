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

function applyThemeToDocument(id: ThemeId) {
  if (typeof document === "undefined") return

  const theme = getTheme(id)
  const root = document.documentElement

  root.setAttribute("data-theme", id)

  const themeStyles = getThemeStyleTags(id)
  if (themeStyles.length > 0) {
    root.setAttribute("data-theme-style", themeStyles.join(" "))
  } else {
    root.removeAttribute("data-theme-style")
  }

  const themeVariables: Record<string, string> = {
    "--theme-bg": theme.colors.background,
    "--theme-fg": theme.colors.foreground,
    "--theme-primary": theme.colors.primary,
    "--theme-accent": theme.colors.accent,
    "--theme-muted": theme.colors.muted,
    "--theme-border": theme.colors.border,
    "--theme-error": theme.colors.error,
    "--theme-font-primary": theme.fonts.primary,
    "--theme-border-width": theme.borders.width,
    "--theme-border-style": theme.borders.style,
    "--theme-shadow-hover": theme.shadows.hover,
  }

  for (const [variable, variableValue] of Object.entries(themeVariables)) {
    root.style.setProperty(variable, variableValue)
  }
}

/**
 * ThemeProvider
 *
 * Wraps the application to provide theme context.
 * Handles localStorage persistence and SSR-safe initialization.
 */
export function ThemeProvider({ children, defaultTheme = DEFAULT_THEME }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => defaultTheme)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage and apply DOM mutations in one pass — no effect chain.
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    const initial = stored && isValidThemeId(stored) ? stored : defaultTheme
    applyThemeToDocument(initial)
    setCurrentTheme(initial)
    setIsHydrated(true)
  }, [defaultTheme])

  const setTheme = useCallback((id: ThemeId) => {
    applyThemeToDocument(id)
    setCurrentTheme(id)
    localStorage.setItem(THEME_STORAGE_KEY, id)
  }, [])

  const resetTheme = useCallback(() => {
    applyThemeToDocument(DEFAULT_THEME)
    setCurrentTheme(DEFAULT_THEME)
    localStorage.removeItem(THEME_STORAGE_KEY)
  }, [])

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

  return (
    <ThemeContext value={value}>
      <div
        data-theme={currentTheme}
        className={isHydrated ? "contents" : "contents ssr-theme-fallback"}
      >
        {children}
      </div>
    </ThemeContext>
  )
}

"use client"

import { useContext } from "react"
import { ThemeContext } from "@/contexts/theme-context"
import { DEFAULT_THEME, getTheme } from "@/lib/themes"
import type { ThemeContextValue } from "@/lib/themes/types"

/**
 * useTheme Hook
 *
 * Access the current theme and theme-switching functionality.
 * Must be used within a ThemeProvider.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentTheme, setTheme, theme } = useTheme()
 *
 *   return (
 *     <button onClick={() => setTheme('8bit')}>
 *       Current: {theme.name}
 *     </button>
 *   )
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    // Fallback for SSR or when used outside provider
    // This provides sensible defaults without crashing
    return {
      currentTheme: DEFAULT_THEME,
      theme: getTheme(DEFAULT_THEME),
      setTheme: () => {
        console.warn("useTheme: setTheme called outside ThemeProvider")
      },
      availableThemes: [],
    }
  }

  return context
}

/**
 * Theme Registry
 *
 * Central export point for all theme definitions and utilities.
 */

import { eightBitTheme } from "./theme-8bit"
import { terminalTheme } from "./theme-terminal"
import type { ThemeDefinition, ThemeId } from "./types"

/** All available themes */
export const themes: Record<ThemeId, ThemeDefinition> = {
  terminal: terminalTheme,
  "8bit": eightBitTheme,
}

/** Array of all theme definitions */
export const themeList: ThemeDefinition[] = Object.values(themes)

/** Default theme ID */
export const DEFAULT_THEME: ThemeId = "terminal"

/** Get theme by ID with fallback to default */
export function getTheme(id: ThemeId): ThemeDefinition {
  return themes[id] ?? themes[DEFAULT_THEME]
}

/** Check if a string is a valid theme ID */
export function isValidThemeId(id: string): id is ThemeId {
  return id in themes
}

/** localStorage key for theme persistence */
export const THEME_STORAGE_KEY = "8lee-theme"

// Re-export types
export type { ThemeColors, ThemeContextValue, ThemeDefinition, ThemeFonts, ThemeId } from "./types"

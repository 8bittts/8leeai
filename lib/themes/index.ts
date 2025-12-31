/**
 * Theme Registry
 *
 * Central export point for all theme definitions and utilities.
 *
 * SEPARATION OF CONCERNS:
 * - Each theme is a self-contained file in lib/themes/theme-{name}.ts
 * - Themes define ONLY colors, fonts, borders, shadows, and animations
 * - No theme should modify core app behavior or add dependencies
 * - To remove a theme: delete the file, remove import, remove from themes object
 */

import { eightBitTheme } from "./theme-8bit"
// Tier 3: Experimental
import { accessibilityTheme } from "./theme-accessibility"
import { brutalistTheme } from "./theme-brutalist"
// Tier 4: Editor Classics
import { catppuccinTheme } from "./theme-catppuccin"
import { christmasTheme } from "./theme-christmas"
import { cyberpunkTheme } from "./theme-cyberpunk"
import { draculaTheme } from "./theme-dracula"
import { forestTheme } from "./theme-forest"
// Tier 1: Fun and Playful
import { gameboyTheme } from "./theme-gameboy"
import { gruvboxTheme } from "./theme-gruvbox"
// Tier 2: Seasonal/Event
import { halloweenTheme } from "./theme-halloween"
import { matrixTheme } from "./theme-matrix"
import { minimalTheme } from "./theme-minimal"
import { monokaiTheme } from "./theme-monokai"
import { nordTheme } from "./theme-nord"
import { oceanTheme } from "./theme-ocean"
import { paperTheme } from "./theme-paper"
import { solarizedTheme } from "./theme-solarized"
import { sunsetTheme } from "./theme-sunset"
import { synthwaveTheme } from "./theme-synthwave"
// Core themes (always available)
import { terminalTheme } from "./theme-terminal"
import { tokyoNightTheme } from "./theme-tokyo-night"
import { vaporwaveTheme } from "./theme-vaporwave"

import type { ThemeDefinition, ThemeId } from "./types"

/** All available themes */
const themes: Record<ThemeId, ThemeDefinition> = {
  // Core
  terminal: terminalTheme,
  "8bit": eightBitTheme,
  // Tier 1: Fun and Playful
  gameboy: gameboyTheme,
  paper: paperTheme,
  vaporwave: vaporwaveTheme,
  cyberpunk: cyberpunkTheme,
  // Tier 2: Seasonal/Event
  halloween: halloweenTheme,
  christmas: christmasTheme,
  matrix: matrixTheme,
  synthwave: synthwaveTheme,
  // Tier 3: Experimental
  accessibility: accessibilityTheme,
  minimal: minimalTheme,
  brutalist: brutalistTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  forest: forestTheme,
  // Tier 4: Editor Classics
  nord: nordTheme,
  dracula: draculaTheme,
  monokai: monokaiTheme,
  solarized: solarizedTheme,
  catppuccin: catppuccinTheme,
  gruvbox: gruvboxTheme,
  "tokyo-night": tokyoNightTheme,
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

// Re-export ThemeId (other types available via direct import from ./types)
export type { ThemeId } from "./types"

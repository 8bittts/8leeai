/**
 * Theme Presets
 *
 * Shared configuration patterns for themes to reduce duplication.
 * Themes can spread these presets and override specific values.
 *
 * Categories:
 * - Fonts: mono, sans, system, pixel
 * - Borders: sharp, subtle, rounded, chunky
 * - Shadows: none, glow, offset, soft
 */

import type { ThemeBorders, ThemeFonts, ThemeShadows } from "./types"

// ============================================
// FONT PRESETS
// ============================================

/** Monospace terminal fonts - for Terminal, Halloween, Christmas, Matrix, and Editor Classics (Nord, Dracula, Monokai, Solarized, Catppuccin, Gruvbox, Tokyo Night) */
export const FONTS_MONO: ThemeFonts = {
  primary: "var(--font-mono), ui-monospace, monospace",
}

/** Sans-serif modern fonts - for Ocean, Forest, Sunset */
export const FONTS_SANS: ThemeFonts = {
  primary: "var(--font-sans), system-ui, sans-serif",
}

/** System fonts for maximum compatibility - for Minimal, Accessibility */
export const FONTS_SYSTEM: ThemeFonts = {
  primary: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
}

/** Accessibility-optimized fonts - larger size, generous line height */
export const FONTS_ACCESSIBILITY: ThemeFonts = {
  primary: "system-ui, -apple-system, sans-serif",
}

/** Pixel fonts for retro themes - for 8bit, Gameboy */
export const FONTS_PIXEL: ThemeFonts = {
  primary: "var(--font-8bit), 'Press Start 2P', monospace",
}

// ============================================
// BORDER PRESETS
// ============================================

/** Sharp pixel-perfect borders - for retro themes */
export const BORDERS_SHARP: ThemeBorders = {
  width: "2px",
  style: "solid",
}

/** Subtle minimal borders - for Paper, Terminal, Nord, Dracula, Monokai, Solarized */
export const BORDERS_SUBTLE: ThemeBorders = {
  width: "1px",
  style: "solid",
}

/** Standard rounded borders - for seasonal, nature themes, and Gruvbox */
export const BORDERS_ROUNDED: ThemeBorders = {
  width: "2px",
  style: "solid",
}

/** Medium rounded borders - for Ocean, Vaporwave, Catppuccin, Tokyo Night */
export const BORDERS_MEDIUM: ThemeBorders = {
  width: "2px",
  style: "solid",
}

/** Chunky 90s borders - for Brutalist */
export const BORDERS_CHUNKY: ThemeBorders = {
  width: "3px",
  style: "solid",
}

// ============================================
// SHADOW PRESETS
// ============================================

/** No shadows - for Minimal, Accessibility */
export const SHADOWS_NONE: ThemeShadows = {
  hover: "none",
}

/** Soft depth shadows - for Paper, nature themes, and Editor Classics */
export const createSoftShadows = (color: string): ThemeShadows => ({
  hover: `0 8px 24px ${color}`,
})

/** Glow shadows - for neon/cyber themes */
export const createGlowShadows = (primary: string, secondary?: string): ThemeShadows => ({
  hover: secondary ? `0 0 20px ${primary}, 0 0 30px ${secondary}` : `0 0 20px ${primary}`,
})

/** Offset shadows - for retro/pixel themes */
export const createOffsetShadows = (color: string): ThemeShadows => ({
  hover: `3px 3px 0 ${color}`,
})

/** Multi-color offset shadows - for 8-bit theme with different colors per state */
export const createMultiColorOffsetShadows = (
  _defaultColor: string,
  hoverColor: string,
  _activeColor?: string
): ThemeShadows => ({
  hover: `6px 6px 0 ${hoverColor}`,
})

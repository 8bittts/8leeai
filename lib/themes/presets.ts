/**
 * Theme Presets
 *
 * Shared configuration patterns for themes to reduce duplication.
 * Themes can spread these presets and override specific values.
 *
 * Categories:
 * - Fonts: mono, sans, serif, system, pixel
 * - Borders: sharp, subtle, rounded, chunky
 * - Shadows: none, glow, offset, soft
 * - Animation: instant, quick, smooth, flowing
 */

import type { ThemeAnimation, ThemeBorders, ThemeFonts, ThemeShadows } from "./types"

// ============================================
// FONT PRESETS
// ============================================

/** Monospace terminal fonts - for Terminal, Halloween, Christmas, Matrix */
export const FONTS_MONO: ThemeFonts = {
  primary: "var(--font-mono), ui-monospace, monospace",
  mono: "var(--font-mono), ui-monospace, monospace",
  sizeBase: "1rem",
  lineHeight: "1.5",
}

/** Sans-serif modern fonts - for Ocean, Forest, Sunset */
export const FONTS_SANS: ThemeFonts = {
  primary: "var(--font-geist-sans), system-ui, sans-serif",
  mono: "var(--font-mono), ui-monospace, monospace",
  sizeBase: "1rem",
  lineHeight: "1.6",
}

/** System fonts for maximum compatibility - for Minimal, Accessibility */
export const FONTS_SYSTEM: ThemeFonts = {
  primary: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "ui-monospace, monospace",
  sizeBase: "1rem",
  lineHeight: "1.6",
}

/** Accessibility-optimized fonts - larger size, generous line height */
export const FONTS_ACCESSIBILITY: ThemeFonts = {
  primary: "system-ui, -apple-system, sans-serif",
  mono: "ui-monospace, monospace",
  sizeBase: "1.125rem",
  lineHeight: "1.75",
}

/** Pixel fonts for retro themes - for 8bit, Gameboy */
export const FONTS_PIXEL: ThemeFonts = {
  primary: "var(--font-geist-mono), 'Courier New', monospace",
  mono: "var(--font-geist-mono), 'Courier New', monospace",
  sizeBase: "0.875rem",
  lineHeight: "1.6",
}

// ============================================
// BORDER PRESETS
// ============================================

/** Sharp pixel-perfect borders - for retro themes */
export const BORDERS_SHARP: ThemeBorders = {
  width: "2px",
  style: "solid",
  radius: "0",
}

/** Subtle minimal borders - for Paper, Terminal */
export const BORDERS_SUBTLE: ThemeBorders = {
  width: "1px",
  style: "solid",
  radius: "0.25rem",
}

/** Standard rounded borders - for seasonal and nature themes */
export const BORDERS_ROUNDED: ThemeBorders = {
  width: "2px",
  style: "solid",
  radius: "0.25rem",
}

/** Medium rounded borders - for Ocean, Vaporwave */
export const BORDERS_MEDIUM: ThemeBorders = {
  width: "2px",
  style: "solid",
  radius: "0.5rem",
}

/** Chunky 90s borders - for Brutalist */
export const BORDERS_CHUNKY: ThemeBorders = {
  width: "3px",
  style: "solid",
  radius: "0",
}

// ============================================
// SHADOW PRESETS
// ============================================

/** No shadows - for Minimal, Accessibility */
export const SHADOWS_NONE: ThemeShadows = {
  default: "none",
  hover: "none",
  active: "none",
}

/** Soft depth shadows - for Paper, nature themes */
export const createSoftShadows = (color: string): ThemeShadows => ({
  default: `0 4px 12px ${color}`,
  hover: `0 8px 24px ${color}`,
  active: `0 2px 8px ${color}`,
})

/** Glow shadows - for neon/cyber themes */
export const createGlowShadows = (primary: string, secondary?: string): ThemeShadows => ({
  default: `0 0 15px ${primary}`,
  hover: secondary ? `0 0 20px ${primary}, 0 0 30px ${secondary}` : `0 0 20px ${primary}`,
  active: secondary ? `0 0 10px ${primary}, 0 0 15px ${secondary}` : `0 0 10px ${primary}`,
})

/** Offset shadows - for retro/pixel themes */
export const createOffsetShadows = (color: string): ThemeShadows => ({
  default: `2px 2px 0 ${color}`,
  hover: `3px 3px 0 ${color}`,
  active: `1px 1px 0 ${color}`,
})

// ============================================
// ANIMATION PRESETS
// ============================================

/** Instant animations - for retro/accessibility themes */
export const ANIMATION_INSTANT: ThemeAnimation = {
  duration: "0ms",
  timing: "steps(1)",
  stepped: true,
}

/** No animations - for accessibility */
export const ANIMATION_NONE: ThemeAnimation = {
  duration: "0ms",
  timing: "linear",
  stepped: false,
}

/** Quick snappy animations - for Minimal, Matrix */
export const ANIMATION_QUICK: ThemeAnimation = {
  duration: "100ms",
  timing: "ease-out",
  stepped: false,
}

/** Standard smooth animations - for seasonal themes */
export const ANIMATION_SMOOTH: ThemeAnimation = {
  duration: "200ms",
  timing: "ease-in-out",
  stepped: false,
}

/** Flowing elegant animations - for nature/neon themes */
export const ANIMATION_FLOWING: ThemeAnimation = {
  duration: "300ms",
  timing: "cubic-bezier(0.4, 0, 0.2, 1)",
  stepped: false,
}

import type { ThemeDefinition } from "./types"

/**
 * 8-Bit Retro Theme
 *
 * Inspired by 8bitcn-ui - retro gaming aesthetic with pixel fonts,
 * hard-edged borders, offset shadows, and vibrant colors.
 *
 * Features:
 * - Press Start 2P pixel font
 * - No border radius (pixel-perfect edges)
 * - Offset solid shadows (no blur)
 * - High contrast retro color palette
 * - Stepped/instant animations
 */
export const eightBitTheme: ThemeDefinition = {
  id: "8bit",
  name: "8-Bit",
  description: "Retro 8-bit gaming style with pixel fonts",

  colors: {
    background: "#1a1a2e", // Dark blue-purple
    foreground: "#eaeaea", // Off-white
    primary: "#ff6b6b", // Coral red
    secondary: "#4ecdc4", // Teal cyan
    accent: "#ffd93d", // Golden yellow
    muted: "#6c757d", // Muted gray
    border: "#eaeaea", // Off-white borders
    success: "#6bcb77", // Pixel green
    error: "#ff6b6b", // Coral red
    warning: "#ffd93d", // Golden yellow
  },

  fonts: {
    primary: "var(--font-8bit), 'Press Start 2P', monospace",
    mono: "var(--font-8bit), 'Press Start 2P', monospace",
    sizeBase: "0.625rem", // Smaller for pixel font readability
    lineHeight: "2", // Extra line height for pixel font
  },

  borders: {
    width: "3px",
    style: "solid",
    radius: "0", // No border radius - pixel perfect
  },

  shadows: {
    default: "4px 4px 0 #ff6b6b",
    hover: "6px 6px 0 #4ecdc4",
    active: "2px 2px 0 #ffd93d",
  },

  animation: {
    duration: "0ms", // Instant - no smooth transitions
    timing: "steps(1)",
    stepped: true,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "8bitcn-ui, NES/SNES era gaming",
  },
}

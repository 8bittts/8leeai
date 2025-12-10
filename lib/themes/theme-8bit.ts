import { ANIMATION_INSTANT, BORDERS_CHUNKY, createMultiColorOffsetShadows } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * 8-Bit Retro Theme
 *
 * Inspired by 8bitcn-ui - retro gaming aesthetic with pixel fonts,
 * hard-edged borders, offset shadows, and vibrant colors.
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

  // 8-bit has unique pixel font settings
  fonts: {
    primary: "var(--font-8bit), 'Press Start 2P', monospace",
    mono: "var(--font-8bit), 'Press Start 2P', monospace",
    sizeBase: "0.625rem",
    lineHeight: "2",
  },

  borders: BORDERS_CHUNKY,

  // 8-bit uses multi-color offset shadows (red default, cyan hover, yellow active)
  shadows: createMultiColorOffsetShadows("#ff6b6b", "#4ecdc4", "#ffd93d"),

  animation: ANIMATION_INSTANT,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "8bitcn-ui, NES/SNES era gaming",
  },
}

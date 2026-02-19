import { BORDERS_CHUNKY, createMultiColorOffsetShadows } from "./presets"
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
    accent: "#ffd93d", // Golden yellow
    muted: "#6c757d", // Muted gray
    border: "#eaeaea", // Off-white borders
    error: "#ff6b6b", // Coral red
  },

  // 8-bit has unique pixel font settings
  fonts: {
    primary: "var(--font-8bit), 'Press Start 2P', monospace",
  },

  borders: BORDERS_CHUNKY,

  // 8-bit uses multi-color offset shadows (red default, cyan hover, yellow active)
  shadows: createMultiColorOffsetShadows("#ff6b6b", "#4ecdc4", "#ffd93d"),

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "8bitcn-ui, NES/SNES era gaming",
  },
}

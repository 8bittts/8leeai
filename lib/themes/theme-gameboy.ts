import { ANIMATION_INSTANT, BORDERS_SHARP, createOffsetShadows, FONTS_PIXEL } from "./presets"
import type { ThemeDefinition } from "./types"

/**
 * Game Boy LCD Theme
 *
 * Authentic Nintendo Game Boy DMG-01 LCD aesthetic with the iconic
 * 4-color green palette. Replicates the original dot matrix display.
 *
 * Color Palette:
 * - #9bbc0f: Lightest green (LCD background)
 * - #8bac0f: Light green (highlights)
 * - #306230: Dark green (shadows)
 * - #0f380f: Darkest green (text/pixels)
 */
export const gameboyTheme: ThemeDefinition = {
  id: "gameboy",
  name: "Game Boy",
  description: "Classic Game Boy LCD aesthetic with 4-color palette",

  colors: {
    background: "#9bbc0f", // Lightest green - LCD background
    foreground: "#0f380f", // Darkest green - text/pixels
    primary: "#306230", // Dark green - primary interactive elements
    secondary: "#8bac0f", // Light green - secondary elements
    accent: "#0f380f", // Darkest green - accents
    muted: "#306230", // Dark green - muted text
    border: "#0f380f", // Darkest green - borders
    success: "#306230", // Dark green - success state
    error: "#0f380f", // Darkest green - error state
    warning: "#306230", // Dark green - warning state
  },

  fonts: FONTS_PIXEL,
  borders: BORDERS_SHARP,
  shadows: createOffsetShadows("#306230"),
  animation: ANIMATION_INSTANT,

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Nintendo Game Boy DMG-01 LCD display",
  },
}

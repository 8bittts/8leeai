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
 *
 * Features:
 * - Authentic 4-shade Game Boy palette
 * - Pixel-perfect sharp edges (no border radius)
 * - Monospace font for LCD authenticity
 * - Stepped animations (no smooth transitions)
 * - Hard shadows for LCD depth effect
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

  fonts: {
    primary: "var(--font-geist-mono), 'Courier New', monospace",
    mono: "var(--font-geist-mono), 'Courier New', monospace",
    sizeBase: "0.875rem", // Slightly smaller for LCD feel
    lineHeight: "1.6",
  },

  borders: {
    width: "2px",
    style: "solid",
    radius: "0", // Pixel-perfect - no rounded corners
  },

  shadows: {
    default: "2px 2px 0 #306230", // Dark green offset shadow
    hover: "3px 3px 0 #0f380f", // Darkest green for hover depth
    active: "1px 1px 0 #306230", // Pressed state
  },

  animation: {
    duration: "0ms", // No smooth animations - instant like LCD
    timing: "steps(1)", // Stepped transitions
    stepped: true,
  },

  metadata: {
    author: "Eight Lee",
    version: "1.0.0",
    inspiration: "Nintendo Game Boy DMG-01 LCD display",
  },
}

import type { ThemeId } from "./types"

export const THEME_STYLE_TAGS: Record<ThemeId, readonly string[]> = {
  terminal: [],
  "8bit": ["retro", "motion-heavy"],
  gameboy: ["retro", "motion-heavy"],
  paper: [],
  vaporwave: ["neon", "motion-heavy"],
  cyberpunk: ["neon", "motion-heavy"],
  halloween: ["motion-heavy"],
  christmas: ["motion-heavy"],
  matrix: ["neon", "motion-heavy"],
  synthwave: ["neon", "motion-heavy"],
  accessibility: ["minimal"],
  minimal: ["minimal"],
  brutalist: [],
  ocean: ["motion-heavy"],
  sunset: ["motion-heavy"],
  forest: ["motion-heavy"],
  nord: [],
  dracula: [],
  monokai: [],
  solarized: [],
  catppuccin: [],
  gruvbox: [],
  "tokyo-night": [],
}

export function getThemeStyleTags(id: ThemeId): readonly string[] {
  return THEME_STYLE_TAGS[id] ?? []
}

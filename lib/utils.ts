import React from "react"

/** Formats array index to zero-padded display number (0 → "01") */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

/** Opens URL in new tab with security: prevents window.opener exploits */
export function openExternalLink(url: string): void {
  if (!url) return
  const newWindow = window.open(url, "_blank")
  if (newWindow) {
    newWindow.opener = null
  }
}

/**
 * Renders text with specific word underlined based on linkWord parameter
 * Used for highlighting clickable portions of project/education/volunteer names
 * Uses React.createElement to avoid JSX syntax in .ts file
 */
export function renderTextWithUnderlinedWord(name: string, linkWord?: string): React.ReactNode {
  if (!linkWord || linkWord.trim() === "") {
    return name
  }

  return name.split(new RegExp(`(${linkWord})`, "i")).map((part, i) => {
    const isMatch = part.toLowerCase() === linkWord.toLowerCase()
    return React.createElement(
      "span",
      {
        key: i,
        className: isMatch ? "underline" : undefined,
      },
      part
    )
  })
}

export const ANIMATION_DELAYS = {
  typewriter: 15,
  showProjects: 500,
  bootPrompt: 500,
} as const

export const DATA_OFFSETS = {
  projects: { start: 1, end: 60 },
  education: { start: 61, end: 65 },
  volunteer: { start: 66, end: 71 },
} as const

// Valid terminal commands with strict typing
export const VALID_COMMANDS = [
  "email",
  "education",
  "ed",
  "volunteer",
  "vol",
  "github",
  "wellfound",
  "deathnote",
  "clear",
] as const

export type Command = (typeof VALID_COMMANDS)[number]

/**
 * Type guard to check if a string is a valid command
 */
export function isValidCommand(cmd: string): cmd is Command {
  return VALID_COMMANDS.includes(cmd as Command)
}

// Formatted command list for display (groups aliases with main commands)
export const COMMAND_DISPLAY_LIST = [
  "email",
  "education (ed)",
  "volunteer (vol)",
  "github",
  "wellfound",
  "deathnote",
  "clear",
] as const

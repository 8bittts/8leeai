import React from "react"

/** Formats array index to zero-padded display number (0 → "01") */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0")
}

/** Formats array index with offset to zero-padded display number */
export function formatIndexWithOffset(index: number, offset: number): string {
  return String(index + offset).padStart(2, "0")
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

/**
 * Detects malformed/malicious URL patterns for security filtering
 * Returns true if URL contains suspicious patterns (SQL injection, path traversal, etc.)
 */
export function isMalformedUrl(pathname: string): boolean {
  // SQL injection patterns
  const sqlPatterns =
    /select|union|insert|update|delete|drop|create|alter|exec|script|javascript|--|\/\*|\*\/|;|'|"|xp_|sp_/i

  // Path traversal patterns
  const pathTraversal = /\.\.|%2e%2e|%252e|%c0%ae|%c1%9c/i

  // PHP/WordPress probing
  const phpProbing = /\.php|wp-admin|wp-content|wp-includes|phpmyadmin|xmlrpc/i

  // Suspicious characters or patterns
  const suspiciousChars = /[<>{}[\]\\^`|"]/

  // Check for any malicious pattern
  return (
    sqlPatterns.test(pathname) ||
    pathTraversal.test(pathname) ||
    phpProbing.test(pathname) ||
    suspiciousChars.test(pathname)
  )
}

/**
 * Validates if URL looks like semantic content (legitimate slugified URLs)
 * Requirements: ≤30 chars, only lowercase/numbers/hyphens/slashes, no malicious patterns
 */
export function isSemanticUrl(pathname: string): boolean {
  // Must be ≤30 characters
  if (pathname.length > 30) {
    return false
  }

  // Must not contain malicious patterns
  if (isMalformedUrl(pathname)) {
    return false
  }

  // Must match semantic URL pattern: lowercase letters, numbers, hyphens, slashes only
  const semanticPattern = /^\/[a-z0-9\-/]*$/
  return semanticPattern.test(pathname)
}

export const ANIMATION_DELAYS = {
  typewriter: 8,
  showProjects: 500,
  bootPrompt: 500,
} as const

export const DATA_OFFSETS = {
  projects: { start: 1, end: 62 },
  education: { start: 63, end: 67 },
  volunteer: { start: 68, end: 73 },
} as const

export const PROJECTS_PER_PAGE = 15

// Valid terminal commands with strict typing
export const VALID_COMMANDS = [
  "email",
  "help",
  "education",
  "ed",
  "volunteer",
  "vol",
  "github",
  "wellfound",
  "linkedin",
  "li",
  "x",
  "twitter",
  "deathnote",
  "random",
  "clear",
] as const

export type Command = (typeof VALID_COMMANDS)[number]

/**
 * Type guard to check if a string is a valid command
 */
export function isValidCommand(cmd: string): cmd is Command {
  return (VALID_COMMANDS as readonly string[]).includes(cmd)
}

// Formatted command list for display (groups aliases with main commands)
export const COMMAND_DISPLAY_LIST = [
  "email",
  "help",
  "education (ed)",
  "volunteer (vol)",
  "github",
  "wellfound",
  "linkedin (li)",
  "x",
  "deathnote",
  "clear",
] as const

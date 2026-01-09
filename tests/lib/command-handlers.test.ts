/**
 * Tests for command handler functions
 */
import { describe, expect, test } from "bun:test"
import {
  getSystemCommandOutput,
  handleDate,
  handleStats,
  handleUname,
  handleWhoami,
} from "../../lib/command-handlers"

describe("handleWhoami - User identification output", () => {
  test("returns welcoming content for the terminal", () => {
    // Intent: Provide helpful context when users type 'whoami'
    const result = handleWhoami()
    expect(result.content).toContain("Eight Lee")
    expect(result.content).toContain("portfolio")
    expect(result.status).toBe("User info displayed")
  })
})

describe("handleUname - System information output", () => {
  test("returns system version with age-based version number", () => {
    // Intent: Show playful system info with dynamic version
    const result = handleUname()
    expect(result.content).toContain("8leeOS")
    expect(result.content).toContain("Terminal Edition")
    expect(result.content).toMatch(/v\d+/) // Should have version number
    expect(result.status).toBe("System info displayed")
  })

  test("includes tech stack information", () => {
    // Intent: Mention the technologies used
    const result = handleUname()
    expect(result.content).toContain("Next.js")
    expect(result.content).toContain("React")
  })
})

describe("handleDate - Current date/time output", () => {
  test("returns valid date string", () => {
    // Intent: Provide current timestamp for users
    const result = handleDate()
    // Should be a valid date string (parseable)
    expect(() => new Date(result.content)).not.toThrow()
    expect(result.status).toBe("Current date/time displayed")
  })
})

describe("handleStats - Portfolio statistics output", () => {
  test("returns portfolio statistics with project count", () => {
    // Intent: Show meaningful statistics about the portfolio
    const result = handleStats()
    expect(result.content).toContain("Portfolio Statistics")
    expect(result.content).toContain("Total Projects")
    expect(result.content).toContain("Education Entries")
    expect(result.content).toContain("Volunteer Roles")
    expect(result.status).toBe("Portfolio statistics displayed")
  })

  test("includes technology and focus areas", () => {
    // Intent: Highlight technical skills
    const result = handleStats()
    expect(result.content).toContain("Technologies")
    expect(result.content).toContain("Focus Areas")
  })
})

describe("getSystemCommandOutput - Command dispatcher", () => {
  test("dispatches whoami command correctly", () => {
    const result = getSystemCommandOutput("whoami")
    expect(result).not.toBeNull()
    expect(result?.content).toContain("Eight Lee")
  })

  test("dispatches uname command correctly", () => {
    const result = getSystemCommandOutput("uname")
    expect(result).not.toBeNull()
    expect(result?.content).toContain("8leeOS")
  })

  test("dispatches date command correctly", () => {
    const result = getSystemCommandOutput("date")
    expect(result).not.toBeNull()
    if (result) {
      expect(() => new Date(result.content)).not.toThrow()
    }
  })

  test("dispatches stats command correctly", () => {
    const result = getSystemCommandOutput("stats")
    expect(result).not.toBeNull()
    expect(result?.content).toContain("Portfolio Statistics")
  })

  test("returns null for unknown commands", () => {
    // Intent: Unknown commands should return null for caller to handle
    expect(getSystemCommandOutput("unknown")).toBeNull()
    expect(getSystemCommandOutput("")).toBeNull()
  })
})

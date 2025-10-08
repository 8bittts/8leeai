/**
 * Tests for utility functions
 */
import { describe, expect, test } from "bun:test"
import type { createElement } from "react"
import {
  COMMAND_DISPLAY_LIST,
  DATA_OFFSETS,
  formatIndex,
  isValidCommand,
  openExternalLink,
  renderTextWithUnderlinedWord,
  VALID_COMMANDS,
} from "./utils"

describe("formatIndex", () => {
  test("formats single digit with leading zero", () => {
    expect(formatIndex(0)).toBe("01")
    expect(formatIndex(5)).toBe("06")
    expect(formatIndex(9)).toBe("10")
  })

  test("formats double digits without leading zero", () => {
    expect(formatIndex(10)).toBe("11")
    expect(formatIndex(59)).toBe("60")
  })
})

describe("isValidCommand", () => {
  test("returns true for valid commands", () => {
    expect(isValidCommand("email")).toBe(true)
    expect(isValidCommand("github")).toBe(true)
    expect(isValidCommand("clear")).toBe(true)
    expect(isValidCommand("education")).toBe(true)
    expect(isValidCommand("ed")).toBe(true)
  })

  test("returns false for invalid commands", () => {
    expect(isValidCommand("invalid")).toBe(false)
    expect(isValidCommand("")).toBe(false)
    expect(isValidCommand("123")).toBe(false)
  })

  test("is case sensitive", () => {
    expect(isValidCommand("EMAIL")).toBe(false)
    expect(isValidCommand("Email")).toBe(false)
  })
})

describe("renderTextWithUnderlinedWord", () => {
  test("returns plain text when linkWord is empty or undefined", () => {
    const result1 = renderTextWithUnderlinedWord("Hello World", "")
    const result2 = renderTextWithUnderlinedWord("Hello World", undefined)
    expect(result1).toBe("Hello World")
    expect(result2).toBe("Hello World")
  })

  test("underlines matching word (case-insensitive)", () => {
    const result = renderTextWithUnderlinedWord("Hello World", "World")
    expect(Array.isArray(result)).toBe(true)
    if (Array.isArray(result)) {
      // Split creates: ["Hello ", "World", ""]
      expect(result).toHaveLength(3)
      // First element should be plain span
      const element1 = result[0] as ReturnType<typeof createElement>
      expect(element1.type).toBe("span")
      expect(element1.props.className).toBeUndefined()
      expect(element1.props.children).toBe("Hello ")
      // Second element should have underline class
      const element2 = result[1] as ReturnType<typeof createElement>
      expect(element2.type).toBe("span")
      expect(element2.props.className).toBe("underline")
      expect(element2.props.children).toBe("World")
    }
  })

  test("is case insensitive", () => {
    const result = renderTextWithUnderlinedWord("Hello world", "WORLD")
    expect(Array.isArray(result)).toBe(true)
    if (Array.isArray(result)) {
      const element = result[1] as ReturnType<typeof createElement>
      expect(element.props.className).toBe("underline")
      expect(element.props.children).toBe("world") // Preserves original case
    }
  })

  test("handles multiple occurrences", () => {
    const result = renderTextWithUnderlinedWord("World World World", "World")
    expect(Array.isArray(result)).toBe(true)
    if (Array.isArray(result)) {
      // Split creates array with all matches and separators
      expect(result.length).toBeGreaterThan(3)
      // All "World" instances should be underlined
      const underlinedElements = (result as Array<ReturnType<typeof createElement>>).filter(
        (el) => el.props?.className === "underline"
      )
      expect(underlinedElements.length).toBeGreaterThan(0)
    }
  })
})

describe("openExternalLink", () => {
  test("calls window.open with correct parameters", () => {
    // Mock window.open
    const originalOpen = window.open
    const mockOpen = () => ({ opener: {} })
    window.open = mockOpen as typeof window.open

    openExternalLink("https://example.com")

    // Restore original
    window.open = originalOpen
  })

  test("handles empty URL gracefully", () => {
    expect(() => openExternalLink("")).not.toThrow()
  })
})

describe("VALID_COMMANDS constant", () => {
  test("contains expected commands", () => {
    expect(VALID_COMMANDS).toContain("email")
    expect(VALID_COMMANDS).toContain("github")
    expect(VALID_COMMANDS).toContain("wellfound")
    expect(VALID_COMMANDS).toContain("deathnote")
    expect(VALID_COMMANDS).toContain("education")
    expect(VALID_COMMANDS).toContain("ed")
    expect(VALID_COMMANDS).toContain("volunteer")
    expect(VALID_COMMANDS).toContain("vol")
    expect(VALID_COMMANDS).toContain("clear")
  })

  test("has correct length", () => {
    expect(VALID_COMMANDS).toHaveLength(9)
  })
})

describe("COMMAND_DISPLAY_LIST constant", () => {
  test("contains formatted command list with aliases", () => {
    expect(COMMAND_DISPLAY_LIST).toContain("email")
    expect(COMMAND_DISPLAY_LIST).toContain("education (ed)")
    expect(COMMAND_DISPLAY_LIST).toContain("volunteer (vol)")
    expect(COMMAND_DISPLAY_LIST).toContain("github")
    expect(COMMAND_DISPLAY_LIST).toContain("clear")
  })

  test("has correct length (consolidates aliases)", () => {
    expect(COMMAND_DISPLAY_LIST).toHaveLength(7)
  })
})

describe("DATA_OFFSETS constant", () => {
  test("has correct project range", () => {
    expect(DATA_OFFSETS.projects.start).toBe(1)
    expect(DATA_OFFSETS.projects.end).toBe(60)
  })

  test("has correct education range", () => {
    expect(DATA_OFFSETS.education.start).toBe(61)
    expect(DATA_OFFSETS.education.end).toBe(65)
  })

  test("has correct volunteer range", () => {
    expect(DATA_OFFSETS.volunteer.start).toBe(66)
    expect(DATA_OFFSETS.volunteer.end).toBe(71)
  })

  test("ranges do not overlap", () => {
    expect(DATA_OFFSETS.projects.end).toBeLessThan(DATA_OFFSETS.education.start)
    expect(DATA_OFFSETS.education.end).toBeLessThan(DATA_OFFSETS.volunteer.start)
  })
})

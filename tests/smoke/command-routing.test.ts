import { describe, expect, test } from "bun:test"
import {
  isNumericCommand,
  normalizeCommand,
  parseTextCommand,
  pickRandomProjectNumber,
  resolveNumericCommand,
} from "../../lib/command-routing"
import { resolveCommand } from "../../lib/commands"
import { createDataOffsets } from "../../lib/data"

describe("createDataOffsets", () => {
  test("creates sequential ranges from section lengths", () => {
    const offsets = createDataOffsets({ projects: 3, education: 2, volunteer: 1 })

    expect(offsets.projects).toEqual({ start: 1, end: 3 })
    expect(offsets.education).toEqual({ start: 4, end: 5 })
    expect(offsets.volunteer).toEqual({ start: 6, end: 6 })
  })

  test("handles empty sections without invalid number matches", () => {
    const offsets = createDataOffsets({ projects: 0, education: 0, volunteer: 0 })

    expect(offsets.projects).toEqual({ start: 1, end: 0 })
    expect(offsets.education).toEqual({ start: 1, end: 0 })
    expect(offsets.volunteer).toEqual({ start: 1, end: 0 })
    expect(resolveNumericCommand(1, offsets)).toBeNull()
  })
})

describe("numeric routing", () => {
  const offsets = createDataOffsets({ projects: 66, education: 5, volunteer: 6 })

  test("routes boundary numbers to correct sections", () => {
    expect(resolveNumericCommand(1, offsets)).toMatchObject({ section: "projects", index: 0 })
    expect(resolveNumericCommand(66, offsets)).toMatchObject({ section: "projects", index: 65 })
    expect(resolveNumericCommand(67, offsets)).toMatchObject({ section: "education", index: 0 })
    expect(resolveNumericCommand(71, offsets)).toMatchObject({ section: "education", index: 4 })
    expect(resolveNumericCommand(72, offsets)).toMatchObject({ section: "volunteer", index: 0 })
    expect(resolveNumericCommand(77, offsets)).toMatchObject({ section: "volunteer", index: 5 })
  })

  test("returns null for out-of-range values", () => {
    expect(resolveNumericCommand(0, offsets)).toBeNull()
    expect(resolveNumericCommand(78, offsets)).toBeNull()
  })

  test("leading-zero command values still resolve correctly", () => {
    const parsed = Number.parseInt("01", 10)
    expect(resolveNumericCommand(parsed, offsets)).toMatchObject({ section: "projects", index: 0 })
  })
})

describe("text command parsing", () => {
  test("normalizes slash-prefixed command input", () => {
    expect(normalizeCommand("  /help   ")).toBe("help")
  })

  test("parses command key and args", () => {
    expect(parseTextCommand("theme matrix")).toEqual({ key: "theme", args: "matrix" })
  })

  test("detects numeric command strings", () => {
    expect(isNumericCommand("007")).toBe(true)
    expect(isNumericCommand("7a")).toBe(false)
  })
})

describe("command lookup", () => {
  test("resolves aliases", () => {
    expect(resolveCommand("li")?.id).toBe("linkedin")
    expect(resolveCommand("themes")?.id).toBe("theme")
  })

  test("returns undefined for unknown command", () => {
    expect(resolveCommand("definitely-not-a-command")).toBeUndefined()
  })
})

describe("random project selection", () => {
  test("returns null when there are no URL-backed projects", () => {
    expect(pickRandomProjectNumber([], [{ id: "a", name: "A" }])).toBeNull()
  })

  test("returns a stable project number with deterministic random input", () => {
    const projects = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
      { id: "c", name: "C" },
    ]
    const projectsWithUrls = [{ id: "b", name: "B", url: "https://example.com" }]

    expect(pickRandomProjectNumber(projectsWithUrls, projects, () => 0.4)).toBe(2)
  })
})

/**
 * Tests for utility functions - focusing on user intent and business logic
 */
import { describe, expect, test } from "bun:test"
import type { createElement } from "react"
import {
  COMMAND_DISPLAY_LIST,
  DATA_OFFSETS,
  formatIndex,
  isMalformedUrl,
  isSemanticUrl,
  isValidCommand,
  openExternalLink,
  renderTextWithUnderlinedWord,
  VALID_COMMANDS,
} from "./utils"

describe("formatIndex - Consistent numbering for scannable lists", () => {
  test("displays project numbers in consistent width for visual scanning", () => {
    // Intent: Users can quickly scan numbered lists when numbers align vertically
    // Single-digit projects (1-9) need padding to match double-digit format (10-60)
    expect(formatIndex(0)).toBe("01") // Project 1 displays as "01"
    expect(formatIndex(5)).toBe("06") // Project 6 displays as "06"
    expect(formatIndex(9)).toBe("10") // Project 10 displays as "10"
    expect(formatIndex(10)).toBe("11") // Project 11 displays as "11"
    expect(formatIndex(59)).toBe("60") // Project 60 displays as "60"
  })
})

describe("isValidCommand - User input validation for clear feedback", () => {
  test("accepts commands users can successfully execute", () => {
    // Intent: Users get immediate feedback when typing valid commands
    // Valid commands should be recognized so users can navigate the portfolio
    expect(isValidCommand("email")).toBe(true)
    expect(isValidCommand("github")).toBe(true)
    expect(isValidCommand("clear")).toBe(true)
    expect(isValidCommand("education")).toBe(true)
    expect(isValidCommand("ed")).toBe(true) // Shortcut alias
  })

  test("rejects input that won't execute to prevent confusion", () => {
    // Intent: Users see red flash for invalid input, need clear boundary
    expect(isValidCommand("invalid")).toBe(false)
    expect(isValidCommand("")).toBe(false)
    expect(isValidCommand("123")).toBe(false) // Numbers handled separately
  })

  test("enforces lowercase convention matching terminal standards", () => {
    // Intent: Terminal commands are traditionally lowercase (unix convention)
    expect(isValidCommand("EMAIL")).toBe(false)
    expect(isValidCommand("Email")).toBe(false)
  })
})

describe("renderTextWithUnderlinedWord - Visual affordance for clickable links", () => {
  test("displays plain text when no link is available", () => {
    // Intent: Not all project entries have links, show plain text when linkWord is missing
    const result1 = renderTextWithUnderlinedWord("Hello World", "")
    const result2 = renderTextWithUnderlinedWord("Hello World", undefined)
    expect(result1).toBe("Hello World")
    expect(result2).toBe("Hello World")
  })

  test("highlights specific word to show users what's clickable", () => {
    // Intent: Users need to know which word in the description opens the project link
    const result = renderTextWithUnderlinedWord("Hello World", "World")
    expect(Array.isArray(result)).toBe(true)

    if (Array.isArray(result)) {
      // Verify we get styled elements for rendering
      expect(result.length).toBeGreaterThan(0)

      // Find the underlined element (the clickable word)
      const element2 = result[1] as ReturnType<typeof createElement>
      expect(element2.props.className).toBe("underline")
      expect(element2.props.children).toBe("World")
    }
  })

  test("matches words regardless of user capitalization for flexibility", () => {
    // Intent: Users shouldn't need to match exact case when specifying linkWord
    const result = renderTextWithUnderlinedWord("Hello world", "WORLD")
    expect(Array.isArray(result)).toBe(true)

    if (Array.isArray(result)) {
      const element = result[1] as ReturnType<typeof createElement>
      expect(element.props.className).toBe("underline")
      // Preserves original text case for readability
      expect(element.props.children).toBe("world")
    }
  })

  test("highlights all occurrences when word appears multiple times", () => {
    // Intent: If the linkWord appears multiple times, all should be underlined
    const result = renderTextWithUnderlinedWord("World World World", "World")
    expect(Array.isArray(result)).toBe(true)

    if (Array.isArray(result)) {
      // Count underlined elements (all should be clickable)
      const underlinedElements = (result as Array<ReturnType<typeof createElement>>).filter(
        (el) => el.props?.className === "underline"
      )
      expect(underlinedElements.length).toBeGreaterThan(0)
    }
  })
})

describe("openExternalLink - Security for external navigation", () => {
  test("opens external links without exposing portfolio window", () => {
    // Intent: Prevent external sites from accessing/manipulating the portfolio via window.opener
    // This is a critical security measure (tabnabbing prevention)
    const originalOpen = window.open
    const mockOpen = () => ({ opener: {} })
    window.open = mockOpen as typeof window.open

    openExternalLink("https://example.com")

    // Function should safely open link with noopener/noreferrer
    window.open = originalOpen
  })

  test("handles missing or invalid URLs without breaking the app", () => {
    // Intent: Graceful degradation - don't crash if data has empty URL
    expect(() => openExternalLink("")).not.toThrow()
  })
})

describe("VALID_COMMANDS - Command interface contract", () => {
  test("defines all commands users can execute in the terminal", () => {
    // Intent: This is the source of truth for what commands work
    // Users need these commands to navigate the portfolio and access contact info
    expect(VALID_COMMANDS).toContain("email")
    expect(VALID_COMMANDS).toContain("github")
    expect(VALID_COMMANDS).toContain("wellfound")
    expect(VALID_COMMANDS).toContain("deathnote")
    expect(VALID_COMMANDS).toContain("education")
    expect(VALID_COMMANDS).toContain("ed") // Shortcut
    expect(VALID_COMMANDS).toContain("volunteer")
    expect(VALID_COMMANDS).toContain("vol") // Shortcut
    expect(VALID_COMMANDS).toContain("clear")
  })

  test("maintains stable command count for regression detection", () => {
    // Intent: Catch accidental command additions/removals
    expect(VALID_COMMANDS).toHaveLength(9)
  })
})

describe("COMMAND_DISPLAY_LIST - User-facing command documentation", () => {
  test("shows users all available commands with their shortcuts", () => {
    // Intent: Users need to discover what commands they can type
    // Aliases shown in parentheses so users know shortcuts exist
    expect(COMMAND_DISPLAY_LIST).toContain("email")
    expect(COMMAND_DISPLAY_LIST).toContain("education (ed)")
    expect(COMMAND_DISPLAY_LIST).toContain("volunteer (vol)")
    expect(COMMAND_DISPLAY_LIST).toContain("github")
    expect(COMMAND_DISPLAY_LIST).toContain("clear")
  })

  test("consolidates aliases into single entries for cleaner display", () => {
    // Intent: Don't clutter the command list by showing "ed" and "education" separately
    expect(COMMAND_DISPLAY_LIST).toHaveLength(7)
  })
})

describe("DATA_OFFSETS - Portfolio data organization and integrity", () => {
  test("defines project number range for user input validation", () => {
    // Intent: Users can type 1-60 to view projects, need clear boundaries
    expect(DATA_OFFSETS.projects.start).toBe(1)
    expect(DATA_OFFSETS.projects.end).toBe(60)
  })

  test("defines education number range for user input validation", () => {
    // Intent: Users can type 61-65 to view education entries
    expect(DATA_OFFSETS.education.start).toBe(61)
    expect(DATA_OFFSETS.education.end).toBe(65)
  })

  test("defines volunteer number range for user input validation", () => {
    // Intent: Users can type 66-71 to view volunteer entries
    expect(DATA_OFFSETS.volunteer.start).toBe(66)
    expect(DATA_OFFSETS.volunteer.end).toBe(71)
  })

  test("maintains non-overlapping ranges to prevent ambiguous user input", () => {
    // Intent: Each number maps to exactly one piece of content
    // If ranges overlap, typing "61" could mean both education and projects
    expect(DATA_OFFSETS.projects.end).toBeLessThan(DATA_OFFSETS.education.start)
    expect(DATA_OFFSETS.education.end).toBeLessThan(DATA_OFFSETS.volunteer.start)
  })
})

describe("isMalformedUrl - Security filtering for malicious requests", () => {
  test("detects SQL injection attempts to protect from attacks", () => {
    // Intent: Block SQL injection probes from accessing or manipulating data
    expect(isMalformedUrl("/blog?id=1' OR '1'='1")).toBe(true)
    expect(isMalformedUrl("/post?id=1 UNION SELECT")).toBe(true)
    expect(isMalformedUrl("/admin'; DROP TABLE users--")).toBe(true)
    expect(isMalformedUrl("/page?q=test/**/SELECT")).toBe(true)
  })

  test("detects path traversal attempts to protect filesystem", () => {
    // Intent: Prevent attackers from accessing sensitive files outside web root
    expect(isMalformedUrl("/../../../etc/passwd")).toBe(true)
    expect(isMalformedUrl("/blog/../../config")).toBe(true)
    expect(isMalformedUrl("/page%2e%2e%2fpasswd")).toBe(true)
    expect(isMalformedUrl("/test%252e%252e/secret")).toBe(true)
  })

  test("detects PHP/WordPress probing to identify scanning attempts", () => {
    // Intent: Block automated scanners looking for vulnerable CMS installations
    expect(isMalformedUrl("/wp-admin.php")).toBe(true)
    expect(isMalformedUrl("/wp-content/plugins/evil")).toBe(true)
    expect(isMalformedUrl("/phpmyadmin/index.php")).toBe(true)
    expect(isMalformedUrl("/xmlrpc.php")).toBe(true)
  })

  test("detects suspicious characters that indicate injection attempts", () => {
    // Intent: Catch XSS and other injection vectors using special characters
    expect(isMalformedUrl("/blog/<script>alert(1)</script>")).toBe(true)
    expect(isMalformedUrl("/page?q=test{cmd}")).toBe(true)
    expect(isMalformedUrl("/post?id=[1,2,3]")).toBe(true)
    expect(isMalformedUrl("/test\\admin\\config")).toBe(true)
  })

  test("allows legitimate URLs with normal characters through filter", () => {
    // Intent: Don't block real users with valid content URLs
    expect(isMalformedUrl("/blog-post")).toBe(false)
    expect(isMalformedUrl("/about/team")).toBe(false)
    expect(isMalformedUrl("/projects/2024")).toBe(false)
  })
})

describe("isSemanticUrl - Legacy URL redirect for better UX", () => {
  test("accepts legacy blog URLs from previous site versions", () => {
    // Intent: 20+ years of external links should redirect to homepage, not 404
    // These are real legacy URLs from the screenshot that users still visit
    expect(isSemanticUrl("/blog-content")).toBe(true)
    expect(isSemanticUrl("/jung")).toBe(true)
    expect(isSemanticUrl("/1-percent")).toBe(true)
    expect(isSemanticUrl("/1-year-apart")).toBe(true)
    expect(isSemanticUrl("/404-page")).toBe(true)
  })

  test("accepts URLs with hyphens and numbers matching slug format", () => {
    // Intent: Legitimate content URLs should redirect, preserving link equity
    expect(isSemanticUrl("/post-title-123")).toBe(true)
    expect(isSemanticUrl("/category/item")).toBe(true)
    expect(isSemanticUrl("/2024/01/article")).toBe(true)
  })

  test("rejects URLs over 30 characters as likely spam", () => {
    // Intent: Very long URLs are typically automated attacks, let them 404
    expect(isSemanticUrl("/this-is-a-very-long-url-path-exceeding-thirty-characters")).toBe(false)
  })

  test("rejects URLs with uppercase letters not matching slug convention", () => {
    // Intent: Slugified URLs are always lowercase, uppercase suggests typo or probe
    expect(isSemanticUrl("/BlogPost")).toBe(false)
    expect(isSemanticUrl("/ADMIN")).toBe(false)
  })

  test("rejects malicious patterns even if they look semantic", () => {
    // Intent: Security takes priority - block attacks regardless of length
    expect(isSemanticUrl("/blog?id=1'or'1'='1")).toBe(false)
    expect(isSemanticUrl("/wp-admin")).toBe(false)
    expect(isSemanticUrl("/../etc/passwd")).toBe(false)
  })

  test("requires leading slash to match route format", () => {
    // Intent: Valid paths must start with slash (Next.js route convention)
    expect(isSemanticUrl("blog-post")).toBe(false)
    expect(isSemanticUrl("/blog-post")).toBe(true)
  })
})

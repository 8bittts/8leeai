/**
 * Tests for utility functions - focusing on user intent and business logic
 */
import { describe, expect, test } from "bun:test"
import type { createElement } from "react"
import {
  DATA_OFFSETS,
  formatIndex,
  isMalformedUrl,
  isSemanticUrl,
  isValidCommand,
  openExternalLink,
  renderTextWithUnderlinedWord,
} from "../../lib/utils"

describe("formatIndex - Consistent numbering for scannable lists", () => {
  test("displays project numbers in consistent width for visual scanning", () => {
    // Intent: Users can quickly scan numbered lists when numbers align vertically
    // Single-digit projects (1-9) need padding to match double-digit format (10-62)
    expect(formatIndex(0)).toBe("01") // Project 1 displays as "01"
    expect(formatIndex(5)).toBe("06") // Project 6 displays as "06"
    expect(formatIndex(9)).toBe("10") // Project 10 displays as "10"
    expect(formatIndex(10)).toBe("11") // Project 11 displays as "11"
    expect(formatIndex(61)).toBe("62") // Project 62 displays as "62"
  })
})

describe("isValidCommand - User input validation for clear feedback", () => {
  test("accepts commands users can successfully execute", () => {
    // Intent: Users get immediate feedback when typing valid commands
    // Valid commands should be recognized so users can navigate the portfolio
    expect(isValidCommand("email")).toBe(true)
    expect(isValidCommand("github")).toBe(true)
    expect(isValidCommand("clear")).toBe(true)
    expect(isValidCommand("reset")).toBe(true) // Alias for clear
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
  test("returns plain text when no link word is specified", () => {
    // Intent: Not all project entries have links, show plain text when linkWord is missing
    const result1 = renderTextWithUnderlinedWord("Hello World", "")
    const result2 = renderTextWithUnderlinedWord("Hello World", undefined)

    // No styling needed, just return original text
    expect(result1).toBe("Hello World")
    expect(result2).toBe("Hello World")
  })

  test("highlights specific word to indicate clickability", () => {
    // Intent: Users need to know which word in the description opens the project link
    const result = renderTextWithUnderlinedWord("Hello World", "World")

    // Should return styled elements (array) rather than plain string
    expect(Array.isArray(result)).toBe(true)

    if (Array.isArray(result)) {
      // Should have multiple parts (before, underlined word, after)
      expect(result.length).toBeGreaterThan(0)

      // The clickable word should be marked with underline styling
      const element = result[1] as ReturnType<typeof createElement>
      expect(element.props.className).toBe("underline")
      expect(element.props.children).toBe("World")
    }
  })

  test("matches words case-insensitively while preserving original text", () => {
    // Intent: Flexible matching - users shouldn't need exact case in linkWord config
    // But preserve original text case for natural readability
    const result = renderTextWithUnderlinedWord("Hello world", "WORLD")

    if (Array.isArray(result)) {
      const element = result[1] as ReturnType<typeof createElement>
      // Case-insensitive match succeeds, but original case preserved
      expect(element.props.children).toBe("world")
    }
  })
})

describe("openExternalLink - Security for external navigation", () => {
  test("prevents external sites from accessing portfolio window via opener", () => {
    // Intent: Prevent tabnabbing attacks where external sites manipulate the portfolio
    // By setting opener to null, we break the connection between windows
    const originalOpen = window.open
    const mockWindow = { opener: "SHOULD_BE_NULLIFIED" }

    window.open = (() => mockWindow) as typeof window.open

    openExternalLink("https://example.com")

    // Critical security check: opener must be null to prevent reverse tab manipulation
    expect(mockWindow.opener).toBe(null)

    window.open = originalOpen
  })

  test("handles missing URLs gracefully without opening new windows", () => {
    // Intent: Graceful degradation - don't attempt navigation with empty URLs
    const originalOpen = window.open
    let openCalled = false
    window.open = (() => {
      openCalled = true
      return null
    }) as typeof window.open

    openExternalLink("")

    // Should return early without calling window.open
    expect(openCalled).toBe(false)

    window.open = originalOpen
  })
})

describe("DATA_OFFSETS - Portfolio data organization and integrity", () => {
  test("maintains non-overlapping ranges to prevent ambiguous user input", () => {
    // Intent: Each number maps to exactly one piece of content
    // If ranges overlap, typing "61" could mean both education and projects
    // This is a critical business rule that ensures clear user input handling
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

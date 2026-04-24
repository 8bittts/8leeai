import { describe, expect, test } from "bun:test"
import { access, readFile } from "node:fs/promises"
import robots from "../../app/robots"
import { generateCORSHeaders, ROBOTS_DIRECTIVES } from "../../lib/api-security"
import { renderTextWithUnderlinedWord } from "../../lib/utils"
import nextConfig from "../../next.config"

describe("CORS origin normalization", () => {
  test("accepts canonical and www HTTPS origins", () => {
    const canonical = "https://8lee.ai"
    const www = "https://www.8lee.ai"

    const canonicalHeaders = generateCORSHeaders(canonical)
    const wwwHeaders = generateCORSHeaders(www)

    expect(canonicalHeaders["Access-Control-Allow-Origin"]).toBe(canonical)
    expect(wwwHeaders["Access-Control-Allow-Origin"]).toBe(www)
    expect(canonicalHeaders.Vary).toBe("Origin")
    expect(wwwHeaders.Vary).toBe("Origin")
  })

  test("accepts configured local development origins", () => {
    const dev = "http://localhost:1333"

    expect(generateCORSHeaders(dev)["Access-Control-Allow-Origin"]).toBe(dev)
  })

  test("rejects unsupported protocol or host", () => {
    const insecureHeaders = generateCORSHeaders("http://8lee.ai")
    const invalidHostHeaders = generateCORSHeaders("https://evil.example")

    expect(insecureHeaders["Access-Control-Allow-Origin"]).toBeUndefined()
    expect(invalidHostHeaders["Access-Control-Allow-Origin"]).toBeUndefined()
    expect(insecureHeaders.Vary).toBeUndefined()
    expect(invalidHostHeaders.Vary).toBeUndefined()
  })
})

describe("renderTextWithUnderlinedWord", () => {
  test("handles regex metacharacters in link words safely", () => {
    expect(() => renderTextWithUnderlinedWord("C++ Primer", "C++")).not.toThrow()
    expect(() => renderTextWithUnderlinedWord("(test) demo", "(test)")).not.toThrow()
  })
})

describe("anti-indexing policy", () => {
  test("robots.txt disallows every crawler from every path", () => {
    expect(robots()).toEqual({
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    })
  })

  test("root route keeps the noindex X-Robots-Tag header", async () => {
    const headerRules = await nextConfig.headers?.()
    const rootRule = headerRules?.find((rule) => rule.source === "/")
    const robotsHeader = rootRule?.headers.find((header) => header.key === "X-Robots-Tag")

    expect(robotsHeader?.value).toBe(ROBOTS_DIRECTIVES)
    expect(ROBOTS_DIRECTIVES).toContain("noindex")
    expect(ROBOTS_DIRECTIVES).toContain("nofollow")
    expect(ROBOTS_DIRECTIVES).toContain("nosnippet")
    expect(ROBOTS_DIRECTIVES).toContain("noimageindex")
  })

  test("app metadata avoids crawlable SEO signals", async () => {
    const layoutSource = await readFile(new URL("../../app/layout.tsx", import.meta.url), "utf8")
    const sitemapUrl = new URL("../../app/sitemap.ts", import.meta.url)
    const sitemapExists = await access(sitemapUrl)
      .then(() => true)
      .catch(() => false)

    expect(sitemapExists).toBe(false)
    expect(layoutSource).not.toContain("description:")
    expect(layoutSource).not.toContain("keywords:")
    expect(layoutSource).not.toContain("openGraph")
    expect(layoutSource).not.toContain("twitter")
  })
})

import { describe, expect, test } from "bun:test"
import { generateCORSHeaders } from "../../lib/api-security"
import { renderTextWithUnderlinedWord } from "../../lib/utils"

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

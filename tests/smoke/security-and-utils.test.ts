import { describe, expect, test } from "bun:test"
import { generateCORSHeaders } from "../../lib/api-security"
import { renderTextWithUnderlinedWord } from "../../lib/utils"

describe("CORS origin normalization", () => {
  test("accepts canonical and www HTTPS origins", () => {
    const canonical = "https://8lee.ai"
    const www = "https://www.8lee.ai"

    expect(generateCORSHeaders(canonical)["Access-Control-Allow-Origin"]).toBe(canonical)
    expect(generateCORSHeaders(www)["Access-Control-Allow-Origin"]).toBe(www)
  })

  test("accepts configured local development origins", () => {
    const dev = "http://localhost:1333"

    expect(generateCORSHeaders(dev)["Access-Control-Allow-Origin"]).toBe(dev)
  })

  test("rejects unsupported protocol or host", () => {
    expect(generateCORSHeaders("http://8lee.ai")["Access-Control-Allow-Origin"]).toBeUndefined()
    expect(
      generateCORSHeaders("https://evil.example")["Access-Control-Allow-Origin"]
    ).toBeUndefined()
  })
})

describe("renderTextWithUnderlinedWord", () => {
  test("handles regex metacharacters in link words safely", () => {
    expect(() => renderTextWithUnderlinedWord("C++ Primer", "C++")).not.toThrow()
    expect(() => renderTextWithUnderlinedWord("(test) demo", "(test)")).not.toThrow()
  })
})

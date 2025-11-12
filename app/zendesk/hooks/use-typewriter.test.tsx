/**
 * Tests for useTypewriter hook - focusing on content reveal intent
 * Intent: Create authentic terminal experience by gradually revealing text
 */

import { describe, expect, test, vi } from "bun:test"
import { renderHook, waitFor } from "@testing-library/react"
import { useTypewriter } from "./use-typewriter"

describe("useTypewriter - Authentic terminal content reveal", () => {
  test("begins with no content visible to build anticipation", () => {
    // Intent: Users see blank screen before typing starts (like real terminal)
    const { result } = renderHook(() => useTypewriter({ text: "Hello", speed: 50 }))

    expect(result.current.displayedText).toBe("")
    expect(result.current.isTyping).toBe(true)
  })

  test("gradually reveals text character by character for terminal aesthetic", async () => {
    // Intent: Typing animation creates authentic retro computing experience
    const { result } = renderHook(() => useTypewriter({ text: "Hi", speed: 50 }))

    expect(result.current.displayedText).toBe("")

    // Eventually reveals full content
    await waitFor(
      () => {
        expect(result.current.displayedText).toBe("Hi")
        expect(result.current.isTyping).toBe(false)
      },
      { timeout: 500 }
    )
  })

  test("signals when content is fully revealed for workflow coordination", async () => {
    // Intent: Allow chaining animations (boot → CV → prompt) by signaling completion
    const onComplete = vi.fn()

    renderHook(() => useTypewriter({ text: "Test", speed: 10, onComplete }))

    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalledTimes(1)
      },
      { timeout: 200 }
    )
  })

  test("handles empty content without breaking the experience", async () => {
    // Intent: Graceful handling when there's nothing to type
    const { result } = renderHook(() => useTypewriter({ text: "", speed: 50 }))

    await waitFor(() => {
      expect(result.current.displayedText).toBe("")
      expect(result.current.isTyping).toBe(false)
    })
  })

  test("works without completion callback for simple use cases", async () => {
    // Intent: onComplete is optional - not all typing needs follow-up actions
    const { result } = renderHook(() => useTypewriter({ text: "Test", speed: 10 }))

    await waitFor(
      () => {
        expect(result.current.isTyping).toBe(false)
      },
      { timeout: 200 }
    )

    expect(result.current.displayedText).toBe("Test")
  })

  test("resets typing when content changes to support dynamic updates", async () => {
    // Intent: Allow changing displayed content (e.g., switching between sections)
    const { result, rerender } = renderHook(({ text }) => useTypewriter({ text, speed: 10 }), {
      initialProps: { text: "First" },
    })

    // First content types out
    await waitFor(
      () => {
        expect(result.current.displayedText).toBe("First")
      },
      { timeout: 200 }
    )

    // Changing content resets and types new text
    rerender({ text: "Second" })

    await waitFor(
      () => {
        expect(result.current.displayedText).toBe("")
      },
      { timeout: 50 }
    )

    await waitFor(
      () => {
        expect(result.current.displayedText).toBe("Second")
      },
      { timeout: 200 }
    )
  })
})

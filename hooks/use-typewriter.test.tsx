/**
 * Tests for useTypewriter hook
 */

import { describe, expect, test, vi } from "bun:test"
import { renderHook, waitFor } from "@testing-library/react"
import { useTypewriter } from "./use-typewriter"

describe("useTypewriter hook", () => {
  test("initially returns empty string", () => {
    const { result } = renderHook(() => useTypewriter({ text: "Hello", speed: 50 }))

    expect(result.current.displayedText).toBe("")
    expect(result.current.isTyping).toBe(true)
  })

  test("types out text character by character", async () => {
    const { result } = renderHook(() => useTypewriter({ text: "Hi", speed: 50 }))

    expect(result.current.displayedText).toBe("")

    // Wait for typing to complete
    await waitFor(
      () => {
        expect(result.current.displayedText).toBe("Hi")
        expect(result.current.isTyping).toBe(false)
      },
      { timeout: 500 }
    )
  })

  test("calls onComplete callback when typing finishes", async () => {
    const onComplete = vi.fn()

    renderHook(() => useTypewriter({ text: "Test", speed: 10, onComplete }))

    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalledTimes(1)
      },
      { timeout: 200 }
    )
  })

  test("handles empty text", async () => {
    const { result } = renderHook(() => useTypewriter({ text: "", speed: 50 }))

    // Wait for hook to settle
    await waitFor(() => {
      expect(result.current.displayedText).toBe("")
      expect(result.current.isTyping).toBe(false)
    })
  })

  test("does not call onComplete if not provided", async () => {
    const { result } = renderHook(() => useTypewriter({ text: "Test", speed: 10 }))

    await waitFor(
      () => {
        expect(result.current.isTyping).toBe(false)
      },
      { timeout: 200 }
    )

    // Should not throw
    expect(result.current.displayedText).toBe("Test")
  })

  test("resets when text prop changes", async () => {
    const { result, rerender } = renderHook(({ text }) => useTypewriter({ text, speed: 10 }), {
      initialProps: { text: "First" },
    })

    await waitFor(
      () => {
        expect(result.current.displayedText).toBe("First")
      },
      { timeout: 200 }
    )

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

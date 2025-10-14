/**
 * Tests for useVirtualKeyboardSuppression hook - focusing on mobile UX intent
 * Intent: Prevent disruptive keyboard popups when navigating command history on mobile
 */

import { describe, expect, test } from "bun:test"
import { renderHook } from "@testing-library/react"
import type { RefObject } from "react"
import { useVirtualKeyboardSuppression } from "./use-virtual-keyboard-suppression"

describe("useVirtualKeyboardSuppression - Mobile command history navigation", () => {
  test("prevents keyboard popup when navigating command history on touch devices", () => {
    // Intent: Users navigate history with arrow keys without keyboard covering screen
    const input = document.createElement("input")
    const mockRef: RefObject<HTMLInputElement> = { current: input }

    // Simulate touch device (mobile/tablet)
    const originalMatchMedia = globalThis.matchMedia
    globalThis.matchMedia = ((query: string) => ({
      matches: query === "(pointer: coarse)",
      media: query,
      onchange: null,
      addListener: () => {
        /* stub */
      },
      removeListener: () => {
        /* stub */
      },
      addEventListener: () => {
        /* stub */
      },
      removeEventListener: () => {
        /* stub */
      },
      dispatchEvent: () => true,
    })) as typeof globalThis.matchMedia

    const { result } = renderHook(() => useVirtualKeyboardSuppression(mockRef))

    expect(input.readOnly).toBe(false)

    // When user navigates history, suppress keyboard
    result.current.suppressVirtualKeyboard()

    // Keyboard should not appear (readonly prevents it on mobile)
    expect(input.readOnly).toBe(true)

    globalThis.matchMedia = originalMatchMedia
  })

  test("allows keyboard to appear when user wants to type new command", () => {
    // Intent: After navigating history, users can type to modify or enter new commands
    const input = document.createElement("input")
    const mockRef: RefObject<HTMLInputElement> = { current: input }

    // Simulate touch device
    const originalMatchMedia = globalThis.matchMedia
    globalThis.matchMedia = ((query: string) => ({
      matches: query === "(pointer: coarse)",
      media: query,
      onchange: null,
      addListener: () => {
        /* stub */
      },
      removeListener: () => {
        /* stub */
      },
      addEventListener: () => {
        /* stub */
      },
      removeEventListener: () => {
        /* stub */
      },
      dispatchEvent: () => true,
    })) as typeof globalThis.matchMedia

    const { result } = renderHook(() => useVirtualKeyboardSuppression(mockRef))

    // Suppress during navigation
    result.current.suppressVirtualKeyboard()
    expect(input.readOnly).toBe(true)

    // Release when user wants to type
    result.current.releaseKeyboardSuppression()

    // Keyboard can now appear for typing
    expect(input.readOnly).toBe(false)

    globalThis.matchMedia = originalMatchMedia
  })

  test("handles edge cases without breaking mobile experience", () => {
    // Intent: Robust error handling - don't crash if input ref is null
    const mockRef: RefObject<HTMLInputElement> = { current: null }

    const { result } = renderHook(() => useVirtualKeyboardSuppression(mockRef))

    // Should fail gracefully when input doesn't exist yet
    expect(() => result.current.suppressVirtualKeyboard()).not.toThrow()
    expect(() => result.current.releaseKeyboardSuppression()).not.toThrow()
  })
})

/**
 * Tests for useVirtualKeyboardSuppression hook - focusing on mobile UX intent
 * Intent: Hide keyboard on mobile after Enter key to prevent screen coverage
 */

import { describe, expect, test } from "bun:test"
import { renderHook } from "@testing-library/react"
import type { RefObject } from "react"
import { useVirtualKeyboardSuppression } from "./intercom-use-virtual-keyboard-suppression"

describe("useVirtualKeyboardSuppression - Mobile keyboard control", () => {
  test("hides keyboard after command submission on touch devices", () => {
    // Intent: After pressing Enter, keyboard should hide so user can see terminal output
    const input = document.createElement("input")
    document.body.appendChild(input)
    input.focus()
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

    // Input should be focused initially
    expect(document.activeElement).toBe(input)

    // When user presses Enter, suppress keyboard
    result.current.suppressVirtualKeyboard()

    // Keyboard should hide (blur removes focus)
    expect(document.activeElement).not.toBe(input)

    document.body.removeChild(input)
    globalThis.matchMedia = originalMatchMedia
  })

  test("keeps input focused on desktop devices", () => {
    // Intent: Desktop users don't need keyboard suppression, focus should remain
    const input = document.createElement("input")
    document.body.appendChild(input)
    input.focus()
    const mockRef: RefObject<HTMLInputElement> = { current: input }

    // Simulate desktop device (mouse pointer)
    const originalMatchMedia = globalThis.matchMedia
    globalThis.matchMedia = ((query: string) => ({
      matches: query === "(pointer: fine)",
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

    expect(document.activeElement).toBe(input)

    // Desktop: suppress should do nothing
    result.current.suppressVirtualKeyboard()

    // Focus should remain on desktop
    expect(document.activeElement).toBe(input)

    document.body.removeChild(input)
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

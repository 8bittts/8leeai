/**
 * Tests for useVirtualKeyboardSuppression hook
 */

import { describe, expect, test } from "bun:test"
import { renderHook } from "@testing-library/react"
import type { RefObject } from "react"
import { useVirtualKeyboardSuppression } from "./use-virtual-keyboard-suppression"

describe("useVirtualKeyboardSuppression hook", () => {
  test("returns suppressVirtualKeyboard and releaseKeyboardSuppression functions", () => {
    const mockRef: RefObject<HTMLInputElement> = {
      current: document.createElement("input"),
    }

    const { result } = renderHook(() => useVirtualKeyboardSuppression(mockRef))

    expect(result.current.suppressVirtualKeyboard).toBeInstanceOf(Function)
    expect(result.current.releaseKeyboardSuppression).toBeInstanceOf(Function)
  })

  test("suppressVirtualKeyboard sets readonly attribute on touch devices", () => {
    const input = document.createElement("input")
    const mockRef: RefObject<HTMLInputElement> = { current: input }

    // Mock matchMedia to simulate touch device
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

    result.current.suppressVirtualKeyboard()

    expect(input.readOnly).toBe(true)

    // Restore original
    globalThis.matchMedia = originalMatchMedia
  })

  test("releaseKeyboardSuppression removes readonly attribute immediately", () => {
    const input = document.createElement("input")
    const mockRef: RefObject<HTMLInputElement> = { current: input }

    // Mock matchMedia to simulate touch device
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

    result.current.suppressVirtualKeyboard()
    expect(input.readOnly).toBe(true)

    result.current.releaseKeyboardSuppression()

    // Should be released immediately
    expect(input.readOnly).toBe(false)

    // Restore original
    globalThis.matchMedia = originalMatchMedia
  })

  test("handles null ref gracefully", () => {
    const mockRef: RefObject<HTMLInputElement> = { current: null }

    const { result } = renderHook(() => useVirtualKeyboardSuppression(mockRef))

    // Should not throw
    expect(() => result.current.suppressVirtualKeyboard()).not.toThrow()
    expect(() => result.current.releaseKeyboardSuppression()).not.toThrow()
  })

  test("cleanup function exists", () => {
    const input = document.createElement("input")
    const mockRef: RefObject<HTMLInputElement> = { current: input }

    const { unmount } = renderHook(() => useVirtualKeyboardSuppression(mockRef))

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow()
  })
})

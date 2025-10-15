import { useCallback } from "react"

/**
 * Custom hook for suppressing virtual keyboard on mobile devices
 * Useful for command-line interfaces where keyboard popup on Enter is undesirable
 * Simple approach: blur input on mobile to hide keyboard, user taps to show it again
 */
export function useVirtualKeyboardSuppression(inputRef: React.RefObject<HTMLInputElement | null>) {
  const releaseKeyboardSuppression = useCallback(() => {
    // No-op for compatibility - focusing is now explicit
  }, [])

  const suppressVirtualKeyboard = useCallback(() => {
    const input = inputRef.current
    if (!input) return

    // Desktop: do nothing, keep focus
    const prefersTouch = globalThis?.matchMedia?.("(pointer: coarse)")?.matches ?? false
    if (!prefersTouch) {
      return
    }

    // Mobile: blur to hide keyboard
    // User can tap input again when they want to type
    input.blur()
  }, [inputRef])

  return {
    suppressVirtualKeyboard,
    releaseKeyboardSuppression,
  }
}

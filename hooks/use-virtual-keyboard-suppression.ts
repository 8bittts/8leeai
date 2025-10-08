import { useCallback, useRef } from "react"

/**
 * Custom hook for suppressing virtual keyboard on mobile devices
 * Useful for command-line interfaces where keyboard popup on Enter is undesirable
 * Provides mechanism to suppress keyboard and release suppression when needed
 */
export function useVirtualKeyboardSuppression(inputRef: React.RefObject<HTMLInputElement | null>) {
  const keyboardReleaseRef = useRef<(() => void) | null>(null)

  const releaseKeyboardSuppression = useCallback(() => {
    keyboardReleaseRef.current?.()
    keyboardReleaseRef.current = null
  }, [])

  const suppressVirtualKeyboard = useCallback(() => {
    const input = inputRef.current
    if (!input) return

    // Desktop: just focus the input normally
    const prefersTouch = globalThis?.matchMedia?.("(pointer: coarse)")?.matches ?? false
    if (!prefersTouch) {
      requestAnimationFrame(() => {
        try {
          input.focus({ preventScroll: true })
        } catch {
          input.focus()
        }
      })
      return
    }

    releaseKeyboardSuppression()

    // Try modern Virtual Keyboard API first (Chrome 94+)
    const virtualKeyboard = (
      navigator as unknown as {
        readonly virtualKeyboard?: { hide?: () => Promise<void> }
      }
    ).virtualKeyboard

    // Fallback: manipulate input attributes to prevent keyboard popup
    const fallbackSuppress = () => {
      const previousInputMode = input.getAttribute("inputmode")
      const wasReadOnly = input.hasAttribute("readonly")

      input.setAttribute("inputmode", "none")
      input.setAttribute("readonly", "true")

      const cleanup = () => {
        if (!wasReadOnly) {
          input.removeAttribute("readonly")
        }
        if (previousInputMode) {
          input.setAttribute("inputmode", previousInputMode)
        } else {
          input.removeAttribute("inputmode")
        }
        keyboardReleaseRef.current = null
      }

      // Re-enable input when user taps/types
      const allowInput = () => {
        cleanup()
        requestAnimationFrame(() => {
          try {
            input.focus({ preventScroll: true })
          } catch {
            input.focus()
          }
          input.setSelectionRange?.(input.value.length, input.value.length)
        })
      }

      input.addEventListener("pointerdown", allowInput, { once: true })
      input.addEventListener("keydown", allowInput, { once: true })

      keyboardReleaseRef.current = () => {
        input.removeEventListener("pointerdown", allowInput)
        input.removeEventListener("keydown", allowInput)
        cleanup()
      }

      // Blur then refocus to apply readonly/inputmode changes
      requestAnimationFrame(() => {
        input.blur()
        requestAnimationFrame(() => {
          try {
            input.focus({ preventScroll: true })
          } catch {
            input.focus()
          }
          input.setSelectionRange?.(input.value.length, input.value.length)
        })
      })
    }

    // Use modern API if available, otherwise fallback
    if (virtualKeyboard?.hide) {
      virtualKeyboard.hide().catch(() => {
        fallbackSuppress()
      })
      requestAnimationFrame(() => {
        input.setSelectionRange?.(input.value.length, input.value.length)
      })
      return
    }

    fallbackSuppress()
  }, [inputRef, releaseKeyboardSuppression])

  return {
    suppressVirtualKeyboard,
    releaseKeyboardSuppression,
  }
}

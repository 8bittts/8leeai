/**
 * Tests for Cursor component - focusing on user intent
 * Intent: Provide visual feedback that terminal is active and ready for input
 */

import { describe, expect, test } from "bun:test"
import { render } from "@testing-library/react"
import { Cursor } from "./cursor"

describe("Cursor - Visual feedback for terminal readiness", () => {
  test("provides visible indicator that terminal is active", () => {
    const { container } = render(<Cursor />)
    const cursor = container.querySelector("span")

    // Intent: Users need to see the terminal is ready for input
    // Cursor must render visibly on screen
    expect(cursor).toBeTruthy()
  })

  test("hidden from screen readers to avoid confusion", () => {
    const { container } = render(<Cursor />)
    const cursor = container.querySelector("span")

    // Intent: Visual indicator only - screen readers should announce actual content
    expect(cursor?.getAttribute("aria-hidden")).toBe("true")
  })
})

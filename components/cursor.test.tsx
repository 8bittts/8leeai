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
    expect(cursor).toBeTruthy()
    expect(cursor?.className).toContain("animate-pulse") // Blinking draws attention
  })

  test("supports different visual states for different contexts", () => {
    // Intent: Different cursor colors indicate different terminal states
    const { container: greenContainer } = render(<Cursor variant="green" />)
    const { container: blackContainer } = render(<Cursor variant="black" />)

    const greenCursor = greenContainer.querySelector("span")
    const blackCursor = blackContainer.querySelector("span")

    // Users can distinguish between active (green) and inactive (black) states
    expect(greenCursor?.className).toContain("bg-green-500")
    expect(blackCursor?.className).toContain("bg-black")
  })

  test("hidden from screen readers to avoid confusion", () => {
    const { container } = render(<Cursor />)
    const cursor = container.querySelector("span")

    // Intent: Visual indicator only - screen readers should announce actual content
    expect(cursor?.getAttribute("aria-hidden")).toBe("true")
  })

  test("renders as thin blinking line matching classic terminal cursor", () => {
    const { container } = render(<Cursor />)
    const cursor = container.querySelector("span")

    // Intent: Authentic DOS terminal aesthetic requires thin vertical cursor
    expect(cursor?.className).toContain("w-px") // 1px width = thin line
    expect(cursor?.className).toContain("h-4") // Matches text height
  })
})

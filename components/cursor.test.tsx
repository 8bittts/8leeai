/**
 * Tests for Cursor component
 */

import { describe, expect, test } from "bun:test"
import { render } from "@testing-library/react"
import { Cursor } from "./cursor"

describe("Cursor component", () => {
  test("renders with default green variant", () => {
    const { container } = render(<Cursor />)
    const span = container.querySelector("span")

    expect(span).toBeTruthy()
    expect(span?.className).toContain("bg-green-500")
    expect(span?.className).toContain("animate-pulse")
    expect(span?.className).toContain("w-px")
    expect(span?.className).toContain("h-4")
  })

  test("renders with green variant explicitly", () => {
    const { container } = render(<Cursor variant="green" />)
    const span = container.querySelector("span")

    expect(span?.className).toContain("bg-green-500")
  })

  test("renders with black variant", () => {
    const { container } = render(<Cursor variant="black" />)
    const span = container.querySelector("span")

    expect(span?.className).toContain("bg-black")
    expect(span?.className).not.toContain("bg-green-500")
  })

  test("has aria-hidden attribute", () => {
    const { container } = render(<Cursor />)
    const span = container.querySelector("span")

    expect(span?.getAttribute("aria-hidden")).toBe("true")
  })

  test("has correct dimensions", () => {
    const { container } = render(<Cursor />)
    const span = container.querySelector("span")

    expect(span?.className).toContain("w-px") // 1px width
    expect(span?.className).toContain("h-4") // 16px height
  })

  test("includes margin left", () => {
    const { container } = render(<Cursor />)
    const span = container.querySelector("span")

    expect(span?.className).toContain("ml-0.5")
  })
})

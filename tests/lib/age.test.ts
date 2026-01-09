/**
 * Tests for age calculation utilities
 */
import { describe, expect, test } from "bun:test"
import {
  BIRTH_DAY,
  BIRTH_MONTH,
  BIRTH_YEAR,
  calculateAge,
  calculateAgeInYears,
} from "../../lib/age"

describe("calculateAge - Integer age calculation for display", () => {
  test("returns correct age before birthday in current year", () => {
    // Intent: Before the birthday, age should be one year less
    const beforeBirthday = new Date(2024, BIRTH_MONTH - 1, BIRTH_DAY) // October 9, 2024
    expect(calculateAge(beforeBirthday)).toBe(41)
  })

  test("returns correct age on birthday", () => {
    // Intent: On the birthday, the new age should be reflected
    const onBirthday = new Date(2024, BIRTH_MONTH, BIRTH_DAY) // November 9, 2024
    expect(calculateAge(onBirthday)).toBe(42)
  })

  test("returns correct age after birthday", () => {
    // Intent: After birthday, age remains the same until next year
    const afterBirthday = new Date(2024, 11, 25) // December 25, 2024
    expect(calculateAge(afterBirthday)).toBe(42)
  })
})

describe("calculateAgeInYears - Precise age with decimal for version display", () => {
  test("returns integer on birthday (no progress toward next)", () => {
    // Intent: On the birthday, progress should be 0, so age is exactly an integer
    const onBirthday = new Date(2024, BIRTH_MONTH, BIRTH_DAY)
    const age = calculateAgeInYears(onBirthday)
    expect(Math.floor(age)).toBe(42)
    expect(age % 1).toBeCloseTo(0, 5)
  })

  test("returns approximately 0.5 halfway through the year", () => {
    // Intent: Halfway between birthdays should show ~0.5 progress
    // November 9 to May 9 is roughly half a year
    const halfwayDate = new Date(2025, 4, 9) // May 9, 2025
    const age = calculateAgeInYears(halfwayDate)
    expect(Math.floor(age)).toBe(42)
    expect(age % 1).toBeCloseTo(0.5, 1)
  })

  test("returns value less than next integer just before birthday", () => {
    // Intent: Just before the birthday, age should be close to but not reach the next integer
    const dayBeforeBirthday = new Date(2025, BIRTH_MONTH, BIRTH_DAY - 1) // November 8, 2025
    const age = calculateAgeInYears(dayBeforeBirthday)
    expect(Math.floor(age)).toBe(42)
    expect(age % 1).toBeGreaterThan(0.9)
  })
})

describe("Birth date constants - Consistent reference values", () => {
  test("exports correct birth date components", () => {
    // Intent: Ensure constants match expected values for calculations
    expect(BIRTH_YEAR).toBe(1982)
    expect(BIRTH_MONTH).toBe(10) // November (0-indexed)
    expect(BIRTH_DAY).toBe(9)
  })
})

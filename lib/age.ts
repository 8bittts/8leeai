/**
 * Age calculation utilities
 * Birth date: November 9, 1982
 */

export const BIRTH_YEAR = 1982
export const BIRTH_MONTH = 10 // November (0-indexed)
export const BIRTH_DAY = 9

/**
 * Calculate age in years with decimal precision.
 * Used for version labels that update throughout the year.
 */
export function calculateAgeInYears(date: Date): number {
  const year = date.getFullYear()
  const birthdayThisYear = new Date(year, BIRTH_MONTH, BIRTH_DAY)
  const hasHadBirthday = date >= birthdayThisYear

  const baseAge = year - BIRTH_YEAR - (hasHadBirthday ? 0 : 1)
  const lastBirthdayYear = hasHadBirthday ? year : year - 1
  const lastBirthday = new Date(lastBirthdayYear, BIRTH_MONTH, BIRTH_DAY)
  const nextBirthday = new Date(lastBirthdayYear + 1, BIRTH_MONTH, BIRTH_DAY)

  const elapsed = date.getTime() - lastBirthday.getTime()
  const span = nextBirthday.getTime() - lastBirthday.getTime()
  const progress = Math.min(Math.max(elapsed / span, 0), 1)

  return baseAge + progress
}

/**
 * Calculate age as a whole number (years completed).
 */
export function calculateAge(date: Date): number {
  return Math.floor(calculateAgeInYears(date))
}

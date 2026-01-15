import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import type { Dayjs, OpUnitType, ManipulateType } from 'dayjs'

// Extend dayjs with plugins
dayjs.extend(isSameOrBefore)

// Re-export types for convenience
export type { Dayjs } from 'dayjs'

/**
 * Check if a date is the same as or before another date
 * @param date - The date to check
 * @param compareDate - The date to compare against
 * @param unit - Optional unit of comparison (e.g., 'month', 'day', 'year')
 * @returns true if date is same or before compareDate
 */
export const isSameOrBeforeDate = (
  date: string | number | Date | Dayjs,
  compareDate: string | number | Date | Dayjs,
  unit?: OpUnitType,
): boolean => {
  return dayjs(date).isSameOrBefore(compareDate, unit)
}

/**
 * Check if a date is after another date
 * @param date - The date to check
 * @param compareDate - The date to compare against
 * @param unit - Optional unit of comparison (e.g., 'month', 'day', 'year')
 * @returns true if date is after compareDate
 */
export const isAfterDate = (
  date: string | number | Date | Dayjs,
  compareDate: string | number | Date | Dayjs,
  unit?: OpUnitType,
): boolean => {
  return dayjs(date).isAfter(compareDate, unit)
}

/**
 * Check if a date is before another date
 * @param date - The date to check
 * @param compareDate - The date to compare against
 * @param unit - Optional unit of comparison (e.g., 'month', 'day', 'year')
 * @returns true if date is before compareDate
 */
export const isBeforeDate = (
  date: string | number | Date | Dayjs,
  compareDate: string | number | Date | Dayjs,
  unit?: OpUnitType,
): boolean => {
  return dayjs(date).isBefore(compareDate, unit)
}

/**
 * Check if a date is the same as another date
 * @param date - The date to check
 * @param compareDate - The date to compare against
 * @param unit - Optional unit of comparison (e.g., 'month', 'day', 'year')
 * @returns true if dates are the same
 */
export const isSameDate = (
  date: string | number | Date | Dayjs,
  compareDate: string | number | Date | Dayjs,
  unit?: OpUnitType,
): boolean => {
  return dayjs(date).isSame(compareDate, unit)
}

/**
 * Check if a date is valid
 * @param date - The date to validate
 * @returns true if date is valid
 */
export const isValidDate = (date: string | number | Date | Dayjs | null | undefined): boolean => {
  if (date == null) return false
  return dayjs(date).isValid()
}

/**
 * Get the current date/time
 * @returns Dayjs object representing current date/time
 */
export const getCurrentDate = (): Dayjs => {
  return dayjs()
}

/**
 * Create a dayjs object from a date
 * @param date - The date to parse (optional, defaults to current date)
 * @param format - Optional format string for parsing
 * @returns Dayjs object
 */
export const createDate = (
  date?: string | number | Date | Dayjs | null,
  format?: string,
): Dayjs => {
  if (date == null) {
    return dayjs()
  }
  if (format) {
    return dayjs(date, format)
  }
  return dayjs(date)
}

/**
 * Format a date string
 * @param date - The date to format
 * @param format - The format pattern (default: 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | number | Date | Dayjs | null | undefined,
  format = 'YYYY-MM-DD',
): string => {
  if (date == null) return ''
  const d = dayjs(date)
  return d.isValid() ? d.format(format) : ''
}

/**
 * Add time to a date
 * @param date - The date to add to
 * @param amount - The amount to add
 * @param unit - The unit of time (e.g., 'month', 'day', 'year')
 * @returns New Dayjs object with added time
 */
export const addDate = (
  date: string | number | Date | Dayjs,
  amount: number,
  unit: ManipulateType,
): Dayjs => {
  return dayjs(date).add(amount, unit)
}

/**
 * Subtract time from a date
 * @param date - The date to subtract from
 * @param amount - The amount to subtract
 * @param unit - The unit of time (e.g., 'month', 'day', 'year')
 * @returns New Dayjs object with subtracted time
 */
export const subtractDate = (
  date: string | number | Date | Dayjs,
  amount: number,
  unit: ManipulateType,
): Dayjs => {
  return dayjs(date).subtract(amount, unit)
}

/**
 * Get the start of a unit of time
 * @param date - The date
 * @param unit - The unit of time (e.g., 'month', 'day', 'year')
 * @returns Dayjs object at the start of the unit
 */
export const startOfDate = (date: string | number | Date | Dayjs, unit: OpUnitType): Dayjs => {
  return dayjs(date).startOf(unit)
}

/**
 * Get the end of a unit of time
 * @param date - The date
 * @param unit - The unit of time (e.g., 'month', 'day', 'year')
 * @returns Dayjs object at the end of the unit
 */
export const endOfDate = (date: string | number | Date | Dayjs, unit: OpUnitType): Dayjs => {
  return dayjs(date).endOf(unit)
}

/**
 * Clone a date object
 * @param date - The date to clone
 * @returns New Dayjs object with the same value
 */
export const cloneDate = (date: string | number | Date | Dayjs): Dayjs => {
  return dayjs(date).clone()
}

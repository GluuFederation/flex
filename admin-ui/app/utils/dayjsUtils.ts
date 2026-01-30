import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { Dayjs, OpUnitType, ManipulateType } from 'dayjs'

dayjs.extend(isSameOrBefore)
dayjs.extend(customParseFormat)

export type { Dayjs } from 'dayjs'

export const DATE_FORMATS = {
  DATE_ONLY: 'YYYY-MM-DD',
  DATETIME_SECONDS: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_AMPM: 'YYYY-MM-DD h:mm:ss A',
  DATETIME_LONG: 'ddd, MMM DD, YYYY h:mm:ss A',
  TOKEN_DATETIME: 'YYYY/DD/MM HH:mm:ss',
} as const

export const diffDate = (
  dateA: string | number | Date | Dayjs,
  dateB: string | number | Date | Dayjs,
  unit?: OpUnitType,
): number => {
  return dayjs(dateA).diff(dateB, unit)
}

export const isSameOrBeforeDate = (
  date: string | number | Date | Dayjs,
  compareDate: string | number | Date | Dayjs,
  unit?: OpUnitType,
): boolean => {
  return dayjs(date).isSameOrBefore(compareDate, unit)
}

export const isAfterDate = (
  date: string | number | Date | Dayjs,
  compareDate: string | number | Date | Dayjs,
  unit?: OpUnitType,
): boolean => {
  return dayjs(date).isAfter(compareDate, unit)
}

export const isBeforeDate = (
  date: string | number | Date | Dayjs,
  compareDate: string | number | Date | Dayjs,
  unit?: OpUnitType,
): boolean => {
  return dayjs(date).isBefore(compareDate, unit)
}

export const isSameDate = (
  date: string | number | Date | Dayjs,
  compareDate: string | number | Date | Dayjs,
  unit?: OpUnitType,
): boolean => {
  return dayjs(date).isSame(compareDate, unit)
}

export const isValidDate = (date: string | number | Date | Dayjs | null | undefined): boolean => {
  if (date == null) return false
  return dayjs(date).isValid()
}

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

export const parseDateStrict = (date: string, format: string): Dayjs | null => {
  const parsed = dayjs(date, format, true)
  return parsed.isValid() ? parsed : null
}

export const formatDate = (
  date: string | number | Date | Dayjs | null | undefined,
  format: string = DATE_FORMATS.DATE_ONLY,
): string => {
  if (date == null) return ''
  const d = dayjs(date)
  return d.isValid() ? d.format(format) : ''
}

export const addDate = (
  date: string | number | Date | Dayjs,
  amount: number,
  unit: ManipulateType,
): Dayjs => {
  return dayjs(date).add(amount, unit)
}

export const subtractDate = (
  date: string | number | Date | Dayjs,
  amount: number,
  unit: ManipulateType,
): Dayjs => {
  return dayjs(date).subtract(amount, unit)
}

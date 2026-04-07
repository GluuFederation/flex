import customColors from '@/customColors'
import { REGEX_UUID_PLACEHOLDER_CHARS } from '@/utils/regex'

export function uuidv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(REGEX_UUID_PLACEHOLDER_CHARS, function (c) {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const colorPalette: string[] = [
  customColors.logo,
  customColors.white,
  customColors.black,
  customColors.darkGray,
  customColors.accentRed,
  customColors.logo,
  customColors.orange,
  customColors.lightBlue,
]

export function getNewColor(index = 0): string {
  return colorPalette[index % colorPalette.length]
}

export const getClientScopeByInum = (str: string): string => {
  const inum = str.split(',')[0]
  const value = inum.split('=')[1]
  return value
}

export function getYearMonth(date: Date): string {
  return date.getFullYear() + getMonth(date)
}

export function getMonth(aDate: Date): string {
  const value = String(aDate.getMonth() + 1)
  if (value.length > 1) {
    return value
  } else {
    return '0' + value
  }
}

export function formatDate(date?: string): string {
  if (!date) {
    return '-'
  }
  if (date.length > 10) {
    return date.substring(0, 10)
  }
  if (date.length == 10) {
    return date
  }
  return '-'
}

export const trimObjectStrings = <T extends object>(obj: T): T => {
  const trimmed: Partial<T> = {}
  for (const [key, value] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
    if (typeof value === 'string') {
      trimmed[key] = value.trim() as T[keyof T]
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      trimmed[key] = trimObjectStrings(value) as T[keyof T]
    } else {
      trimmed[key] = value
    }
  }
  return trimmed as T
}

export const filterEmptyObjects = <T extends object>(items?: T[]): T[] => {
  return (items || []).filter((item) => item && Object.keys(item).length !== 0)
}

export const mapPropertyToKeyValue = (prop: {
  key?: string
  value?: string
  value1?: string
  value2?: string
  description?: string
}): { key: string; value: string; description?: string } => {
  const key = (prop.key ?? prop.value1 ?? '').trim()
  const value = (prop.value ?? prop.value2 ?? '').trim()
  return { key, value, description: prop.description }
}

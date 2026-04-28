import { REGEX_UUID_PLACEHOLDER_CHARS } from '@/utils/regex'

export const uuidv4 = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(REGEX_UUID_PLACEHOLDER_CHARS, (c) => {
    const r = crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const getClientScopeByInum = (str: string): string => {
  const inum = str.split(',')[0]
  const value = inum.split('=')[1]
  return value
}

export const getMonth = (aDate: Date): string => {
  const value = String(aDate.getMonth() + 1)
  if (value.length > 1) {
    return value
  } else {
    return '0' + value
  }
}

export const getYearMonth = (date: Date): string => date.getFullYear() + getMonth(date)

export const formatDate = (date?: string): string => {
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

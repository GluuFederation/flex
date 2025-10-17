import customColors from '@/customColors'

export function uuidv4(): string {
  // Use Web Crypto API if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Predefined color palette for consistent colors
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
  // Use modulo to cycle through the palette
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

export const trimObjectStrings = <T extends Record<string, unknown>>(obj: T): T => {
  const trimmed: Record<string, unknown> = {}
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      trimmed[key] = (obj[key] as string).trim()
    } else if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      trimmed[key] = trimObjectStrings(obj[key] as Record<string, unknown>)
    } else {
      trimmed[key] = obj[key]
    }
  }
  return trimmed as T
}

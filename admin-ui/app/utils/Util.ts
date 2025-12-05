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

export const trimObjectStrings = <T extends object>(obj: T): T => {
  const source = obj as unknown as Record<string, unknown>
  const trimmed: Record<string, unknown> = {}
  for (const key in source) {
    const value = source[key]
    if (typeof value === 'string') {
      trimmed[key] = value.trim()
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      trimmed[key] = trimObjectStrings(value as Record<string, unknown>)
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

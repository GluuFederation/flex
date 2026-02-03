const EMPTY_PLACEHOLDER = '-'

export function formatLicenseFieldValue(value: string | number | null | undefined): string {
  if (value == null) return EMPTY_PLACEHOLDER
  if (typeof value === 'string' && value.trim() === '') return EMPTY_PLACEHOLDER
  return String(value)
}

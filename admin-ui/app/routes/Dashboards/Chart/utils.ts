import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export const formatTooltipValue = (value: JsonValue): string => {
  if (value == null) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return JSON.stringify(value)
}

import type { JsonPatch } from 'JansConfigApi'
import type { AppConfiguration, PropertyValue } from '../components/AuthServerProperties/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/index'

export const toPairs = (keys: string[]): Array<[string, string | null]> => {
  const rows: Array<[string, string | null]> = []
  for (let i = 0; i < keys.length; i += 2) {
    rows.push([keys[i], keys[i + 1] ?? null])
  }
  return rows
}

export const generateLabel = (name: string): string => {
  const result = name.replace(/([A-Z])/g, ' $1').trim()
  if (!result) return ''
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export const isSimplePropertyValue = (value: PropertyValue): boolean => {
  if (value == null) return true
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true
  }
  if (Array.isArray(value)) {
    return value.length === 0 || value.every((item) => typeof item === 'string')
  }
  return false
}

export const formatPatchValue = (patch: JsonPatch): JsonValue => {
  if (patch.op === 'remove') return '(removed)'
  const val = patch.value
  if (val === null || val === undefined) return null
  if (typeof val === 'object') return JSON.stringify(val)
  return val as JsonValue
}

export const getBaselineValue = (baseline: AppConfiguration, patchPath: string): PropertyValue => {
  const segments = patchPath.replace(/^\//, '').split('/')
  let value: PropertyValue = baseline
  for (const segment of segments) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      value = (value as AppConfiguration)[segment]
    } else {
      return undefined
    }
  }
  return value
}

export const isPatchNoOp = (patch: JsonPatch, baseline: AppConfiguration | null): boolean => {
  if (patch.op !== 'replace' || !baseline) return false
  const path = typeof patch.path === 'string' ? patch.path : ''
  const baselineValue = getBaselineValue(baseline, path)
  return JSON.stringify(patch.value) === JSON.stringify(baselineValue)
}

export const hasConfigurationChanges = (
  patchCount: number,
  currentValues: AppConfiguration | null,
  baseline: AppConfiguration | null,
): boolean => {
  if (patchCount === 0) return false
  if (!baseline) return patchCount > 0
  return JSON.stringify(currentValues) !== JSON.stringify(baseline)
}

export const formatPatchPath = (
  rawPath: string,
  labelResolver?: (key: string) => string,
): string => {
  const segments = rawPath.replace(/^\//, '').split('/')
  const label = labelResolver ? labelResolver(segments[0]) : generateLabel(segments[0])
  if (segments.length > 1) {
    return `${label} [${segments.slice(1).join('/')}]`
  }
  return label
}

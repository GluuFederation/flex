import type { ApiAppConfiguration, JsonPatch } from '../types'
import { REGEX_LEADING_SLASH } from '@/utils/regex'
import { devLogger } from '@/utils/devLogger'
import type { PropertyValue } from '../../AuthServerProperties/types'

type TraversableValue = PropertyValue | PropertyValue[]

export const extractObjectArray = (
  value: PropertyValue,
): Record<string, PropertyValue>[] | null => {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }
  if (!value.every((item) => typeof item === 'object' && item !== null && !Array.isArray(item))) {
    return null
  }
  return value as PropertyValue[] as Record<string, PropertyValue>[]
}

export const extractRecord = (value: PropertyValue): Record<string, PropertyValue> | null => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, PropertyValue>
  }
  return null
}

export const updateValuesAfterRemoval = (
  currentValues: ApiAppConfiguration,
  parentField: string | null,
  arrayField: string,
  indexToRemove: number,
): ApiAppConfiguration | null => {
  let currentArray: Record<string, PropertyValue>[] | undefined

  if (parentField) {
    const parentValue = currentValues[parentField as keyof ApiAppConfiguration]
    const parentRecord = extractRecord(parentValue as PropertyValue)
    if (parentRecord) {
      const arrayValue = parentRecord[arrayField]
      const extractedArray = extractObjectArray(arrayValue as PropertyValue)
      if (extractedArray) {
        currentArray = extractedArray
      }
    }
  } else {
    const arrayValue = currentValues[arrayField as keyof ApiAppConfiguration]
    const extractedArray = extractObjectArray(arrayValue as PropertyValue)
    if (extractedArray) {
      currentArray = extractedArray
    }
  }

  if (!Array.isArray(currentArray) || indexToRemove < 0 || indexToRemove >= currentArray.length) {
    return null
  }

  const newArray = currentArray.filter((_, index) => index !== indexToRemove)

  const updatedValues = parentField
    ? (() => {
        const parentValue = currentValues[parentField as keyof ApiAppConfiguration]
        const parentRecord = extractRecord(parentValue as PropertyValue)
        if (parentRecord) {
          return {
            ...currentValues,
            [parentField]: {
              ...parentRecord,
              [arrayField]: newArray,
            },
          } as ApiAppConfiguration
        }
        return null
      })()
    : ({
        ...currentValues,
        [arrayField]: newArray,
      } as ApiAppConfiguration)

  return updatedValues
}

const getNestedValue = (obj: ApiAppConfiguration, path: string[]): TraversableValue | null => {
  if (!obj || path.length === 0) {
    return null
  }

  let current: PropertyValue | PropertyValue[] | ApiAppConfiguration = obj
  for (let i = 0; i < path.length - 1; i++) {
    if (current === null || current === undefined) {
      return null
    }

    const part = path[i]
    const index = parseInt(part, 10)

    if (!isNaN(index) && part === String(index)) {
      if (!Array.isArray(current)) {
        return null
      }
      if (index < 0 || index >= current.length) {
        return null
      }
      current = current[index] as PropertyValue | PropertyValue[] | ApiAppConfiguration
    } else if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      const key = String(part)
      if (key in current) {
        current = (current as Record<string, PropertyValue>)[key] as
          | PropertyValue
          | PropertyValue[]
          | ApiAppConfiguration
      } else {
        return null
      }
    } else {
      return null
    }
  }
  return current as TraversableValue
}

export const applyPatchToValues = (values: ApiAppConfiguration, patch: JsonPatch): void => {
  if (!patch.path || patch.op !== 'replace') return

  try {
    const pathStr = typeof patch.path === 'string' ? patch.path : ''
    const cleaned = pathStr.replace(REGEX_LEADING_SLASH, '').trim()
    if (cleaned === '') return
    const pathParts = cleaned.split('/')
    if (pathParts.length === 0 || pathParts.some((segment) => segment === '')) {
      devLogger.warn('[applyPatchToValues] Rejecting malformed patch path:', pathStr)
      return
    }

    const target = getNestedValue(values, pathParts)
    if (target === null) {
      return
    }

    const lastPart = pathParts[pathParts.length - 1]
    const lastIndex = parseInt(lastPart, 10)

    if (!isNaN(lastIndex) && lastPart === String(lastIndex) && Number.isInteger(lastIndex)) {
      if (Array.isArray(target)) {
        if (lastIndex >= 0 && lastIndex < target.length) {
          target[lastIndex] = patch.value as PropertyValue
        }
      }
    } else if (typeof target === 'object' && target !== null && !Array.isArray(target)) {
      const objTarget = target as Record<string, PropertyValue>
      objTarget[lastPart] = patch.value as PropertyValue
    }
  } catch (error) {
    devLogger.error(
      '[applyPatchToValues] Error applying replace patch:',
      error instanceof Error ? error : String(error),
    )
  }
}

export const applyRemovePatchToValues = (values: ApiAppConfiguration, patch: JsonPatch): void => {
  if (!patch.path || patch.op !== 'remove') return

  try {
    const pathStr = typeof patch.path === 'string' ? patch.path : ''
    const cleaned = pathStr.replace(REGEX_LEADING_SLASH, '').trim()
    if (cleaned === '') return
    const pathParts = cleaned.split('/')
    if (pathParts.length === 0 || pathParts.some((segment) => segment === '')) {
      devLogger.warn('[applyRemovePatchToValues] Rejecting malformed patch path:', pathStr)
      return
    }

    const target = getNestedValue(values, pathParts)
    if (target === null) {
      return
    }

    const lastPart = pathParts[pathParts.length - 1]
    const lastIndex = parseInt(lastPart, 10)
    if (
      !isNaN(lastIndex) &&
      lastPart === String(lastIndex) &&
      Number.isInteger(lastIndex) &&
      Array.isArray(target)
    ) {
      target.splice(lastIndex, 1)
    }
  } catch (error) {
    devLogger.error(
      '[applyRemovePatchToValues] Error applying remove patch:',
      error instanceof Error ? error : String(error),
    )
  }
}

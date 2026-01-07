import type { ApiAppConfiguration } from '../types'
import type { PropertyValue } from '../../types'

export const extractObjectArray = (
  value: PropertyValue,
): Record<string, PropertyValue>[] | null => {
  if (!Array.isArray(value) || value.length === 0) {
    return null
  }
  const firstItem = value[0]
  if (typeof firstItem !== 'object' || firstItem === null || Array.isArray(firstItem)) {
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

  if (newArray.length !== currentArray.length - 1) {
    return null
  }

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

import type {
  ModifiedFields,
  ModifiedFieldValue,
  FormFieldValue,
  UserEditFormValues,
} from '../types'

export const isEmptyValue = (value: FormFieldValue): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

const valuesEqual = (a: FormFieldValue, b: FormFieldValue): boolean => {
  if (isEmptyValue(a) && isEmptyValue(b)) return true
  if (Array.isArray(a) || Array.isArray(b)) {
    const aArr = Array.isArray(a) ? a : []
    const bArr = Array.isArray(b) ? b : []
    return aArr.length === bArr.length && aArr.every((value, index) => value === bArr[index])
  }
  return a === b
}

const toModifiedValue = (value: FormFieldValue): ModifiedFieldValue => {
  if (Array.isArray(value))
    return value.filter((entry): entry is string => typeof entry === 'string')
  if (typeof value === 'boolean') return value
  return value == null ? '' : String(value)
}

export const diffFormValues = (
  values: UserEditFormValues,
  initialValues: UserEditFormValues,
  ignoreKeys: readonly string[] = [],
): ModifiedFields => {
  const ignore = new Set(ignoreKeys)
  const result: ModifiedFields = {}
  const keys = new Set([...Object.keys(initialValues), ...Object.keys(values)])
  for (const key of keys) {
    if (ignore.has(key)) continue
    if (!valuesEqual(values[key], initialValues[key])) {
      result[key] = toModifiedValue(values[key])
    }
  }
  return result
}

export const shouldDisableApplyButton = (
  isSubmitting: boolean,
  isDirty: boolean,
  isValid: boolean,
  modifiedFields: ModifiedFields,
): boolean => {
  const hasModifiedFields = Object.keys(modifiedFields).length > 0
  const isFormChanged = isDirty || hasModifiedFields

  if (isSubmitting || !isFormChanged) return true
  if (!isValid) return true
  return false
}

export const buildFormOperations = (modifiedFields: ModifiedFields) => {
  return Object.keys(modifiedFields).map((key) => ({
    path: key,
    value: modifiedFields[key],
    op: 'replace' as const,
  }))
}

export const hasFormChanges = (isDirty: boolean, modifiedFields: ModifiedFields): boolean => {
  return isDirty || Object.keys(modifiedFields).length > 0
}

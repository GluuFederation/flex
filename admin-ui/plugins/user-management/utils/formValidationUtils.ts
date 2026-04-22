import type { ModifiedFields, FormFieldValue } from '../types'

export const isEmptyValue = (value: FormFieldValue): boolean => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
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

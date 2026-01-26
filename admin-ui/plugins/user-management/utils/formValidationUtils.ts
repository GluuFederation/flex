import { ModifiedFields } from '../types/ComponentTypes'

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

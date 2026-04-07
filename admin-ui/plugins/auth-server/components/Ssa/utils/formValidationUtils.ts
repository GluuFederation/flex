import type { SsaFormValues, ExpirationDate } from '../types/SsaApiTypes'
import type { ModifiedFields } from '../types/SsaFormTypes'

export const getSsaInitialValues = (): SsaFormValues => ({
  software_id: '',
  one_time_use: true,
  org_id: '',
  description: '',
  software_roles: [],
  rotate_ssa: true,
  grant_types: [],
  is_expirable: false,
  expirationDate: null as ExpirationDate,
})

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

export const hasFormChanges = (
  isDirty: boolean,
  selectedAttributes: string[],
  modifiedFields: ModifiedFields,
): boolean => {
  return isDirty || selectedAttributes.length > 0 || Object.keys(modifiedFields).length > 0
}

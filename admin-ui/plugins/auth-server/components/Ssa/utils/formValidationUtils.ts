import type { SsaFormValues, ExpirationDate, ModifiedFields } from '../types'

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

export const hasFormChanges = (
  isDirty: boolean,
  selectedAttributes: string[],
  modifiedFields: ModifiedFields,
): boolean => {
  return isDirty || selectedAttributes.length > 0 || Object.keys(modifiedFields).length > 0
}

export const shouldDisableApplyButton = (
  isSubmitting: boolean,
  isDirty: boolean,
  isValid: boolean,
  modifiedFields: ModifiedFields,
  selectedAttributes: string[],
): boolean => {
  return isSubmitting || !hasFormChanges(isDirty, selectedAttributes, modifiedFields) || !isValid
}

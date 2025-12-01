import { JansAttribute } from 'JansConfigApi'

// Shared constant for default attributeValidation structure
export const DEFAULT_ATTRIBUTE_VALIDATION = {
  maxLength: undefined,
  regexp: undefined,
  minLength: undefined,
} as const

export const transformToFormValues = (attribute: JansAttribute | null): Partial<JansAttribute> => {
  if (!attribute) {
    return {
      jansHideOnDiscovery: false,
      scimCustomAttr: false,
      oxMultiValuedAttribute: false,
      custom: false,
      required: false,
      attributeValidation: { ...DEFAULT_ATTRIBUTE_VALIDATION },
    }
  }

  return {
    ...attribute,
    attributeValidation: attribute.attributeValidation
      ? { ...attribute.attributeValidation }
      : { ...DEFAULT_ATTRIBUTE_VALIDATION },
  }
}

export const toJansAttribute = (values: JansAttribute, validation: boolean): JansAttribute => {
  // Create a new object to avoid mutating the original
  const result: JansAttribute = {
    ...values,
  }

  if (!result.attributeValidation) {
    result.attributeValidation = { ...DEFAULT_ATTRIBUTE_VALIDATION }
  } else {
    result.attributeValidation = { ...result.attributeValidation }
  }

  if (!validation) {
    // When validation is disabled, set to undefined to indicate "no validation" to the backend
    result.attributeValidation = undefined
  }

  return result
}

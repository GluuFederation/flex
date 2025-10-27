import { JansAttribute } from 'JansConfigApi'

/**
 * Transforms JansAttribute from API to form values
 * Ensures all nested objects are properly initialized
 */
export const transformToFormValues = (
  attribute: JansAttribute | undefined,
): Partial<JansAttribute> => {
  if (!attribute) {
    return {
      jansHideOnDiscovery: false,
      scimCustomAttr: false,
      oxMultiValuedAttribute: false,
      custom: false,
      required: false,
      attributeValidation: {
        maxLength: undefined,
        regexp: undefined,
        minLength: undefined,
      },
    }
  }

  return {
    ...attribute,
    attributeValidation: attribute.attributeValidation || {
      maxLength: undefined,
      regexp: undefined,
      minLength: undefined,
    },
  }
}

/**
 * Transforms form values to JansAttribute for API submission
 * Cleans up validation fields if they're not being used
 */
export const toJansAttribute = (values: JansAttribute, validation: boolean): JansAttribute => {
  const result = { ...values }

  if (!validation) {
    // Remove validation fields if validation is disabled
    if (result.attributeValidation) {
      delete result.attributeValidation.regexp
      delete result.attributeValidation.maxLength
      delete result.attributeValidation.minLength
    }
  }

  return result
}

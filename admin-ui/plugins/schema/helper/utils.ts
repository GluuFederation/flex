import { JansAttribute } from 'JansConfigApi'

/**
 * Transforms JansAttribute from API to form values
 * Ensures all nested objects are properly initialized and deeply cloned
 * to avoid mutating cached query data
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
    // Deep clone attributeValidation to avoid mutating cached data
    attributeValidation: attribute.attributeValidation
      ? { ...attribute.attributeValidation }
      : {
          maxLength: undefined,
          regexp: undefined,
          minLength: undefined,
        },
  }
}

/**
 * Transforms form values to JansAttribute for API submission
 * Cleans up validation fields if they're not being used
 * Deep clones to avoid mutating source data (Formik state or cached query data)
 */
export const toJansAttribute = (values: JansAttribute, validation: boolean): JansAttribute => {
  const result = {
    ...values,
    // Deep clone attributeValidation to avoid mutating source data
    attributeValidation: values.attributeValidation ? { ...values.attributeValidation } : undefined,
  }

  if (!validation && result.attributeValidation) {
    // Remove validation fields if validation is disabled
    delete result.attributeValidation.regexp
    delete result.attributeValidation.maxLength
    delete result.attributeValidation.minLength
  }

  return result
}

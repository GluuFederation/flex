import { JansAttribute } from 'JansConfigApi'

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
    attributeValidation: attribute.attributeValidation
      ? { ...attribute.attributeValidation }
      : {
          maxLength: undefined,
          regexp: undefined,
          minLength: undefined,
        },
  }
}

export const toJansAttribute = (values: JansAttribute, validation: boolean): JansAttribute => {
  const result = {
    ...values,
    attributeValidation: values.attributeValidation ? { ...values.attributeValidation } : undefined,
  }

  if (!validation && result.attributeValidation) {
    delete result.attributeValidation.regexp
    delete result.attributeValidation.maxLength
    delete result.attributeValidation.minLength
  }

  return result
}

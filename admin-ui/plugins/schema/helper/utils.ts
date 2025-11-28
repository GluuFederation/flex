import { JansAttribute } from 'JansConfigApi'

export const transformToFormValues = (attribute: JansAttribute | null): Partial<JansAttribute> => {
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
  const result: JansAttribute = {
    ...values,
  }

  if (!result.attributeValidation) {
    result.attributeValidation = {
      maxLength: undefined,
      regexp: undefined,
      minLength: undefined,
    }
  } else {
    result.attributeValidation = { ...result.attributeValidation }
  }

  if (!validation) {
    // Normalize attributeValidation to consistent shape when validation is disabled
    result.attributeValidation = {
      maxLength: undefined,
      minLength: undefined,
      regexp: undefined,
    }
  }

  return result
}

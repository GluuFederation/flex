import { useMemo, useCallback } from 'react'
import type { FormikErrors } from 'formik'
import { REQUIRED_ATTRIBUTE_FIELDS } from '../constants'
import type {
  AttributeItem,
  AttributeFormValues,
  SubmitData,
  HandleAttributeSubmitParams,
  ModifiedFields,
  ModifiedFieldValue,
} from '../components/types/AttributeListPage.types'

export const useInitialAttributeValues = (item: AttributeItem): AttributeFormValues => {
  return useMemo(
    () => ({
      ...item,
      name: item.name || '',
      displayName: item.displayName || '',
      description: item.description || '',
      status: item.status || '',
      dataType: item.dataType || '',
      editType: item.editType || [],
      viewType: item.viewType || [],
      usageType: item.usageType || [],
      jansHideOnDiscovery: item.jansHideOnDiscovery ?? false,
      oxMultiValuedAttribute: item.oxMultiValuedAttribute ?? false,
      attributeValidation: item.attributeValidation || {
        maxLength: null,
        regexp: null,
        minLength: null,
      },
      scimCustomAttr: item.scimCustomAttr ?? false,
      claimName: item.claimName || '',
      saml1Uri: item.saml1Uri || '',
      saml2Uri: item.saml2Uri || '',
      maxLength: item.attributeValidation?.maxLength ?? null,
      minLength: item.attributeValidation?.minLength ?? null,
      regexp: item.attributeValidation?.regexp ?? null,
    }),
    [item],
  )
}

export const useComputeModifiedFields = (
  initialValues: AttributeFormValues,
  updatedValues: AttributeFormValues,
): ModifiedFields => {
  return useMemo(() => {
    const modifiedFields: ModifiedFields = {}

    // Compare each field
    Object.keys(updatedValues).forEach((key) => {
      const initialValue = initialValues[key as keyof AttributeFormValues]
      const updatedValue = updatedValues[key as keyof AttributeFormValues]

      // Handle arrays (editType, viewType, usageType)
      if (Array.isArray(initialValue) && Array.isArray(updatedValue)) {
        const arraysEqual =
          initialValue.length === updatedValue.length &&
          initialValue.every((val, index) => val === updatedValue[index])
        if (!arraysEqual) {
          modifiedFields[key] = updatedValue as ModifiedFieldValue
        }
      }
      // Handle objects (attributeValidation)
      else if (
        typeof initialValue === 'object' &&
        initialValue !== null &&
        typeof updatedValue === 'object' &&
        updatedValue !== null
      ) {
        if (JSON.stringify(initialValue) !== JSON.stringify(updatedValue)) {
          modifiedFields[key] = updatedValue as ModifiedFieldValue
        }
      }
      // Handle primitive values
      else if (initialValue !== updatedValue) {
        const fieldValue: ModifiedFieldValue = updatedValue ?? null
        modifiedFields[key] = fieldValue
      }
    })

    return modifiedFields
  }, [initialValues, updatedValues])
}

export const transformFormValuesToAttribute = (
  item: AttributeItem,
  values: AttributeFormValues,
  validationEnabled: boolean,
): AttributeItem => {
  const result: AttributeItem = {
    ...item,
    ...values,
  }

  // Handle attributeValidation object
  if (!result.attributeValidation) {
    result.attributeValidation = {
      maxLength: null,
      regexp: null,
      minLength: null,
    }
  } else {
    result.attributeValidation = { ...result.attributeValidation }
  }

  // Map validation fields if validation is enabled
  if (validationEnabled) {
    if (values.maxLength !== null) {
      result.attributeValidation.maxLength = values.maxLength
    }
    if (values.minLength !== null) {
      result.attributeValidation.minLength = values.minLength
    }
    if (values.regexp !== null) {
      result.attributeValidation.regexp = values.regexp
    }
  } else {
    // Remove validation fields if validation is disabled
    delete result.attributeValidation.regexp
    delete result.attributeValidation.maxLength
    delete result.attributeValidation.minLength
    // Remove top-level validation fields if they exist
    const resultWithValidation = result as AttributeItem & {
      regexp?: string | null
      maxLength?: number | null
      minLength?: number | null
    }
    delete resultWithValidation.regexp
    delete resultWithValidation.maxLength
    delete resultWithValidation.minLength
  }

  return result
}

export const computeModifiedFields = (
  initialValues: AttributeFormValues,
  updatedValues: AttributeFormValues,
): ModifiedFields => {
  const modifiedFields: ModifiedFields = {}

  // Compare each field
  Object.keys(updatedValues).forEach((key) => {
    const initialValue = initialValues[key as keyof AttributeFormValues]
    const updatedValue = updatedValues[key as keyof AttributeFormValues]

    // Handle arrays (editType, viewType, usageType)
    if (Array.isArray(initialValue) && Array.isArray(updatedValue)) {
      const arraysEqual =
        initialValue.length === updatedValue.length &&
        initialValue.every((val, index) => val === updatedValue[index])
      if (!arraysEqual) {
        modifiedFields[key] = updatedValue
      }
    }
    // Handle objects (attributeValidation)
    else if (
      typeof initialValue === 'object' &&
      initialValue !== null &&
      typeof updatedValue === 'object' &&
      updatedValue !== null
    ) {
      if (JSON.stringify(initialValue) !== JSON.stringify(updatedValue)) {
        modifiedFields[key] = updatedValue
      }
    }
    // Handle primitive values
    else if (initialValue !== updatedValue) {
      modifiedFields[key] = updatedValue
    }
  })

  return modifiedFields
}

export const getInitialAttributeValues = (item: AttributeItem): AttributeFormValues => {
  return {
    ...item,
    name: item.name || '',
    displayName: item.displayName || '',
    description: item.description || '',
    status: item.status || '',
    dataType: item.dataType || '',
    editType: item.editType || [],
    viewType: item.viewType || [],
    usageType: item.usageType || [],
    jansHideOnDiscovery: item.jansHideOnDiscovery ?? false,
    oxMultiValuedAttribute: item.oxMultiValuedAttribute ?? false,
    attributeValidation: item.attributeValidation || {
      maxLength: null,
      regexp: null,
      minLength: null,
    },
    scimCustomAttr: item.scimCustomAttr ?? false,
    claimName: item.claimName || '',
    saml1Uri: item.saml1Uri || '',
    saml2Uri: item.saml2Uri || '',
    maxLength: item.attributeValidation?.maxLength ?? null,
    minLength: item.attributeValidation?.minLength ?? null,
    regexp: item.attributeValidation?.regexp ?? null,
  }
}

export const handleAttributeSubmit = ({
  item,
  values,
  customOnSubmit,
  userMessage,
  validationEnabled,
}: HandleAttributeSubmitParams & { validationEnabled: boolean }): void => {
  const result = transformFormValuesToAttribute(item, values, validationEnabled)

  // Compute modified fields
  const initialValues = getInitialAttributeValues(item)
  const modifiedFields = computeModifiedFields(initialValues, values)

  customOnSubmit({
    data: result,
    userMessage,
    modifiedFields,
  })
}

export const useHandleAttributeSubmit = (
  item: AttributeItem,
  customOnSubmit: (data: SubmitData) => void,
  validationEnabled: boolean,
) => {
  const initialValues = useInitialAttributeValues(item)

  return useCallback(
    (values: AttributeFormValues, userMessage?: string) => {
      const result = transformFormValuesToAttribute(item, values, validationEnabled)
      const modifiedFields = computeModifiedFields(initialValues, values)

      customOnSubmit({
        data: result,
        userMessage,
        modifiedFields,
      })
    },
    [item, customOnSubmit, validationEnabled, initialValues],
  )
}

export const getInitialValidationState = (item: AttributeItem): boolean => {
  return (
    item.attributeValidation?.regexp != null ||
    item.attributeValidation?.minLength != null ||
    item.attributeValidation?.maxLength != null
  )
}

export const hasFormChanged = (
  initialValues: AttributeFormValues,
  currentValues: AttributeFormValues,
): boolean => {
  const modifiedFields = computeModifiedFields(initialValues, currentValues)
  return Object.keys(modifiedFields).length > 0
}

export const isFormValid = (
  values: AttributeFormValues,
  errors: FormikErrors<AttributeFormValues>,
  isValid: boolean,
): boolean => {
  if (Object.keys(errors).length > 0 || !isValid) {
    return false
  }
  for (const field of REQUIRED_ATTRIBUTE_FIELDS) {
    const value = values[field as keyof AttributeFormValues]
    if (value === null) {
      return false
    }
    if (typeof value === 'string' && value.trim().length === 0) {
      return false
    }
    if (Array.isArray(value) && value.length === 0) {
      return false
    }
  }
  return true
}

export const getDefaultFormValues = (): AttributeFormValues => {
  return {
    name: '',
    displayName: '',
    description: '',
    status: '',
    dataType: '',
    editType: [],
    viewType: [],
    usageType: [],
    jansHideOnDiscovery: false,
    oxMultiValuedAttribute: false,
    attributeValidation: {
      maxLength: null,
      regexp: null,
      minLength: null,
    },
    scimCustomAttr: false,
    claimName: '',
    saml1Uri: '',
    saml2Uri: '',
    maxLength: null,
    minLength: null,
    regexp: null,
  }
}

export const getDefaultAttributeItem = (): AttributeItem => {
  return {
    name: '',
    displayName: '',
    description: '',
    status: '',
    dataType: '',
    editType: [],
    viewType: [],
    usageType: [],
    jansHideOnDiscovery: false,
    scimCustomAttr: false,
    oxMultiValuedAttribute: false,
    custom: false,
    required: false,
    attributeValidation: {
      maxLength: null,
      regexp: null,
      minLength: null,
    },
    claimName: '',
    saml1Uri: '',
    saml2Uri: '',
  }
}

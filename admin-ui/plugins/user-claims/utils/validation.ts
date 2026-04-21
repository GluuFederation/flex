import * as Yup from 'yup'
import { REGEX_NO_WHITESPACE_STRICT } from '@/utils/regex'
import { useMemo } from 'react'
import type { AttributeFormValues } from '../components/types'

const buildAttributeSchemaParts = (validationEnabled = true) => {
  return {
    name: Yup.string()
      .trim()
      .matches(REGEX_NO_WHITESPACE_STRICT, 'errors.name_no_spaces')
      .required('errors.name_required')
      .min(1, 'errors.name_required'),
    displayName: Yup.string()
      .trim()
      .required('errors.display_name_required')
      .min(1, 'errors.display_name_required'),
    description: Yup.string()
      .trim()
      .required('errors.description_required')
      .min(1, 'errors.description_required'),
    status: Yup.string().required('errors.status_required').min(1, 'errors.status_required'),
    dataType: Yup.string()
      .required('errors.data_type_required')
      .min(1, 'errors.data_type_required'),
    editType: Yup.array()
      .of(Yup.string())
      .min(1, 'errors.edit_type_required')
      .required('errors.edit_type_required'),
    usageType: Yup.array().of(Yup.string()).nullable(),
    viewType: Yup.array()
      .of(Yup.string())
      .min(1, 'errors.view_type_required')
      .required('errors.view_type_required'),
    maxLength: validationEnabled
      ? Yup.number()
          .nullable()
          .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null) {
              return null
            }
            return value
          })
          .positive('errors.positive_number')
      : Yup.number()
          .nullable()
          .transform((value, originalValue) => (originalValue === '' ? null : value)),
    minLength: validationEnabled
      ? Yup.number()
          .nullable()
          .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null) {
              return null
            }
            return value
          })
          .positive('errors.positive_number')
          .when(
            'maxLength',
            (maxLengthValue: number | null | undefined | (number | null | undefined)[], schema) => {
              // Handle both direct value and array-wrapped value per Yup types
              const maxLength = Array.isArray(maxLengthValue) ? maxLengthValue[0] : maxLengthValue
              if (maxLength !== null && maxLength !== undefined) {
                return schema.test(
                  'min-max',
                  'errors.min_greater_than_max',
                  function (value: number | null | undefined) {
                    const maxLengthFromParent = this.parent.maxLength as number | null | undefined
                    if (
                      value === null ||
                      value === undefined ||
                      maxLengthFromParent === null ||
                      maxLengthFromParent === undefined
                    ) {
                      return true
                    }
                    return value < maxLengthFromParent
                  },
                )
              }
              return schema
            },
          )
      : Yup.number()
          .nullable()
          .transform((value, originalValue) => (originalValue === '' ? null : value)),
    regexp: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    claimName: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    saml1Uri: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    saml2Uri: Yup.string()
      .nullable()
      .transform((value) => (value === '' ? null : value)),
    jansHideOnDiscovery: Yup.boolean(),
    oxMultiValuedAttribute: Yup.boolean(),
    scimCustomAttr: Yup.boolean(),
    attributeValidation: Yup.object().nullable(),
  }
}

export const useAttributeValidationSchema = (validationEnabled = true) => {
  return useMemo(
    () => Yup.object<AttributeFormValues>(buildAttributeSchemaParts(validationEnabled)),
    [validationEnabled],
  )
}

export const getAttributeValidationSchema = (validationEnabled = true) => {
  return Yup.object<AttributeFormValues>(buildAttributeSchemaParts(validationEnabled))
}

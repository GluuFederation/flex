import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import type { AttributeFormValues } from '../components/types/AttributeListPage.types'

export const useAttributeValidationSchema = () => {
  const { t } = useTranslation()

  return useMemo(
    () =>
      Yup.object<AttributeFormValues>({
        name: Yup.string()
          .trim()
          .matches(/^[^\s]+$/, t('errors.name_no_spaces') || 'Name must not contain spaces')
          .required(t('errors.required') || 'Required!')
          .min(1, t('errors.required') || 'Required!'),
        displayName: Yup.string()
          .trim()
          .required(t('errors.required') || 'Required!')
          .min(1, t('errors.required') || 'Required!'),
        description: Yup.string()
          .trim()
          .required(t('errors.required') || 'Required!')
          .min(1, t('errors.required') || 'Required!'),
        status: Yup.string()
          .required(t('errors.required') || 'Required!')
          .min(1, t('errors.required') || 'Required!'),
        dataType: Yup.string()
          .required(t('errors.required') || 'Required!')
          .min(1, t('errors.required') || 'Required!'),
        editType: Yup.array()
          .of(Yup.string())
          .min(1, t('errors.required') || 'Required!')
          .required(t('errors.required') || 'Required!'),
        usageType: Yup.array()
          .of(Yup.string())
          .min(1, t('errors.required') || 'Required!')
          .required(t('errors.required') || 'Required!'),
        viewType: Yup.array()
          .of(Yup.string())
          .min(1, t('errors.required') || 'Required!')
          .required(t('errors.required') || 'Required!'),
        maxLength: Yup.number()
          .nullable()
          .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null) {
              return null
            }
            return value
          })
          .positive(t('errors.positive_number') || 'Must be a positive number'),
        minLength: Yup.number()
          .nullable()
          .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === null) {
              return null
            }
            return value
          })
          .positive(t('errors.positive_number') || 'Must be a positive number')
          .when('maxLength', {
            is: (maxLength: number | null | undefined) =>
              maxLength !== null && maxLength !== undefined,
            then: (schema) =>
              schema.test(
                'min-max',
                t('errors.min_greater_than_max') || 'Min length must be less than max length',
                function (value: number | null | undefined) {
                  const maxLength = this.parent.maxLength as number | null | undefined
                  if (
                    value === null ||
                    value === undefined ||
                    maxLength === null ||
                    maxLength === undefined
                  ) {
                    return true
                  }
                  return value < maxLength
                },
              ),
            otherwise: (schema) => schema,
          }),
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
      }),
    [t],
  )
}

export const getAttributeValidationSchema = (t: (key: string) => string) => {
  return Yup.object<AttributeFormValues>({
    name: Yup.string()
      .trim()
      .matches(/^[^\s]+$/, t('errors.name_no_spaces') || 'Name must not contain spaces')
      .required(t('errors.required') || 'Required!')
      .min(1, t('errors.required') || 'Required!'),
    displayName: Yup.string()
      .trim()
      .required(t('errors.required') || 'Required!')
      .min(1, t('errors.required') || 'Required!'),
    description: Yup.string()
      .trim()
      .required(t('errors.required') || 'Required!')
      .min(1, t('errors.required') || 'Required!'),
    status: Yup.string()
      .required(t('errors.required') || 'Required!')
      .min(1, t('errors.required') || 'Required!'),
    dataType: Yup.string()
      .required(t('errors.required') || 'Required!')
      .min(1, t('errors.required') || 'Required!'),
    editType: Yup.array()
      .of(Yup.string())
      .min(1, t('errors.required') || 'Required!')
      .required(t('errors.required') || 'Required!'),
    usageType: Yup.array()
      .of(Yup.string())
      .min(1, t('errors.required') || 'Required!')
      .required(t('errors.required') || 'Required!'),
    viewType: Yup.array()
      .of(Yup.string())
      .min(1, t('errors.required') || 'Required!')
      .required(t('errors.required') || 'Required!'),
    maxLength: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        if (originalValue === '' || originalValue === null) {
          return null
        }
        return value
      })
      .positive(t('errors.positive_number') || 'Must be a positive number'),
    minLength: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        if (originalValue === '' || originalValue === null) {
          return null
        }
        return value
      })
      .positive(t('errors.positive_number') || 'Must be a positive number')
      .when('maxLength', {
        is: (maxLength: number | null) => maxLength !== null,
        then: (schema) =>
          schema.test(
            'min-max',
            t('errors.min_greater_than_max') || 'Min length must be less than max length',
            function (value: number | null | undefined) {
              const maxLength = this.parent.maxLength as number | null | undefined
              if (
                value === null ||
                value === undefined ||
                maxLength === null ||
                maxLength === undefined
              ) {
                return true
              }
              return value < maxLength
            },
          ),
        otherwise: (schema) => schema,
      }),
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
  })
}

import { useMemo } from 'react'
import type { FormikProps } from 'formik'
import type { SsaFormValues } from '../types'

type SsaValidationState = {
  softwareIdError: boolean
  softwareIdErrorMessage: string
  organizationError: boolean
  organizationErrorMessage: string
  softwareRolesError: boolean
  softwareRolesErrorMessage: string
  grantTypesError: boolean
  grantTypesErrorMessage: string
  descriptionError: boolean
  descriptionErrorMessage: string
}

export const useSsaValidationState = (formik: FormikProps<SsaFormValues>): SsaValidationState => {
  return useMemo(
    () => ({
      softwareIdError: Boolean(formik.touched.software_id && formik.errors.software_id),
      softwareIdErrorMessage:
        typeof formik.errors.software_id === 'string' ? formik.errors.software_id : '',
      organizationError: Boolean(formik.touched.org_id && formik.errors.org_id),
      organizationErrorMessage:
        typeof formik.errors.org_id === 'string' ? formik.errors.org_id : '',
      softwareRolesError: Boolean(formik.touched.software_roles && formik.errors.software_roles),
      softwareRolesErrorMessage:
        typeof formik.errors.software_roles === 'string' ? formik.errors.software_roles : '',
      grantTypesError: Boolean(formik.touched.grant_types && formik.errors.grant_types),
      grantTypesErrorMessage:
        typeof formik.errors.grant_types === 'string' ? formik.errors.grant_types : '',
      descriptionError: Boolean(formik.touched.description && formik.errors.description),
      descriptionErrorMessage:
        typeof formik.errors.description === 'string' ? formik.errors.description : '',
    }),
    [
      formik.touched.software_id,
      formik.errors.software_id,
      formik.touched.org_id,
      formik.errors.org_id,
      formik.touched.software_roles,
      formik.errors.software_roles,
      formik.touched.grant_types,
      formik.errors.grant_types,
      formik.touched.description,
      formik.errors.description,
    ],
  )
}

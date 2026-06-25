import { renderHook } from '@testing-library/react'
import type { FormikProps, FormikTouched } from 'formik'
import { useSsaValidationState } from '../useSsaValidationState'
import type { SsaFormValues } from '../../types'

type TouchedInput = FormikTouched<SsaFormValues>
type ErrorsInput = Partial<Record<keyof SsaFormValues, string | string[]>>

const makeFormik = (touched: TouchedInput, errors: ErrorsInput): FormikProps<SsaFormValues> => {
  const partial: Pick<FormikProps<SsaFormValues>, 'touched'> & {
    errors: ErrorsInput
  } = { touched, errors }
  return partial as Pick<FormikProps<SsaFormValues>, 'touched' | 'errors'> as FormikProps<SsaFormValues>
}

describe('useSsaValidationState', () => {
  it('returns no errors when nothing is touched', () => {
    const { result } = renderHook(() => useSsaValidationState(makeFormik({}, {})))
    expect(result.current.softwareIdError).toBe(false)
    expect(result.current.softwareIdErrorMessage).toBe('')
    expect(result.current.organizationError).toBe(false)
    expect(result.current.softwareRolesError).toBe(false)
    expect(result.current.grantTypesError).toBe(false)
    expect(result.current.descriptionError).toBe(false)
  })

  it('flags an error only when a field is both touched and has an error', () => {
    const { result } = renderHook(() =>
      useSsaValidationState(
        makeFormik({ software_id: true }, { software_id: 'required' }),
      ),
    )
    expect(result.current.softwareIdError).toBe(true)
    expect(result.current.softwareIdErrorMessage).toBe('required')
  })

  it('does not flag an error when there is an error but the field is untouched', () => {
    const { result } = renderHook(() =>
      useSsaValidationState(makeFormik({}, { software_id: 'required' })),
    )
    expect(result.current.softwareIdError).toBe(false)
  })

  it('maps each form field to its corresponding error state', () => {
    const { result } = renderHook(() =>
      useSsaValidationState(
        makeFormik(
          {
            org_id: true,
            software_roles: true,
            grant_types: true,
            description: true,
          },
          {
            org_id: 'org required',
            software_roles: 'roles required',
            grant_types: 'grants required',
            description: 'desc required',
          },
        ),
      ),
    )
    expect(result.current.organizationError).toBe(true)
    expect(result.current.organizationErrorMessage).toBe('org required')
    expect(result.current.softwareRolesError).toBe(true)
    expect(result.current.softwareRolesErrorMessage).toBe('roles required')
    expect(result.current.grantTypesError).toBe(true)
    expect(result.current.grantTypesErrorMessage).toBe('grants required')
    expect(result.current.descriptionError).toBe(true)
    expect(result.current.descriptionErrorMessage).toBe('desc required')
  })

  it('returns an empty message when the error is not a string', () => {
    const { result } = renderHook(() =>
      useSsaValidationState(
        makeFormik({ software_roles: true }, { software_roles: ['array error'] }),
      ),
    )
    expect(result.current.softwareRolesError).toBe(true)
    expect(result.current.softwareRolesErrorMessage).toBe('')
  })
})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import type { FormikProps } from 'formik'
import { PersonAuthenticationFields } from 'Plugins/scripts/components/PersonAuthenticationFields'
import { SAML_ACRS_OPTIONS, INTERACTIVE_OPTIONS } from 'Plugins/scripts/components/constants'
import type { FormValues } from 'Plugins/scripts/components/types/forms'

// The Gluu form rows are exercised by their own suites; here we stub them down to
// the props this component drives so the assertions target the alias-toggle and
// usage_type wiring rather than the rendering of the shared rows.
jest.mock('Routes/Apps/Gluu/GluuLabel', () => ({
  __esModule: true,
  default: ({ label }: { label: string }) => <span data-testid="gluu-label">{label}</span>,
}))

type SelectRowProps = {
  value: string
  values: Array<{ value: string; label: string }>
  formik: { handleChange: (e: { target: { value: string } }) => void }
  showError?: boolean
  errorMessage?: string
}

jest.mock('Routes/Apps/Gluu/GluuSelectRow', () => ({
  __esModule: true,
  default: ({ value, values, formik, showError, errorMessage }: SelectRowProps) => (
    <div>
      <select
        data-testid="usage-type-select"
        value={value}
        onChange={(e) => formik.handleChange({ target: { value: e.target.value } })}
      >
        {values.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {showError ? <span data-testid="usage-type-error">{errorMessage}</span> : null}
    </div>
  ),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const baseFormik = (overrides: Partial<FormikProps<FormValues>> = {}): FormikProps<FormValues> =>
  ({
    values: { aliases: [], moduleProperties: [] } as Partial<FormValues> as FormValues,
    errors: {},
    touched: {},
    handleBlur: jest.fn(),
    setFieldValue: jest.fn(),
    ...overrides,
  }) as Partial<FormikProps<FormValues>> as FormikProps<FormValues>

const setup = (props: Partial<React.ComponentProps<typeof PersonAuthenticationFields>> = {}) => {
  const usageTypeChange = jest.fn()
  const getModuleProperty = jest.fn(() => 'interactive')
  const formik = (props.formik as FormikProps<FormValues>) ?? baseFormik()
  const utils = render(
    <PersonAuthenticationFields
      formik={formik}
      usageTypeChange={usageTypeChange}
      getModuleProperty={getModuleProperty}
      {...props}
    />,
  )
  return { usageTypeChange, getModuleProperty, formik, ...utils }
}

describe('PersonAuthenticationFields', () => {
  it('renders one option per SAML ACR', () => {
    setup()
    SAML_ACRS_OPTIONS.forEach((acr) => {
      expect(screen.getByText(acr)).toBeInTheDocument()
    })
  })

  it('adds an ACR to aliases on mousedown when it is not already selected', () => {
    const setFieldValue = jest.fn()
    const formik = baseFormik({
      values: { aliases: [], moduleProperties: [] } as Partial<FormValues> as FormValues,
      setFieldValue,
    })
    setup({ formik })
    fireEvent.mouseDown(screen.getByText(SAML_ACRS_OPTIONS[0]))
    expect(setFieldValue).toHaveBeenCalledWith('aliases', [SAML_ACRS_OPTIONS[0]])
  })

  it('removes an ACR from aliases on mousedown when it is already selected', () => {
    const setFieldValue = jest.fn()
    const formik = baseFormik({
      values: {
        aliases: [SAML_ACRS_OPTIONS[0]],
        moduleProperties: [],
      } as Partial<FormValues> as FormValues,
      setFieldValue,
    })
    setup({ formik })
    fireEvent.mouseDown(screen.getByText(SAML_ACRS_OPTIONS[0]))
    expect(setFieldValue).toHaveBeenCalledWith('aliases', [])
  })

  it('does not toggle aliases when viewOnly is set', () => {
    const setFieldValue = jest.fn()
    const formik = baseFormik({ setFieldValue })
    setup({ formik, viewOnly: true })
    fireEvent.mouseDown(screen.getByText(SAML_ACRS_OPTIONS[0]))
    expect(setFieldValue).not.toHaveBeenCalled()
  })

  it('forwards the selected usage type to usageTypeChange', () => {
    const { usageTypeChange } = setup()
    fireEvent.change(screen.getByTestId('usage-type-select'), {
      target: { value: INTERACTIVE_OPTIONS[1].value },
    })
    expect(usageTypeChange).toHaveBeenCalledWith(INTERACTIVE_OPTIONS[1].value)
  })

  it('reads the current usage type from module properties', () => {
    const { getModuleProperty, formik } = setup()
    expect(getModuleProperty).toHaveBeenCalledWith('usage_type', formik.values.moduleProperties)
  })

  it('surfaces the module property error only when the field is touched', () => {
    const formik = baseFormik({
      errors: { moduleProperties: 'required' } as FormikProps<FormValues>['errors'],
      // moduleProperties is an array field in FormikTouched, so a boolean flag
      // requires a double assertion; the component only reads its truthiness.
      touched: { moduleProperties: true } as object as FormikProps<FormValues>['touched'],
    })
    setup({ formik })
    expect(screen.getByTestId('usage-type-error')).toHaveTextContent('required')
  })

  it('hides the error when the field is untouched', () => {
    const formik = baseFormik({
      errors: { moduleProperties: 'required' } as FormikProps<FormValues>['errors'],
      touched: {},
    })
    setup({ formik })
    expect(screen.queryByTestId('usage-type-error')).not.toBeInTheDocument()
  })
})

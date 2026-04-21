import type { FormikProps } from 'formik'
import GluuTypeAheadWithAdd from '../GluuTypeAheadWithAdd'
import { render, screen } from '@testing-library/react'
import AppTestWrapper from './Components/AppTestWrapper'
import type { JsonObject } from '../types/common'

const mockFormik: Partial<FormikProps<JsonObject>> = {
  setFieldValue: jest.fn(),
  values: {},
  errors: {},
  touched: {},
  isSubmitting: false,
  submitCount: 0,
  setFieldTouched: jest.fn(),
  setFieldError: jest.fn(),
  setErrors: jest.fn(),
  setTouched: jest.fn(),
  setValues: jest.fn(),
  setSubmitting: jest.fn(),
  setFormikState: jest.fn(),
  resetForm: jest.fn(),
  validateForm: jest.fn(),
  validateField: jest.fn(),
  handleSubmit: jest.fn(),
  handleReset: jest.fn(),
  getFieldProps: jest.fn(),
  getFieldMeta: jest.fn(),
  getFieldHelpers: jest.fn(),
  setStatus: jest.fn(),
}

it('Test GluuTypeAheadWithAdd component', () => {
  const LABEL = 'fields.application_type'
  const NAME = 'applicationType'
  const VALUE = ['Monday']
  const OPTIONS = ['Monday', 'Tuesday']
  const INPUT_ID = 'test-typeahead-input'
  render(
    <AppTestWrapper>
      <GluuTypeAheadWithAdd
        doc_category="openid_client"
        name={NAME}
        value={VALUE}
        label={LABEL}
        options={OPTIONS}
        formik={mockFormik as FormikProps<JsonObject>}
        validator={(v: string) => Boolean(v?.trim())}
        inputId={INPUT_ID}
      />
    </AppTestWrapper>,
  )
  expect(screen.getByText(/Application Type/i)).toBeInTheDocument()
  expect(screen.getByText('Add')).toBeInTheDocument()
  expect(screen.getByText(VALUE[0])).toBeInTheDocument()
})

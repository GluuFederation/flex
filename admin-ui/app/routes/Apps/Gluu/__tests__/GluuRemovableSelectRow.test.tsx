import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuRemovableSelectRow from 'Routes/Apps/Gluu/GluuRemovableSelectRow'
import type { GluuRemovableSelectRowProps } from 'Routes/Apps/Gluu/types'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { FormikProps } from 'formik'

type SelectFormValues = Record<string, JsonValue>

const createMockFormik = (
  values: SelectFormValues = {},
  overrides: Partial<FormikProps<SelectFormValues>> = {},
): FormikProps<SelectFormValues> => ({
  values,
  initialValues: values,
  initialErrors: {},
  initialTouched: {},
  initialStatus: undefined,
  errors: {},
  touched: {},
  isSubmitting: false,
  isValidating: false,
  submitCount: 0,
  dirty: false,
  isValid: true,
  status: undefined,
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  handleSubmit: jest.fn(),
  handleReset: jest.fn(),
  setFieldValue: jest.fn(),
  setFieldTouched: jest.fn(),
  setFieldError: jest.fn(),
  setValues: jest.fn(),
  setErrors: jest.fn(),
  setTouched: jest.fn(),
  setStatus: jest.fn(),
  setSubmitting: jest.fn(),
  setFormikState: jest.fn(),
  validateField: jest.fn(),
  validateForm: jest.fn().mockResolvedValue({}),
  resetForm: jest.fn(),
  submitForm: jest.fn().mockResolvedValue(undefined),
  getFieldProps: jest
    .fn()
    .mockReturnValue({ value: '', onChange: jest.fn(), onBlur: jest.fn(), name: '' }),
  getFieldMeta: jest.fn().mockReturnValue({
    value: '',
    touched: false,
    error: undefined,
    initialValue: '',
    initialTouched: false,
    initialError: undefined,
  }),
  getFieldHelpers: jest
    .fn()
    .mockReturnValue({ setValue: jest.fn(), setTouched: jest.fn(), setError: jest.fn() }),
  registerField: jest.fn(),
  unregisterField: jest.fn(),
  ...overrides,
})

const countryOptions = [
  { cca2: 'US', name: 'United States' },
  { cca2: 'CA', name: 'Canada' },
]

const baseProps = (
  overrides: Partial<GluuRemovableSelectRowProps> = {},
): GluuRemovableSelectRowProps => ({
  label: 'Country',
  name: 'country',
  formik: createMockFormik({ country: 'US' }),
  values: countryOptions,
  handler: jest.fn(),
  ...overrides,
})

const renderRow = (props: GluuRemovableSelectRowProps) =>
  render(
    <AppTestWrapper>
      <GluuRemovableSelectRow {...props} />
    </AppTestWrapper>,
  )

describe('GluuRemovableSelectRow', () => {
  it('renders a select with data-testid={name}, a default choose option and one option per value', () => {
    renderRow(baseProps())
    const select = screen.getByTestId('country') as HTMLSelectElement
    expect(select.tagName).toBe('SELECT')
    // default "choose" option + 2 country options
    expect(select.querySelectorAll('option')).toHaveLength(3)
    expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument()
  })

  it('reflects the value from formik.values[name]', () => {
    renderRow(baseProps({ formik: createMockFormik({ country: 'CA' }) }))
    const select = screen.getByTestId('country') as HTMLSelectElement
    expect(select.value).toBe('CA')
  })

  it('renders the remove button and calls handler when clicked', () => {
    const handler = jest.fn()
    renderRow(baseProps({ handler }))
    const removeButton = screen.getByRole('button', { name: /remove/i })
    expect(removeButton).toBeInTheDocument()
    fireEvent.click(removeButton)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('hides the remove button when hideRemoveButton is true', () => {
    renderRow(baseProps({ hideRemoveButton: true }))
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
  })

  it('calls formik.handleChange when the select changes', () => {
    const formik = createMockFormik({ country: 'US' })
    const setModifiedFields = jest.fn()
    renderRow(baseProps({ formik, setModifiedFields }))
    const select = screen.getByTestId('country')
    fireEvent.change(select, { target: { value: 'CA' } })
    expect(formik.handleChange).toHaveBeenCalledTimes(1)
    expect(setModifiedFields).toHaveBeenCalledTimes(1)
  })
})

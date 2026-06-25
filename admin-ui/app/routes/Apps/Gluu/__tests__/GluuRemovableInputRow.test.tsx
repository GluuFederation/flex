import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuRemovableInputRow from 'Routes/Apps/Gluu/GluuRemovableInputRow'
import type { GluuRemovableInputRowProps } from 'Routes/Apps/Gluu/types'
import type { FormikProps, FormikValues } from 'formik'

const createMockFormik = (
  values: FormikValues = {},
  overrides: Partial<FormikProps<FormikValues>> = {},
): FormikProps<FormikValues> => ({
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

const baseProps = (
  overrides: Partial<GluuRemovableInputRowProps> = {},
): GluuRemovableInputRowProps => ({
  label: 'My Label',
  name: 'myField',
  formik: createMockFormik({ myField: 'hello' }),
  handler: jest.fn(),
  ...overrides,
})

const renderRow = (props: GluuRemovableInputRowProps) =>
  render(
    <AppTestWrapper>
      <GluuRemovableInputRow {...props} />
    </AppTestWrapper>,
  )

describe('GluuRemovableInputRow', () => {
  it('renders an input with data-testid={name} populated from formik values', () => {
    renderRow(baseProps())
    const input = screen.getByTestId('myField') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('hello')
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

  it('renders a toggle (checkbox) instead of a text input when isBoolean is true', () => {
    const { container } = renderRow(
      baseProps({ isBoolean: true, formik: createMockFormik({ myField: true }) }),
    )
    const checkbox = container.querySelector('input#myField') as HTMLInputElement | null
    expect(checkbox).toBeInTheDocument()
    expect(checkbox?.type).toBe('checkbox')
  })

  it('calls formik.handleChange and setModifiedFields when typing in the input', () => {
    const formik = createMockFormik({ myField: '' })
    const setModifiedFields = jest.fn()
    renderRow(baseProps({ formik, setModifiedFields }))
    const input = screen.getByTestId('myField')
    fireEvent.change(input, { target: { value: 'updated' } })
    expect(formik.handleChange).toHaveBeenCalledTimes(1)
    expect(setModifiedFields).toHaveBeenCalledTimes(1)
  })
})

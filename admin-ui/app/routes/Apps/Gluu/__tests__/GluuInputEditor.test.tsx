import { render, screen, fireEvent } from '@testing-library/react'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuInputEditor from 'Routes/Apps/Gluu/GluuInputEditor'
import type { GluuInputEditorProps } from 'Routes/Apps/Gluu/types/GluuInputEditor.types'
import type { FormikProps, FormikValues } from 'formik'

type AceMockProps = {
  value?: string
  readOnly?: boolean
  placeholder?: string
  onChange?: (value: string) => void
}

jest.mock('react-ace', () => ({
  __esModule: true,
  default: ({ value, readOnly, placeholder, onChange }: AceMockProps) => (
    <textarea
      data-testid="ace"
      readOnly={readOnly}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  ),
}))

// Ace language/theme side-effect imports are not needed under the mock.
jest.mock('ace-builds/src-noconflict/mode-java', () => ({}), { virtual: true })
jest.mock('ace-builds/src-noconflict/mode-python', () => ({}), { virtual: true })
jest.mock('ace-builds/src-noconflict/mode-json', () => ({}), { virtual: true })
jest.mock('ace-builds/src-noconflict/theme-xcode', () => ({}), { virtual: true })
jest.mock('ace-builds/src-noconflict/theme-monokai', () => ({}), { virtual: true })
jest.mock('ace-builds/src-noconflict/ext-language_tools', () => ({}), { virtual: true })

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
  overrides: Partial<GluuInputEditorProps<FormikValues>> = {},
): GluuInputEditorProps<FormikValues> => ({
  name: 'script',
  language: 'python',
  label: 'Script',
  value: 'print("hi")',
  formik: createMockFormik({ script: 'print("hi")' }),
  ...overrides,
})

const renderEditor = (props: GluuInputEditorProps<FormikValues>) =>
  render(
    <AppTestWrapper>
      <GluuInputEditor {...props} />
    </AppTestWrapper>,
  )

const getEditor = (): HTMLTextAreaElement => screen.getByTestId('ace') as HTMLTextAreaElement

describe('GluuInputEditor', () => {
  it('renders the label and the editor', () => {
    renderEditor(baseProps())
    expect(screen.getByText('Script')).toBeInTheDocument()
    expect(getEditor()).toBeInTheDocument()
  })

  it('shows the current value in the editor', () => {
    renderEditor(baseProps({ value: 'let x = 1' }))
    expect(getEditor()).toHaveValue('let x = 1')
  })

  it('falls back to an empty string when value is undefined', () => {
    renderEditor(baseProps({ value: undefined }))
    expect(getEditor()).toHaveValue('')
  })

  it('writes changes to formik via setFieldValue', () => {
    const formik = createMockFormik({ script: '' })
    renderEditor(baseProps({ formik, name: 'script', value: '' }))
    fireEvent.change(getEditor(), { target: { value: 'new code' } })
    expect(formik.setFieldValue).toHaveBeenCalledTimes(1)
    expect(formik.setFieldValue).toHaveBeenCalledWith('script', 'new code')
  })

  it('does not write to formik when readOnly is true', () => {
    const formik = createMockFormik({ script: 'locked' })
    renderEditor(baseProps({ formik, readOnly: true, value: 'locked' }))
    fireEvent.change(getEditor(), { target: { value: 'attempted edit' } })
    expect(formik.setFieldValue).not.toHaveBeenCalled()
  })

  it('marks the editor read-only when readOnly is true', () => {
    renderEditor(baseProps({ readOnly: true }))
    expect(getEditor()).toHaveAttribute('readonly')
  })

  it('passes the placeholder through to the editor', () => {
    renderEditor(baseProps({ value: undefined, placeholder: 'Type here' }))
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
  })

  it('uses the default placeholder when none is provided', () => {
    renderEditor(baseProps({ value: undefined }))
    expect(screen.getByPlaceholderText('Write your custom script here')).toBeInTheDocument()
  })

  it('renders an error message when showError and errorMessage are set', () => {
    renderEditor(baseProps({ showError: true, errorMessage: 'Required field' }))
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('does not render an error message when showError is false', () => {
    renderEditor(baseProps({ showError: false, errorMessage: 'Required field' }))
    expect(screen.queryByText('Required field')).not.toBeInTheDocument()
  })

  it('renders the shortcode node when provided', () => {
    renderEditor(baseProps({ shortcode: <span data-testid="shortcode">SC</span> }))
    expect(screen.getByTestId('shortcode')).toBeInTheDocument()
  })
})

import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JansLockFieldRenderer from 'Plugins/jans-lock/components/JansLockFieldRenderer'
import type { FieldConfig, JansLockConfigFormValues } from 'Plugins/jans-lock/types'
import type { FormikProps } from 'formik'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Lock: 'Lock' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Lock: [] },
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    noReducer: (state = {}) => state,
  }),
})

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

const defaultFormValues: JansLockConfigFormValues = {
  baseDN: '',
  tokenChannels: [],
  disableJdkLogger: false,
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  externalLoggerConfiguration: '',
  disableExternalLoggerConfiguration: false,
  metricReporterEnabled: true,
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
  cleanServiceInterval: 60,
  metricChannel: '',
  policiesJsonUrisAuthorizationToken: '',
  policiesJsonUris: '',
  policiesZipUrisAuthorizationToken: '',
  policiesZipUris: '',
}

const createMockFormik = (
  overrides: Partial<FormikProps<JansLockConfigFormValues>> = {},
): FormikProps<JansLockConfigFormValues> => ({
  values: defaultFormValues,
  initialValues: defaultFormValues,
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

const defaultProps = {
  fieldItemClass: 'field-item',
  fieldItemFullWidthClass: 'field-item-full',
  viewOnly: false,
}

describe('JansLockFieldRenderer', () => {
  it('renders text field', () => {
    const config: FieldConfig = {
      name: 'baseDN',
      label: 'fields.base_dn',
      type: 'text',
      colSize: 6,
      placeholder: 'placeholders.enter_base_dn',
    }

    render(
      <Wrapper>
        <JansLockFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('input[name="baseDN"]')).toBeInTheDocument()
  })

  it('renders number field', () => {
    const config: FieldConfig = {
      name: 'cleanServiceInterval',
      label: 'fields.clean_service_interval',
      type: 'number',
      colSize: 6,
    }

    render(
      <Wrapper>
        <JansLockFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="cleanServiceInterval"]')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'number')
  })

  it('renders select field with options', () => {
    const config: FieldConfig = {
      name: 'loggingLevel',
      label: 'fields.logging_level',
      type: 'select',
      selectOptions: ['INFO', 'DEBUG', 'ERROR'],
      colSize: 6,
    }

    render(
      <Wrapper>
        <JansLockFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    const select = document.querySelector('select[name="loggingLevel"]')
    expect(select).toBeInTheDocument()
  })

  it('renders toggle field', () => {
    const config: FieldConfig = {
      name: 'disableJdkLogger',
      label: 'fields.disable_jdk_logger',
      type: 'toggle',
      colSize: 6,
    }

    const { container } = render(
      <Wrapper>
        <JansLockFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    // Toggle renders as a custom switch, not a standard input
    const toggle = container.querySelector('.field-item')
    expect(toggle).toBeInTheDocument()
  })

  it('disables field when viewOnly is true', () => {
    const config: FieldConfig = {
      name: 'baseDN',
      label: 'fields.base_dn',
      type: 'text',
      colSize: 6,
    }

    render(
      <Wrapper>
        <JansLockFieldRenderer
          config={config}
          formik={createMockFormik()}
          {...defaultProps}
          viewOnly={true}
        />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="baseDN"]')
    expect(input).toBeDisabled()
  })

  it('disables field when config.disabled is true', () => {
    const config: FieldConfig = {
      name: 'baseDN',
      label: 'fields.base_dn',
      type: 'text',
      disabled: true,
      colSize: 6,
    }

    render(
      <Wrapper>
        <JansLockFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="baseDN"]')
    expect(input).toBeDisabled()
  })

  it('uses full-width class when colSize is 12', () => {
    const config: FieldConfig = {
      name: 'baseDN',
      label: 'fields.base_dn',
      type: 'text',
      colSize: 12,
    }

    const { container } = render(
      <Wrapper>
        <JansLockFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(container.querySelector('.field-item-full')).toBeInTheDocument()
  })

  it('uses regular class when colSize is not 12', () => {
    const config: FieldConfig = {
      name: 'baseDN',
      label: 'fields.base_dn',
      type: 'text',
      colSize: 6,
    }

    const { container } = render(
      <Wrapper>
        <JansLockFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(container.querySelector('.field-item')).toBeInTheDocument()
  })

  it('returns null for unknown field type', () => {
    const config = {
      name: 'baseDN' as const,
      label: 'fields.base_dn',
      type: 'unknown' as 'text',
      colSize: 6,
    }

    const { container } = render(
      <Wrapper>
        <JansLockFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(container.firstChild).toBeNull()
  })
})

import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import ScimFieldRenderer from 'Plugins/scim/components/ScimFieldRenderer'
import type { FieldConfig, ScimFormValues } from 'Plugins/scim/types'
import type { FormikProps } from 'formik'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { SCIM: 'SCIM' },
  CEDAR_RESOURCE_SCOPES: { SCIM: [] },
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

const defaultFormValues: ScimFormValues = {
  baseDN: '',
  applicationUrl: '',
  baseEndpoint: '',
  personCustomObjectClass: '',
  oxAuthIssuer: '',
  protectionMode: 'OAUTH',
  maxCount: 200,
  bulkMaxOperations: 30,
  bulkMaxPayloadSize: 3145728,
  userExtensionSchemaURI: '',
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  externalLoggerConfiguration: '',
  disableExternalLoggerConfiguration: false,
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
  metricReporterEnabled: true,
  disableJdkLogger: false,
  disableLoggerTimer: false,
  useLocalCache: false,
  skipDefinedPasswordValidation: false,
}

const createMockFormik = (
  overrides: Partial<FormikProps<ScimFormValues>> = {},
): FormikProps<ScimFormValues> => ({
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
}

describe('ScimFieldRenderer', () => {
  it('renders a text field', () => {
    const config: FieldConfig = {
      name: 'applicationUrl',
      label: 'fields.application_url',
      type: 'text',
      colSize: 6,
    }

    render(
      <Wrapper>
        <ScimFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('input[name="applicationUrl"]')).toBeInTheDocument()
  })

  it('renders a number field', () => {
    const config: FieldConfig = {
      name: 'maxCount',
      label: 'fields.max_count',
      type: 'number',
      colSize: 6,
    }

    render(
      <Wrapper>
        <ScimFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="maxCount"]')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'number')
  })

  it('renders a select field', () => {
    const config: FieldConfig = {
      name: 'loggingLevel',
      label: 'fields.logging_level',
      type: 'select',
      selectOptions: ['INFO', 'DEBUG', 'ERROR'],
      colSize: 6,
    }

    render(
      <Wrapper>
        <ScimFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('select[name="loggingLevel"]')).toBeInTheDocument()
  })

  it('renders a toggle field', () => {
    const config: FieldConfig = {
      name: 'useLocalCache',
      label: 'fields.use_local_cache',
      type: 'toggle',
      colSize: 6,
    }

    const { container } = render(
      <Wrapper>
        <ScimFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument()
  })

  it('disables the field when config.disabled is true', () => {
    const config: FieldConfig = {
      name: 'baseDN',
      label: 'fields.base_dn',
      type: 'text',
      disabled: true,
      colSize: 12,
    }

    render(
      <Wrapper>
        <ScimFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('input[name="baseDN"]')).toBeDisabled()
  })

  it('populates the field value from formik values', () => {
    const config: FieldConfig = {
      name: 'applicationUrl',
      label: 'fields.application_url',
      type: 'text',
      colSize: 6,
    }

    render(
      <Wrapper>
        <ScimFieldRenderer
          config={config}
          formik={createMockFormik({
            values: { ...defaultFormValues, applicationUrl: 'https://example.com' },
          })}
          {...defaultProps}
        />
      </Wrapper>,
    )

    expect(document.querySelector('input[name="applicationUrl"]')).toHaveValue(
      'https://example.com',
    )
  })

  it('uses the full-width class when colSize is 12', () => {
    const config: FieldConfig = {
      name: 'baseDN',
      label: 'fields.base_dn',
      type: 'text',
      colSize: 12,
    }

    const { container } = render(
      <Wrapper>
        <ScimFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(container.querySelector('.field-item-full')).toBeInTheDocument()
  })

  it('uses the regular class when colSize is not 12', () => {
    const config: FieldConfig = {
      name: 'applicationUrl',
      label: 'fields.application_url',
      type: 'text',
      colSize: 6,
    }

    const { container } = render(
      <Wrapper>
        <ScimFieldRenderer config={config} formik={createMockFormik()} {...defaultProps} />
      </Wrapper>,
    )

    expect(container.querySelector('.field-item')).toBeInTheDocument()
  })

  it('returns null for an unrecognized field type', () => {
    const config: Omit<FieldConfig, 'type'> & { type: string } = {
      name: 'applicationUrl',
      label: 'fields.application_url',
      type: 'unrecognized',
      colSize: 6,
    }

    const { container } = render(
      <Wrapper>
        <ScimFieldRenderer
          config={config as FieldConfig}
          formik={createMockFormik()}
          {...defaultProps}
        />
      </Wrapper>,
    )

    expect(container.firstChild).toBeNull()
  })
})

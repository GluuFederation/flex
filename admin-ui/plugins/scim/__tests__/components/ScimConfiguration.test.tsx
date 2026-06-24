import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import ScimConfiguration from 'Plugins/scim/components/ScimConfiguration'
import type { ScimConfigurationProps, AppConfiguration3 } from 'Plugins/scim/types'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { SCIM: 'SCIM', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { SCIM: [], Webhooks: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { SCIM: 'SCIM', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { SCIM: [], Webhooks: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isFetching: false, isFetched: true })),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    webhookReducer: (
      state = {
        featureWebhooks: [],
        loadingWebhooks: false,
        webhookModal: false,
        triggerWebhookInProgress: false,
      },
    ) => state,
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

const mockClasses: ScimConfigurationProps['classes'] = {
  formSection: 'formSection',
  fieldsGrid: 'fieldsGrid',
  formLabels: 'formLabels',
  formWithInputs: 'formWithInputs',
  fieldItem: 'fieldItem',
  fieldItemFullWidth: 'fieldItemFullWidth',
}

const mockConfig: AppConfiguration3 = {
  baseDN: 'ou=scim,o=gluu',
  applicationUrl: 'https://example.com',
  baseEndpoint: 'https://example.com/scim',
  personCustomObjectClass: 'gluuCustomPerson',
  oxAuthIssuer: 'https://example.com',
  protectionMode: 'OAUTH',
  maxCount: 200,
  bulkMaxOperations: 30,
  bulkMaxPayloadSize: 3145728,
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  metricReporterEnabled: true,
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
  useLocalCache: false,
}

const mockHandleSubmit = jest.fn()

const defaultProps: ScimConfigurationProps = {
  scimConfiguration: mockConfig,
  handleSubmit: mockHandleSubmit,
  isSubmitting: false,
  canWriteScim: true,
  classes: mockClasses,
}

describe('ScimConfiguration', () => {
  beforeEach(() => {
    mockHandleSubmit.mockClear()
  })

  it('renders the form without crashing', () => {
    render(
      <Wrapper>
        <ScimConfiguration {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
  })

  it('populates fields from the supplied configuration', () => {
    render(
      <Wrapper>
        <ScimConfiguration {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('input[name="baseDN"]')).toHaveValue('ou=scim,o=gluu')
    expect(document.querySelector('input[name="applicationUrl"]')).toHaveValue(
      'https://example.com',
    )
  })

  it('renders the disabled baseDN field', () => {
    render(
      <Wrapper>
        <ScimConfiguration {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('input[name="baseDN"]')).toBeDisabled()
  })

  it('renders select fields for protection mode and logging level', () => {
    render(
      <Wrapper>
        <ScimConfiguration {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('select[name="protectionMode"]')).toBeInTheDocument()
    expect(document.querySelector('select[name="loggingLevel"]')).toBeInTheDocument()
  })

  it('renders the Apply submit button when canWriteScim is true', () => {
    render(
      <Wrapper>
        <ScimConfiguration {...defaultProps} />
      </Wrapper>,
    )

    const applyButton = document.querySelector('button[type="submit"]')
    expect(applyButton).toBeTruthy()
    expect(applyButton).toHaveAttribute('title', 'Apply')
  })

  it('hides the Apply button when canWriteScim is false', () => {
    render(
      <Wrapper>
        <ScimConfiguration {...defaultProps} canWriteScim={false} />
      </Wrapper>,
    )

    expect(document.querySelector('button[type="submit"]')).toBeNull()
  })

  it('reflects edits to an editable field', async () => {
    render(
      <Wrapper>
        <ScimConfiguration {...defaultProps} />
      </Wrapper>,
    )

    const appUrl = document.querySelector('input[name="applicationUrl"]') as HTMLInputElement
    fireEvent.change(appUrl, { target: { value: 'https://updated.example.com' } })

    await waitFor(() => {
      expect(appUrl.value).toBe('https://updated.example.com')
    })
  })

  it('renders without crashing when configuration is undefined', () => {
    render(
      <Wrapper>
        <ScimConfiguration {...defaultProps} scimConfiguration={undefined} />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
    expect(document.querySelector('input[name="baseDN"]')).toHaveValue('')
  })

  it('disables Apply and Cancel while the form is pristine', () => {
    render(
      <Wrapper>
        <ScimConfiguration {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('button[type="submit"]')).toBeDisabled()
    expect(screen.getByTitle('Cancel').closest('button')).toBeDisabled()
  })
})

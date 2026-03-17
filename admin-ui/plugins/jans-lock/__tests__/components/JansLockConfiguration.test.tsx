import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JansLockConfiguration from 'Plugins/jans-lock/components/JansLockConfiguration'
import type { JansLockFormClasses, JansLockConfigurationProps } from 'Plugins/jans-lock/types'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Lock: 'Lock', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Lock: [], Webhooks: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Lock: 'Lock', Webhooks: 'Webhooks' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Lock: [], Webhooks: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetLockProperties: jest.fn(() => ({ data: undefined, isLoading: false })),
  usePatchLockProperties: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
  getGetLockPropertiesQueryKey: jest.fn(() => ['lockProperties']),
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

const mockClasses: JansLockFormClasses = {
  formSection: 'formSection',
  fieldsGrid: 'fieldsGrid',
  formLabels: 'formLabels',
  formWithInputs: 'formWithInputs',
  fieldItem: 'fieldItem',
  fieldItemFullWidth: 'fieldItemFullWidth',
}

const mockConfig: JansLockConfigurationProps['lockConfig'] = {
  baseDN: 'ou=lock,o=gluu',
  tokenChannels: ['channel1'],
  disableJdkLogger: true,
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  externalLoggerConfiguration: '',
  disableExternalLoggerConfiguration: false,
  metricReporterEnabled: true,
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
  cleanServiceInterval: 60,
  metricChannel: '',
  cedarlingConfiguration: {
    policySources: [],
  },
}

const mockOnUpdate = jest.fn()

const defaultProps = {
  lockConfig: mockConfig,
  onUpdate: mockOnUpdate,
  isSubmitting: false,
  canWriteLock: true,
  classes: mockClasses,
}

describe('JansLockConfiguration', () => {
  beforeEach(() => {
    mockOnUpdate.mockClear()
  })

  it('renders without crashing', () => {
    render(
      <Wrapper>
        <JansLockConfiguration {...defaultProps} />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
  })

  it('populates form with config values', () => {
    render(
      <Wrapper>
        <JansLockConfiguration {...defaultProps} />
      </Wrapper>,
    )

    const baseDNInput = document.querySelector('input[name="baseDN"]')
    expect(baseDNInput).toHaveValue('ou=lock,o=gluu')

    const cleanIntervalInput = document.querySelector(
      'input[name="cleanServiceInterval"]',
    ) as HTMLInputElement
    expect(cleanIntervalInput?.value).toBe('60')
  })

  it('renders select field for logging level', () => {
    render(
      <Wrapper>
        <JansLockConfiguration {...defaultProps} />
      </Wrapper>,
    )

    const loggingSelect = document.querySelector('select[name="loggingLevel"]')
    expect(loggingSelect).toBeInTheDocument()
  })

  it('renders toggle fields', () => {
    const { container } = render(
      <Wrapper>
        <JansLockConfiguration {...defaultProps} />
      </Wrapper>,
    )

    // Toggles render as custom switch components, verify they exist by checking form groups
    const formGroups = container.querySelectorAll('.row')
    expect(formGroups.length).toBeGreaterThan(0)
  })

  it('disables form footer when canWriteLock is false', () => {
    render(
      <Wrapper>
        <JansLockConfiguration {...defaultProps} canWriteLock={false} />
      </Wrapper>,
    )

    const applyButton = screen.queryByText('actions.apply')
    expect(applyButton).toBeNull()
  })

  it('disables apply button when form is not dirty', () => {
    render(
      <Wrapper>
        <JansLockConfiguration {...defaultProps} />
      </Wrapper>,
    )

    const applyButton = document.querySelector('button[type="submit"]')
    expect(applyButton).toBeTruthy()
    expect(applyButton).toBeDisabled()
  })

  it('detects form changes after field modification', async () => {
    render(
      <Wrapper>
        <JansLockConfiguration {...defaultProps} />
      </Wrapper>,
    )

    const baseDNInput = document.querySelector('input[name="baseDN"]') as HTMLInputElement
    expect(baseDNInput).toBeInTheDocument()

    fireEvent.change(baseDNInput, { target: { value: 'ou=new,o=gluu' } })
    await waitFor(() => {
      expect(baseDNInput.value).toBe('ou=new,o=gluu')
    })
  })

  it('renders with empty config', () => {
    render(
      <Wrapper>
        <JansLockConfiguration {...defaultProps} lockConfig={{}} />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
  })
})

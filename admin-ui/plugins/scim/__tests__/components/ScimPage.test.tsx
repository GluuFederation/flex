import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import ScimPage from 'Plugins/scim/components/ScimPage'

const mockMutateAsync = jest.fn()

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { SCIM: 'SCIM' },
  CEDAR_RESOURCE_SCOPES: { SCIM: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { SCIM: 'SCIM' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { SCIM: [] },
}))

const mockScimConfig = {
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
  disableJdkLogger: false,
  metricReporterEnabled: true,
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
  useLocalCache: false,
}

jest.mock('JansConfigApi', () => ({
  useGetScimConfig: jest.fn(() => ({
    data: mockScimConfig,
    isLoading: false,
  })),
  usePatchScimConfig: jest.fn(() => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  })),
  getGetScimConfigQueryKey: jest.fn(() => ['scimConfig']),
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isFetching: false, isFetched: true })),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (
      state = { permissions: [], userinfo: { name: 'Test' }, config: { clientId: '123' } },
    ) => state,
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

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('ScimPage', () => {
  beforeEach(() => {
    mockMutateAsync.mockClear()
    queryClient.clear()
    jest.requireMock('@/cedarling').useCedarling.mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
    }))
    jest.requireMock('JansConfigApi').useGetScimConfig.mockImplementation(() => ({
      data: mockScimConfig,
      isLoading: false,
    }))
  })

  it('renders without crashing', () => {
    render(
      <Wrapper>
        <ScimPage />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
  })

  it('renders the configuration form with data', () => {
    render(
      <Wrapper>
        <ScimPage />
      </Wrapper>,
    )

    const baseDNInput = document.querySelector('input[name="baseDN"]')
    expect(baseDNInput).toBeInTheDocument()
    expect(baseDNInput).toHaveValue('ou=scim,o=gluu')
  })

  it('renders when user has no read permission', () => {
    jest.requireMock('@/cedarling').useCedarling.mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => false),
      hasCedarWritePermission: jest.fn(() => false),
      authorizeHelper: jest.fn(),
    }))

    render(
      <Wrapper>
        <ScimPage />
      </Wrapper>,
    )

    expect(document.querySelector('[data-testid="MISSING"]')).toBeInTheDocument()
    expect(document.querySelector('input[name="baseDN"]')).not.toBeInTheDocument()
  })

  it('renders loading state', () => {
    jest.requireMock('JansConfigApi').useGetScimConfig.mockImplementation(() => ({
      data: undefined,
      isLoading: true,
    }))

    render(
      <Wrapper>
        <ScimPage />
      </Wrapper>,
    )

    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument()
    expect(document.querySelector('form')).toBeInTheDocument()
  })

  it('renders with empty config', () => {
    jest.requireMock('JansConfigApi').useGetScimConfig.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })

    render(
      <Wrapper>
        <ScimPage />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
  })

  it('populates form fields from config', () => {
    render(
      <Wrapper>
        <ScimPage />
      </Wrapper>,
    )

    const loggingLevelSelect = document.querySelector('[name="loggingLevel"]')
    expect(loggingLevelSelect).toBeInTheDocument()

    const appUrlInput = document.querySelector('input[name="applicationUrl"]')
    expect(appUrlInput).toBeInTheDocument()
    expect(appUrlInput).toHaveValue('https://example.com')
  })
})

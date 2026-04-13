import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JansLock from 'Plugins/jans-lock/components/JansLock'

const mockMutate = jest.fn()

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Lock: 'Lock' },
  CEDAR_RESOURCE_SCOPES: { Lock: ['read', 'write'] },
}))

const mockLockConfig = {
  baseDN: 'ou=lock,o=gluu',
  disableJdkLogger: true,
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  cleanServiceInterval: 60,
  metricReporterEnabled: true,
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
}

jest.mock('JansConfigApi', () => ({
  useGetLockProperties: jest.fn(() => ({
    data: mockLockConfig,
    isLoading: false,
  })),
  usePatchLockProperties: jest.fn(() => ({
    mutate: mockMutate,
    isPending: false,
  })),
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

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('JansLock', () => {
  beforeEach(() => {
    mockMutate.mockClear()
    queryClient.clear()
    jest.requireMock('@/cedarling').useCedarling.mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
    }))
    jest.requireMock('JansConfigApi').useGetLockProperties.mockImplementation(() => ({
      data: mockLockConfig,
      isLoading: false,
    }))
  })

  it('renders without crashing', () => {
    render(
      <Wrapper>
        <JansLock />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
  })

  it('renders the configuration form with data', () => {
    render(
      <Wrapper>
        <JansLock />
      </Wrapper>,
    )

    const baseDNInput = document.querySelector('input[name="baseDN"]')
    expect(baseDNInput).toBeInTheDocument()
    expect(baseDNInput).toHaveValue('ou=lock,o=gluu')
  })

  it('renders when user has no read permission', () => {
    jest.requireMock('@/cedarling').useCedarling.mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => false),
      hasCedarWritePermission: jest.fn(() => false),
      authorizeHelper: jest.fn(),
    }))

    render(
      <Wrapper>
        <JansLock />
      </Wrapper>,
    )

    expect(document.querySelector('[data-testid="MISSING"]')).toBeInTheDocument()
    expect(document.querySelector('input[name="baseDN"]')).not.toBeInTheDocument()
  })

  it('renders loading state', () => {
    jest.requireMock('JansConfigApi').useGetLockProperties.mockImplementation(() => ({
      data: undefined,
      isLoading: true,
    }))

    render(
      <Wrapper>
        <JansLock />
      </Wrapper>,
    )

    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument()
    expect(document.querySelector('form')).toBeInTheDocument()
  })

  it('renders with empty config', () => {
    const { useGetLockProperties } = jest.requireMock('JansConfigApi')
    useGetLockProperties.mockReturnValueOnce({ data: undefined, isLoading: false })

    render(
      <Wrapper>
        <JansLock />
      </Wrapper>,
    )

    expect(document.querySelector('form')).toBeInTheDocument()
  })
})

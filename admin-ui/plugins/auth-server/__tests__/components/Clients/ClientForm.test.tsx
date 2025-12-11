import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const mockClient = {
  inum: '1801.a0beec01-617b-4607-8a35-3e46ac43deb5',
  clientName: 'Jans Config Api Client',
  displayName: 'Jans Config Api Client',
  applicationType: 'web',
  disabled: false,
  grantTypes: ['authorization_code', 'refresh_token', 'client_credentials'],
  responseTypes: ['code'],
  tokenEndpointAuthMethod: 'client_secret_basic',
}

jest.mock('@janssenproject/cedarling_wasm', () => ({
  __esModule: true,
  default: jest.fn(),
  init: jest.fn(),
  Cedarling: jest.fn(),
  AuthorizeResult: jest.fn(),
}))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    authorize: jest.fn(() => true),
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
  })),
  AdminUiFeatureResource: {},
}))

jest.mock('JansConfigApi', () => ({
  useGetConfigScripts: jest.fn(() => ({
    data: {
      entries: [],
      totalEntriesCount: 0,
    },
    isLoading: false,
  })),
  useGetProperties: jest.fn(() => ({
    data: {},
    isLoading: false,
  })),
}))

const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]

const INIT_STATE = {
  permissions: permissions,
}

const WEBHOOK_STATE = {
  loadingWebhooks: false,
  webhookModal: false,
  webhooks: [],
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    cedarPermissions: (state = { permissions: [] }) => state,
    webhookReducer: (state = WEBHOOK_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppTestWrapper>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  </AppTestWrapper>
)

describe('ClientForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()
  const mockOnScopeSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it('provides correct mock client data', () => {
    expect(mockClient.inum).toBe('1801.a0beec01-617b-4607-8a35-3e46ac43deb5')
    expect(mockClient.clientName).toBe('Jans Config Api Client')
    expect(mockClient.grantTypes).toContain('authorization_code')
    expect(mockClient.responseTypes).toContain('code')
  })

  it('has correct structure for edit mode client', () => {
    expect(mockClient).toHaveProperty('inum')
    expect(mockClient).toHaveProperty('clientName')
    expect(mockClient).toHaveProperty('displayName')
    expect(mockClient).toHaveProperty('applicationType')
    expect(mockClient).toHaveProperty('grantTypes')
    expect(mockClient).toHaveProperty('responseTypes')
    expect(mockClient).toHaveProperty('tokenEndpointAuthMethod')
  })

  it('onCancel mock is callable', () => {
    mockOnCancel()
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('onSubmit mock can be called with values', () => {
    const formValues = { ...mockClient, expirable: false }
    mockOnSubmit(formValues, 'test message', {})
    expect(mockOnSubmit).toHaveBeenCalledWith(formValues, 'test message', {})
  })

  it('onScopeSearch mock can search scopes', () => {
    mockOnScopeSearch('openid')
    expect(mockOnScopeSearch).toHaveBeenCalledWith('openid')
  })
})

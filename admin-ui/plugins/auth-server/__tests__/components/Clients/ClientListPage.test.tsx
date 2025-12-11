import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const mockNavigate = jest.fn()
const mockUseGetOauthOpenidClients = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

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
  useGetOauthOpenidClients: () => mockUseGetOauthOpenidClients(),
  useDeleteOauthOpenidClientByInum: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  getGetOauthOpenidClientsQueryKey: jest.fn(() => ['oauth-openid-clients']),
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

describe('ClientListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
    mockUseGetOauthOpenidClients.mockReturnValue({
      data: {
        entries: [
          {
            inum: '1801.a0beec01-617b-4607-8a35-3e46ac43deb5',
            clientName: 'Jans Config Api Client',
            displayName: 'Jans Config Api Client',
            applicationType: 'web',
            disabled: false,
          },
        ],
        totalEntriesCount: 1,
        entriesCount: 1,
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
  })

  it('returns client list data from hook', () => {
    const result = mockUseGetOauthOpenidClients()
    expect(result.data?.entries).toHaveLength(1)
    expect(result.isLoading).toBe(false)
    expect(result.data?.entries[0].clientName).toBe('Jans Config Api Client')
  })

  it('mock returns correct client inum', () => {
    const result = mockUseGetOauthOpenidClients()
    expect(result.data?.entries[0].inum).toBe('1801.a0beec01-617b-4607-8a35-3e46ac43deb5')
  })
})

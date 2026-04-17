import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { ClientListPage } from 'Plugins/auth-server/components/OidcClients'
import { Provider } from 'react-redux'
import mockClients from '../fixtures/mockClients'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginSagasResolver', () => ({ __esModule: true, default: jest.fn(() => []) }))

jest.mock('JansConfigApi', () => ({
  useGetOauthOpenidClients: jest.fn(() => ({
    data: { entries: [mockClients[0]], totalEntriesCount: 1 },
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
  })),
  useDeleteOauthOpenidClientByInum: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useGetOauthScopes: jest.fn(() => ({
    data: { entries: [] },
    isLoading: false,
  })),
  useGetOauthScopesByInum: jest.fn(() => ({
    data: undefined,
    isLoading: false,
  })),
  useGetWebhooksByFeatureId: jest.fn(() => ({
    data: [],
    isLoading: false,
  })),
  getGetOauthOpenidClientsQueryKey: jest.fn(() => ['/api/v1/openid/clients']),
}))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    checkPermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
    loading: false,
    error: null,
    initialized: true,
  })),
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: {},
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    Clients: 'clients',
    Webhooks: 'webhooks',
  },
}))

jest.mock('@/cedarling/hooks/useCedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
    loading: false,
    error: null,
    initialized: true,
  })),
}))

jest.mock('Plugins/auth-server/components/OidcClients/hooks', () => ({
  ...jest.requireActual('Plugins/auth-server/components/OidcClients/hooks'),
  useClients: jest.fn(() => ({
    clients: [mockClients[0]],
    totalCount: 1,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
  })),
  useDeleteClient: jest.fn(() => ({
    deleteClient: jest.fn(),
    isDeleting: false,
  })),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ search: '', pathname: '/clients' }),
}))

const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]

const INIT_STATE = {
  permissions,
  userinfo: { inum: 'test-user-inum' },
  hasSession: true,
  config: { clientId: 'test-client-id' },
}

const INIT_CEDAR_STATE = {
  permissions: {},
  loading: false,
  error: null,
  initialized: true,
  isInitializing: false,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    cedarPermissions: (state = INIT_CEDAR_STATE) => state,
    webhookReducer: (state = { webhookModal: false }) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>
        <Provider store={store}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
}

it('Should render the client list page properly', () => {
  const { container } = render(<ClientListPage />, { wrapper: Wrapper })

  const client = mockClients[0]
  if (!client) {
    throw new Error('Test fixture mockClients is empty — at least one client is required')
  }

  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  expect(within(container).getAllByText(client.inum).length).toBeGreaterThan(0)
  expect(screen.getByText(client.clientName!)).toBeInTheDocument()
})

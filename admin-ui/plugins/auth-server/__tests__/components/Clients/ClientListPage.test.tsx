import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import ClientListPage from 'Plugins/auth-server/components/Clients/ClientListPage'

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
    authorizeHelper: jest.fn(),
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
  useGetOauthScopes: jest.fn(() => ({
    data: { entries: [] },
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
  featureWebhooks: [],
  triggerWebhookInProgress: false,
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
            grantTypes: ['authorization_code', 'client_credentials'],
          },
          {
            inum: '1001.7f0a05b2-0976-475f-8048-50d4cc5e845f',
            clientName: 'Admin UI Client',
            displayName: 'Admin UI Client',
            applicationType: 'web',
            disabled: true,
            grantTypes: ['refresh_token'],
          },
        ],
        totalEntriesCount: 2,
        entriesCount: 2,
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
  })

  it('renders client list page', async () => {
    render(<ClientListPage />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add client/i })).toBeInTheDocument()
    })
  })

  it('displays client names in the list', async () => {
    render(<ClientListPage />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Jans Config Api Client')).toBeInTheDocument()
      expect(screen.getByText('Admin UI Client')).toBeInTheDocument()
    })
  })

  it('does not display client data when loading', async () => {
    mockUseGetOauthOpenidClients.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    })

    render(<ClientListPage />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.queryByText('Jans Config Api Client')).not.toBeInTheDocument()
    })
  })

  it('renders add client button', async () => {
    render(<ClientListPage />, { wrapper: Wrapper })

    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /add client/i })
      expect(addButton).toBeInTheDocument()
    })
  })

  it('navigates to add client page when add button is clicked', async () => {
    render(<ClientListPage />, { wrapper: Wrapper })

    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /add client/i })
      fireEvent.click(addButton)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/auth-server/client/new')
  })

  it('renders search input', async () => {
    render(<ClientListPage />, { wrapper: Wrapper })

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search/i)
      expect(searchInput).toBeInTheDocument()
    })
  })

  it('renders refresh button', async () => {
    render(<ClientListPage />, { wrapper: Wrapper })

    await waitFor(() => {
      const refreshButton = screen.getByTestId('RefreshIcon')
      expect(refreshButton).toBeInTheDocument()
    })
  })

  it('displays correct number of clients', async () => {
    render(<ClientListPage />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Jans Config Api Client')).toBeInTheDocument()
      expect(screen.getByText('Admin UI Client')).toBeInTheDocument()
    })
  })

  it('renders empty state when no clients exist', async () => {
    mockUseGetOauthOpenidClients.mockReturnValue({
      data: {
        entries: [],
        totalEntriesCount: 0,
        entriesCount: 0,
      },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<ClientListPage />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText(/no records to display/i)).toBeInTheDocument()
    })
  })
})

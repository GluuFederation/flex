import React from 'react'
import { render, screen } from '@testing-library/react'
import SessionListPage from 'Plugins/auth-server/components/Sessions/SessionListPage'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import mockSessions from '../fixtures/mockSessions'
import type { Session } from 'Plugins/auth-server/components/Sessions/types'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Session: 'sessions', Webhooks: 'webhooks' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { sessions: [], webhooks: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetSessions: jest.fn(() => {
    const sessions = jest.requireActual('../fixtures/mockSessions').default
    return {
      data: {
        entries: sessions.map((s: Session) => ({
          ...s,
          permissionGranted: s.permissionGrantedMap,
        })),
      },
      isLoading: false,
      refetch: jest.fn(),
    }
  }),
  useDeleteSession: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useRevokeUserSession: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useSearchSession: jest.fn(() => ({
    data: null,
    isLoading: false,
  })),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (
      state = {
        hasSession: true,
        permissions: [],
        config: { clientId: 'test-client' },
        userinfo: { sub: 'admin' },
      },
    ) => state,
    webhookReducer: (
      state = {
        featureWebhooks: [],
        loadingWebhooks: false,
        webhookModal: false,
        triggerWebhookInProgress: false,
      },
    ) => state,
    cedarPermissions: (state = { permissions: [] }) => state,
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

describe('SessionListPage', () => {
  it('renders the session list page with table headers', async () => {
    render(<SessionListPage />, { wrapper: Wrapper })
    const usernameElements = await screen.findAllByText(/Username/i)
    expect(usernameElements.length).toBeGreaterThanOrEqual(1)
    const ipElements = screen.getAllByText(/IP Address/i)
    expect(ipElements.length).toBeGreaterThanOrEqual(1)
    const clientIdElements = screen.getAllByText(/Client Id/i)
    expect(clientIdElements.length).toBeGreaterThanOrEqual(1)
    const authTimeElements = screen.getAllByText(/Auth Time/i)
    expect(authTimeElements.length).toBeGreaterThanOrEqual(1)
    const acrElements = screen.getAllByText(/ACR/i)
    expect(acrElements.length).toBeGreaterThanOrEqual(1)
    const stateElements = screen.getAllByText(/State/i)
    expect(stateElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders session data in the table', async () => {
    render(<SessionListPage />, { wrapper: Wrapper })
    const username = mockSessions[0].sessionAttributes.auth_user
    expect(await screen.findByText(username)).toBeInTheDocument()
    const ipAddress = mockSessions[0].sessionAttributes.remote_ip
    expect(screen.getByText(ipAddress)).toBeInTheDocument()
  })

  it('renders the search toolbar with select dropdown', async () => {
    render(<SessionListPage />, { wrapper: Wrapper })
    await screen.findByText(mockSessions[0].sessionAttributes.auth_user)
    expect(screen.getByText(/Select the user to revoke/i)).toBeInTheDocument()
  })

  it('renders the Filters button', async () => {
    render(<SessionListPage />, { wrapper: Wrapper })
    await screen.findByText(mockSessions[0].sessionAttributes.auth_user)
    expect(screen.getByText(/Filters/i)).toBeInTheDocument()
  })

  it('renders the Export CSV button', async () => {
    render(<SessionListPage />, { wrapper: Wrapper })
    await screen.findByText(mockSessions[0].sessionAttributes.auth_user)
    expect(screen.getByText(/Export CSV/i)).toBeInTheDocument()
  })

  it('renders delete action icons when user has delete permission', async () => {
    render(<SessionListPage />, { wrapper: Wrapper })
    await screen.findByText(mockSessions[0].sessionAttributes.auth_user)
    const deleteIcons = screen.getAllByTestId('DeleteOutlinedIcon')
    expect(deleteIcons.length).toBeGreaterThanOrEqual(1)
  })

  it('renders authenticated badges for authenticated sessions', async () => {
    render(<SessionListPage />, { wrapper: Wrapper })
    const badges = await screen.findAllByText('authenticated')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  it('renders pagination controls', async () => {
    render(<SessionListPage />, { wrapper: Wrapper })
    await screen.findByText(mockSessions[0].sessionAttributes.auth_user)
    expect(screen.getByText(/Rows per page/i)).toBeInTheDocument()
  })
})

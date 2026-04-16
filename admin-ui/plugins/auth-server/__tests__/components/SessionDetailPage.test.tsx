import React from 'react'
import { render, screen } from '@testing-library/react'
import SessionDetailPage from 'Plugins/auth-server/components/Sessions/components/SessionDetailPage'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import mockSessions from '../fixtures/mockSessions'

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

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { hasSession: true, permissions: [] }) => state,
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

const testSession = mockSessions[0]

describe('SessionDetailPage', () => {
  it('renders the expanded detail row with all field labels', () => {
    render(<SessionDetailPage row={testSession} />, { wrapper: Wrapper })

    expect(screen.getByText(/Expiration:/i)).toBeInTheDocument()
    expect(screen.getByText(/Jans ID:/i)).toBeInTheDocument()
    expect(screen.getByText(/Jans State:/i)).toBeInTheDocument()
    expect(screen.getByText(/Permission Granted Map:/i)).toBeInTheDocument()
    expect(screen.getByText(/Jans Session State:/i)).toBeInTheDocument()
    expect(screen.getByText(/Jans User DN:/i)).toBeInTheDocument()
    expect(screen.getByText(/Jans Session Attributes:/i)).toBeInTheDocument()
  })

  it('renders the Jans ID extracted from userDn', () => {
    render(<SessionDetailPage row={testSession} />, { wrapper: Wrapper })
    expect(screen.getByText('baea0439-d11f-4fd7-a349-b9cd80fda871')).toBeInTheDocument()
  })

  it('renders the user DN value', () => {
    render(<SessionDetailPage row={testSession} />, { wrapper: Wrapper })
    expect(screen.getByText(testSession.userDn as string)).toBeInTheDocument()
  })

  it('renders the session state value', () => {
    render(<SessionDetailPage row={testSession} />, { wrapper: Wrapper })
    expect(screen.getByText(testSession.sessionState as string)).toBeInTheDocument()
  })

  it('renders the authenticated badge in the detail view', () => {
    render(<SessionDetailPage row={testSession} />, { wrapper: Wrapper })
    const badges = screen.getAllByText('authenticated')
    expect(badges.length).toBeGreaterThanOrEqual(1)
  })

  it('renders the permission granted map as JSON', () => {
    render(<SessionDetailPage row={testSession} />, { wrapper: Wrapper })
    const expectedJson = JSON.stringify(testSession.permissionGrantedMap, null, 2)
    expect(
      screen.getByText((_content, node) => node?.textContent === expectedJson),
    ).toBeInTheDocument()
  })

  it('renders session attributes as JSON', () => {
    render(<SessionDetailPage row={testSession} />, { wrapper: Wrapper })
    const expectedJson = JSON.stringify(testSession.sessionAttributes, null, 2)
    expect(
      screen.getByText((_content, node) => node?.textContent === expectedJson),
    ).toBeInTheDocument()
  })

  it('renders dash for missing values', () => {
    const sessionWithMissing = {
      ...testSession,
      userDn: undefined,
      sessionState: undefined,
      expirationDate: undefined,
      permissionGrantedMap: undefined,
    }
    render(<SessionDetailPage row={sessionWithMissing} />, { wrapper: Wrapper })
    const dashes = screen.getAllByText('—')
    expect(dashes).toHaveLength(5)
  })
})

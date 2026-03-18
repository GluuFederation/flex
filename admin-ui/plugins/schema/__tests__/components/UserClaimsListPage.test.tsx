import React from 'react'
import { render, screen } from '@testing-library/react'
import UserClaimsListPage from 'Plugins/schema/components/Person/UserClaimsListPage'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import attributes from '../../utils/attributes'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Attributes: 'Attributes', Webhooks: 'webhooks', Lock: 'lock' },
  CEDAR_RESOURCE_SCOPES: { Attributes: [], webhooks: [], lock: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Attributes: 'Attributes', Webhooks: 'webhooks', Lock: 'lock' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Attributes: [], webhooks: [], lock: [] },
}))

jest.mock('JansConfigApi', () => ({
  getGetAttributesQueryKey: jest.fn(() => ['attributes']),
}))

jest.mock('Plugins/schema/hooks', () => {
  const mockAttributes = jest.requireActual('../../utils/attributes').default
  return {
    useAttributes: jest.fn(() => ({
      data: {
        entries: mockAttributes,
        totalEntriesCount: mockAttributes.length,
        entriesCount: mockAttributes.length,
      },
      isLoading: false,
      error: null,
    })),
    useDeleteAttribute: jest.fn(() => ({
      mutate: jest.fn(),
      mutateAsync: jest.fn(),
      isPending: false,
    })),
    useMutationEffects: jest.fn(),
    toAttributeList: jest.fn((entries) => entries ?? []),
  }
})

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

describe('UserClaimsListPage', () => {
  it('renders the attribute list page with table headers', async () => {
    render(<UserClaimsListPage />, { wrapper: Wrapper })
    const inumElements = await screen.findAllByText(/inum/i)
    expect(inumElements.length).toBeGreaterThanOrEqual(1)
    const displayNameElements = screen.getAllByText(/Display Name/)
    expect(displayNameElements.length).toBeGreaterThanOrEqual(1)
    const statusElements = screen.getAllByText(/Status/)
    expect(statusElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders attribute data in the table', async () => {
    render(<UserClaimsListPage />, { wrapper: Wrapper })
    const inum = attributes[0].inum
    const displayName = attributes[0].displayName
    expect(await screen.findByText(inum)).toBeInTheDocument()
    expect(screen.getByText(displayName)).toBeInTheDocument()
  })

  it('renders the search toolbar', async () => {
    render(<UserClaimsListPage />, { wrapper: Wrapper })
    await screen.findByText(attributes[0].inum)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('renders add user claim button', async () => {
    render(<UserClaimsListPage />, { wrapper: Wrapper })
    await screen.findByText(attributes[0].inum)
    expect(screen.getByText(/Add User Claim/i)).toBeInTheDocument()
  })

  it('renders action icons for edit, view, and delete', async () => {
    render(<UserClaimsListPage />, { wrapper: Wrapper })
    await screen.findByText(attributes[0].inum)
    expect(screen.getAllByTestId('EditIcon')[0]).toBeInTheDocument()
    expect(screen.getAllByTestId('VisibilityOutlinedIcon')[0]).toBeInTheDocument()
    expect(screen.getAllByTestId('DeleteOutlinedIcon')[0]).toBeInTheDocument()
  })
})

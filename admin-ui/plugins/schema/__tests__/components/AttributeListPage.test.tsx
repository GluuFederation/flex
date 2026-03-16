import React from 'react'
import { render, screen } from '@testing-library/react'
import AttributeListPage from 'Plugins/schema/components/Person/AttributeListPage'
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
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Attributes: 'Attributes', Webhooks: 'webhooks' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Attributes: [], webhooks: [] },
}))

jest.mock('JansConfigApi', () => ({
  getGetAttributesQueryKey: jest.fn(() => ['attributes']),
}))

jest.mock('Plugins/schema/hooks', () => ({
  useAttributes: jest.fn(() => ({
    data: {
      entries: [
        {
          name: 'givenName',
          inum: 'B4B0',
          displayName: 'givenName',
          description: 'First Name',
          status: 'ACTIVE',
          dataType: 'STRING',
          editType: 'ADMIN',
          viewType: 'ADMIN',
          usageType: 'OPENID',
          jansHideOnDiscovery: false,
          oxMultiValuedAttribute: false,
          attributeValidation: { maxLength: null, regexp: null, minLength: null },
          scimCustomAttr: false,
        },
      ],
      totalEntriesCount: 1,
      entriesCount: 1,
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

describe('AttributeListPage', () => {
  it('renders the attribute list page with table headers', async () => {
    render(<AttributeListPage />, { wrapper: Wrapper })
    const inumElements = await screen.findAllByText(/inum/i)
    expect(inumElements.length).toBeGreaterThanOrEqual(1)
    const displayNameElements = screen.getAllByText(/Display Name/)
    expect(displayNameElements.length).toBeGreaterThanOrEqual(1)
    const statusElements = screen.getAllByText(/Status/)
    expect(statusElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders attribute data in the table', async () => {
    render(<AttributeListPage />, { wrapper: Wrapper })
    const inum = attributes[0].inum
    const displayName = attributes[0].displayName
    expect(await screen.findByText(inum)).toBeInTheDocument()
    expect(screen.getByText(displayName)).toBeInTheDocument()
  })

  it('renders the search toolbar', async () => {
    render(<AttributeListPage />, { wrapper: Wrapper })
    await screen.findByText(attributes[0].inum)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('renders add attribute button', async () => {
    render(<AttributeListPage />, { wrapper: Wrapper })
    await screen.findByText(attributes[0].inum)
    expect(screen.getByText(/Add Attribute/i)).toBeInTheDocument()
  })

  it('renders action icons for edit, view, and delete', async () => {
    render(<AttributeListPage />, { wrapper: Wrapper })
    await screen.findByText(attributes[0].inum)
    expect(document.querySelector('[data-testid="EditIcon"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="VisibilityOutlinedIcon"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="DeleteOutlinedIcon"]')).toBeInTheDocument()
  })
})

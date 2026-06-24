import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { usePermission } from '@/cedarling/hooks/usePermission'
import WebhookAddPage from 'Plugins/admin/components/Webhook/WebhookAddPage'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginListenersResolver', () => ({ __esModule: true, default: jest.fn() }))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
    isLoading: false,
    error: null,
  })),
  ADMIN_UI_RESOURCES: { Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Webhooks: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Webhooks: [] },
}))

jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: jest.fn(() => ({ canRead: true, canWrite: true, canDelete: true })),
}))

jest.mock('Plugins/admin/components/Webhook/WebhookForm', () => ({
  __esModule: true,
  default: () => <div data-testid="webhook-form">Webhook Form</div>,
}))

const createWebhookTestStore = (): Store =>
  configureStore({
    reducer: combineReducers({
      authReducer: (
        state = {
          permissions: [] as string[],
          config: { clientId: '' },
          location: { IPv4: '' },
          userinfo: null as { name: string; inum: string } | null,
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
      cedarPermissions: (state = { initialized: true }) => state,
      noReducer: (state = {}) => state,
    }),
  })

const createWebhookTestQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

const createWebhookTestWrapper = (store: Store, client: QueryClient) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <AppTestWrapper>
          <Provider store={store}>{children}</Provider>
        </AppTestWrapper>
      </QueryClientProvider>
    )
  }

const usePermissionMock = usePermission as jest.MockedFunction<typeof usePermission>

const renderPage = () => {
  const queryClient = createWebhookTestQueryClient()
  const store = createWebhookTestStore()
  const Wrapper = createWebhookTestWrapper(store, queryClient)
  return render(<WebhookAddPage />, { wrapper: Wrapper })
}

describe('WebhookAddPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    usePermissionMock.mockReturnValue({ canRead: true, canWrite: true, canDelete: true })
  })

  it('renders without crashing', () => {
    renderPage()
    expect(screen.getByTestId('webhook-form')).toBeInTheDocument()
  })

  it('renders the WebhookForm when the user can write', () => {
    renderPage()
    expect(screen.getByTestId('webhook-form')).toBeInTheDocument()
  })

  it('hides the WebhookForm when the user cannot write', () => {
    usePermissionMock.mockReturnValue({ canRead: true, canWrite: false, canDelete: false })
    renderPage()
    expect(screen.queryByTestId('webhook-form')).not.toBeInTheDocument()
  })
})

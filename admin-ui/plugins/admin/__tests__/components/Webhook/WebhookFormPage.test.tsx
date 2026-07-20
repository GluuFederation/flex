import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { ROUTES } from '@/helpers/navigation'
import WebhookFormPage from 'Plugins/admin/components/Webhook/WebhookFormPage'

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
  default: ({ viewOnly }: { viewOnly?: boolean }) => (
    <div data-testid="webhook-form" data-view-only={String(Boolean(viewOnly))}>
      Webhook Form
    </div>
  ),
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

const TEST_INUM = 'webhook-inum-1'

const renderPageAt = (path: string) => {
  window.history.pushState({}, '', path)
  const queryClient = createWebhookTestQueryClient()
  const store = createWebhookTestStore()
  const Wrapper = createWebhookTestWrapper(store, queryClient)
  return render(<WebhookFormPage />, { wrapper: Wrapper })
}

describe('WebhookFormPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    usePermissionMock.mockReturnValue({ canRead: true, canWrite: true, canDelete: true })
  })

  describe('add route', () => {
    it('renders an editable form when the user can write', () => {
      renderPageAt(ROUTES.WEBHOOK_ADD)
      expect(screen.getByTestId('webhook-form')).toHaveAttribute('data-view-only', 'false')
    })

    it('hides the form when the user cannot write', () => {
      usePermissionMock.mockReturnValue({ canRead: true, canWrite: false, canDelete: false })
      renderPageAt(ROUTES.WEBHOOK_ADD)
      expect(screen.queryByTestId('webhook-form')).not.toBeInTheDocument()
    })
  })

  describe('edit route', () => {
    it('renders an editable form when the user can write', () => {
      renderPageAt(ROUTES.WEBHOOK_EDIT(TEST_INUM))
      expect(screen.getByTestId('webhook-form')).toHaveAttribute('data-view-only', 'false')
    })

    it('falls back to a read-only form when the user cannot write', () => {
      usePermissionMock.mockReturnValue({ canRead: true, canWrite: false, canDelete: false })
      renderPageAt(ROUTES.WEBHOOK_EDIT(TEST_INUM))
      expect(screen.getByTestId('webhook-form')).toHaveAttribute('data-view-only', 'true')
    })
  })

  describe('view route', () => {
    it('renders a read-only form even when the user can write', () => {
      renderPageAt(ROUTES.WEBHOOK_VIEW(TEST_INUM))
      expect(screen.getByTestId('webhook-form')).toHaveAttribute('data-view-only', 'true')
    })

    it('hides the form when the user cannot read', () => {
      usePermissionMock.mockReturnValue({ canRead: false, canWrite: false, canDelete: false })
      renderPageAt(ROUTES.WEBHOOK_VIEW(TEST_INUM))
      expect(screen.queryByTestId('webhook-form')).not.toBeInTheDocument()
    })
  })
})

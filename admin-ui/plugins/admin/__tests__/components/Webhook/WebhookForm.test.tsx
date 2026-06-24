import React, { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { WebhookEntry } from 'Plugins/admin/components/Webhook/types'
import { useGetWebhook } from 'Plugins/admin/components/Webhook/hooks'
import { useParams } from 'react-router-dom'
import WebhookForm from 'Plugins/admin/components/Webhook/WebhookForm'

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({})),
}))

jest.mock('@/helpers/navigation', () => ({
  ...jest.requireActual('@/helpers/navigation'),
  useAppNavigation: jest.fn(() => ({ navigateBack: jest.fn() })),
}))

const mockCreateWebhook = jest.fn()
const mockUpdateWebhook = jest.fn()

jest.mock('Plugins/admin/components/Webhook/hooks', () => ({
  useGetWebhook: jest.fn(() => ({ webhook: undefined, isPending: false })),
  useCreateWebhookWithAudit: jest.fn(() => ({
    createWebhook: mockCreateWebhook,
    isLoading: false,
  })),
  useUpdateWebhookWithAudit: jest.fn(() => ({
    updateWebhook: mockUpdateWebhook,
    isLoading: false,
  })),
}))

jest.mock('JansConfigApi', () => {
  const mockAllFeatures = [
    { auiFeatureId: 'feature-1', displayName: 'Feature One' },
    { auiFeatureId: 'feature-2', displayName: 'Feature Two' },
  ]
  const mockEmptyList: never[] = []
  const mockEmptyPaged = { entries: mockEmptyList }
  return {
    useGetAllFeatures: jest.fn(() => ({
      data: mockAllFeatures,
      status: 'success',
      isFetching: false,
    })),
    useGetFeaturesByWebhookId: jest.fn(() => ({
      data: mockEmptyList,
      status: 'success',
      isFetching: false,
    })),
    useGetAllWebhooks: jest.fn(() => ({
      data: mockEmptyPaged,
      status: 'success',
      isFetching: false,
    })),
    useGetWebhooksByFeatureId: jest.fn(() => ({
      data: mockEmptyList,
      isLoading: false,
      isFetching: false,
      isFetched: true,
    })),
  }
})

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

const useGetWebhookMock = useGetWebhook as jest.MockedFunction<typeof useGetWebhook>
const useParamsMock = useParams as jest.MockedFunction<typeof useParams>

const mockWebhook: WebhookEntry = {
  inum: 'wh-123',
  dn: 'inum=wh-123,ou=webhooks',
  displayName: 'My Webhook',
  url: 'https://example.com/hook',
  httpMethod: 'GET',
  description: 'A test webhook',
  jansEnabled: true,
  httpHeaders: [],
  auiFeatureIds: ['feature-1'],
}

const renderForm = async () => {
  const queryClient = createWebhookTestQueryClient()
  const store = createWebhookTestStore()
  const Wrapper = createWebhookTestWrapper(store, queryClient)
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(<WebhookForm />, { wrapper: Wrapper })
  })
  await screen.findByTestId('displayName')
  return result!
}

describe('WebhookForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useParamsMock.mockReturnValue({})
    useGetWebhookMock.mockReturnValue({
      webhook: undefined,
      isPending: false,
    } as ReturnType<typeof useGetWebhook>)
  })

  describe('add mode (no id)', () => {
    it('renders without crashing and shows the name field', async () => {
      await renderForm()
      expect(screen.getByTestId('displayName')).toBeInTheDocument()
    })

    it('renders an empty name field', async () => {
      await renderForm()
      expect(screen.getByTestId('displayName')).toHaveValue('')
    })

    it('renders an empty url field', async () => {
      await renderForm()
      expect(screen.getByTestId('url')).toHaveValue('')
    })

    it('renders the http method select', async () => {
      await renderForm()
      expect(screen.getByTestId('httpMethod')).toBeInTheDocument()
    })

    it('renders the feature select with feature options', async () => {
      await renderForm()
      expect(screen.getByText('Feature One')).toBeInTheDocument()
      expect(screen.getByText('Feature Two')).toBeInTheDocument()
    })

    it('renders the footer Back, Cancel and Apply actions', async () => {
      await renderForm()
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })

    it('disables Cancel when the form is pristine', async () => {
      await renderForm()
      const cancelBtn = screen.getByText(/Cancel/i).closest('button')
      expect(cancelBtn).toBeDisabled()
    })

    it('allows typing in the name field', async () => {
      await renderForm()
      const nameInput = screen.getByTestId('displayName')
      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'New Hook' } })
      })
      expect(nameInput).toHaveValue('New Hook')
    })

    it('enables Cancel once the form becomes dirty', async () => {
      await renderForm()
      await act(async () => {
        fireEvent.change(screen.getByTestId('url'), {
          target: { value: 'https://changed.example.com' },
        })
      })
      await waitFor(() => {
        expect(screen.getByText(/Cancel/i).closest('button')).not.toBeDisabled()
      })
    })
  })

  describe('edit mode (with id)', () => {
    beforeEach(() => {
      useParamsMock.mockReturnValue({ id: 'wh-123' })
      useGetWebhookMock.mockReturnValue({
        webhook: mockWebhook,
        isPending: false,
      } as ReturnType<typeof useGetWebhook>)
    })

    it('populates the name field with the webhook display name', async () => {
      await renderForm()
      expect(screen.getByTestId('displayName')).toHaveValue('My Webhook')
    })

    it('populates the url field with the webhook url', async () => {
      await renderForm()
      expect(screen.getByTestId('url')).toHaveValue('https://example.com/hook')
    })

    it('populates the description field with the webhook description', async () => {
      await renderForm()
      expect(screen.getByTestId('description')).toHaveValue('A test webhook')
    })

    it('renders the enabled toggle as checked', async () => {
      await renderForm()
      const toggle = document.querySelector(
        'input#jansEnabled[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
    })
  })
})

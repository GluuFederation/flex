import React from 'react'
import { render, screen } from '@testing-library/react'
import UserClaimsAddPage from 'Plugins/user-claims/components/UserClaimsAddPage'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginSagasResolver', () => ({ __esModule: true, default: jest.fn(() => []) }))

jest.mock('@/cedarling', () => {
  const { ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES } = jest.requireActual('../cedarTestHelpers')
  return {
    useCedarling: jest.fn(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      hasCedarDeletePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
    })),
    ADMIN_UI_RESOURCES: ADMIN_UI_RESOURCES,
    CEDAR_RESOURCE_SCOPES: CEDAR_RESOURCE_SCOPES,
  }
})

jest.mock('@/cedarling/utility', () => {
  const { ADMIN_UI_RESOURCES } = jest.requireActual('../cedarTestHelpers')
  return { ADMIN_UI_RESOURCES: ADMIN_UI_RESOURCES }
})

jest.mock('@/cedarling/constants/resourceScopes', () => {
  const { CEDAR_RESOURCE_SCOPES } = jest.requireActual('../cedarTestHelpers')
  return { CEDAR_RESOURCE_SCOPES: CEDAR_RESOURCE_SCOPES }
})

jest.mock('Plugins/user-claims/hooks', () => ({
  useCreateAttribute: jest.fn(() => ({
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

describe('UserClaimsAddPage', () => {
  it('renders the form with empty Name and Description inputs', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    const nameInput = await screen.findByTestId('name')
    expect(nameInput).toHaveValue('')
    const descInput = screen.getByTestId('description')
    expect(descInput).toHaveValue('')
  })

  it('renders Status select with options', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    await screen.findByText(/Status/)
    const statusSelect = screen.getByTestId('status') as HTMLSelectElement
    expect(statusSelect).not.toBeDisabled()
  })

  it('renders Data Type select', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    await screen.findByText(/Data Type/)
    const dataTypeSelect = screen.getByTestId('dataType') as HTMLSelectElement
    expect(dataTypeSelect).not.toBeDisabled()
  })

  it('renders Edit Type and View Type multi-select fields', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Edit Type/)).toBeInTheDocument()
    expect(screen.getByText(/View Type/)).toBeInTheDocument()
  })

  it('renders Usage Type multi-select field', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Usage Type/)).toBeInTheDocument()
  })

  it('renders toggle fields for Multivalued and Hide On Discovery', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Multivalued/)).toBeInTheDocument()
    expect(screen.getByText(/Hide On Discovery/)).toBeInTheDocument()
  })

  it('renders Include In SCIM Extension toggle', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Include In SCIM Extension/)).toBeInTheDocument()
  })

  it('renders Enable Custom Validation toggle', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Enable custom validation/i)).toBeInTheDocument()
  })

  it('does not render inum field for new attribute', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    await screen.findByTestId('name')
    expect(screen.queryByTestId('inum')).not.toBeInTheDocument()
  })

  it('renders footer with Back and Cancel buttons', async () => {
    render(<UserClaimsAddPage />, { wrapper: Wrapper })
    await screen.findByTestId('name')
    expect(screen.getByText(/Back/i)).toBeInTheDocument()
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
  })
})

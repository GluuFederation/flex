import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { CustomScript } from 'JansConfigApi'

const mockScripts: CustomScript[] = [
  {
    name: 'basic',
    scriptType: 'person_authentication',
    programmingLanguage: 'python',
    level: 10,
    dn: 'inum=A51E-76DA,ou=scripts,o=jans',
    inum: 'A51E-76DA',
    description: 'Sample authentication module',
    revision: 1,
    enabled: true,
    internal: false,
  },
  {
    name: 'introspection_script',
    scriptType: 'introspection',
    programmingLanguage: 'java',
    level: 1,
    dn: 'inum=B72F-91AB,ou=scripts,o=jans',
    inum: 'B72F-91AB',
    description: 'Introspection sample',
    revision: 2,
    enabled: false,
    internal: false,
  },
]

const mockNavigateToRoute = jest.fn()
const mockDeleteMutateAsync = jest.fn()

const mockUseCustomScriptsByType = jest.fn(() => ({
  data: {
    entries: mockScripts,
    totalEntriesCount: mockScripts.length,
  },
  isLoading: false,
  refetch: jest.fn(),
}))

jest.mock('Plugins/scripts/components/hooks', () => ({
  useCustomScriptsByType: () => mockUseCustomScriptsByType(),
  useCustomScriptTypes: jest.fn(() => ({
    data: [
      { value: 'person_authentication', name: 'Person Authentication' },
      { value: 'introspection', name: 'Introspection' },
    ],
    isLoading: false,
  })),
  useDeleteCustomScript: jest.fn(() => ({
    mutateAsync: mockDeleteMutateAsync,
    isPending: false,
  })),
}))

jest.mock('@/helpers/navigation', () => ({
  ...jest.requireActual('@/helpers/navigation'),
  useAppNavigation: () => ({ navigateToRoute: mockNavigateToRoute }),
}))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Scripts: 'Scripts', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Scripts: [], Webhooks: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Scripts: 'Scripts', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Scripts: [], Webhooks: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetWebhooksByFeatureId: jest.fn(() => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isFetched: true,
  })),
}))

import CustomScriptListPage from 'Plugins/scripts/components/CustomScriptListPage'

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

describe('CustomScriptListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCustomScriptsByType.mockReturnValue({
      data: {
        entries: mockScripts,
        totalEntriesCount: mockScripts.length,
      },
      isLoading: false,
      refetch: jest.fn(),
    })
  })

  it('renders without crashing and shows script rows', async () => {
    render(<CustomScriptListPage />, { wrapper: Wrapper })
    expect(await screen.findByText('basic')).toBeInTheDocument()
    expect(screen.getByText('introspection_script')).toBeInTheDocument()
  })

  it('renders the column headers', async () => {
    render(<CustomScriptListPage />, { wrapper: Wrapper })
    await screen.findByText('basic')
    expect(screen.getAllByText(/inum/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Name/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Description/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Enabled/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders the script descriptions', async () => {
    render(<CustomScriptListPage />, { wrapper: Wrapper })
    expect(await screen.findByText('Sample authentication module')).toBeInTheDocument()
  })

  it('renders the search toolbar with placeholder', async () => {
    render(<CustomScriptListPage />, { wrapper: Wrapper })
    await screen.findByText('basic')
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('renders the add script button', async () => {
    render(<CustomScriptListPage />, { wrapper: Wrapper })
    await screen.findByText('basic')
    expect(screen.getByText(/Add Custom Script/i)).toBeInTheDocument()
  })

  it('renders action icons for edit, view, and delete', async () => {
    render(<CustomScriptListPage />, { wrapper: Wrapper })
    await screen.findByText('basic')
    expect(screen.getAllByTestId('EditIcon')[0]).toBeInTheDocument()
    expect(screen.getAllByTestId('VisibilityOutlinedIcon')[0]).toBeInTheDocument()
    expect(screen.getAllByTestId('DeleteOutlinedIcon')[0]).toBeInTheDocument()
  })

  it('navigates to add page when the add button is clicked', async () => {
    render(<CustomScriptListPage />, { wrapper: Wrapper })
    await screen.findByText('basic')
    fireEvent.click(screen.getByText(/Add Custom Script/i))
    await waitFor(() => {
      expect(mockNavigateToRoute).toHaveBeenCalled()
    })
  })

  it('renders the empty state when there are no scripts', async () => {
    mockUseCustomScriptsByType.mockReturnValue({
      data: { entries: [], totalEntriesCount: 0 },
      isLoading: false,
      refetch: jest.fn(),
    })
    render(<CustomScriptListPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/no scripts found/i)).toBeInTheDocument()
  })
})

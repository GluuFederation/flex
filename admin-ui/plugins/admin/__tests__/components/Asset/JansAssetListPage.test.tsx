import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JansAssetListPage from 'Plugins/admin/components/Assets/JansAssetListPage'
import { useCedarling } from '@/cedarling'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginSagasResolver', () => ({ __esModule: true, default: jest.fn(() => []) }))

jest.mock('@/cedarling', () => {
  const { SHARED_CEDAR_CONSTANTS } = jest.requireActual('./assetCedarTestConstants')
  return {
    useCedarling: jest.fn(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      hasCedarDeletePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
      authorize: jest.fn(),
      isLoading: false,
      error: null,
    })),
    ADMIN_UI_RESOURCES: SHARED_CEDAR_CONSTANTS.ADMIN_UI_RESOURCES,
    CEDAR_RESOURCE_SCOPES: SHARED_CEDAR_CONSTANTS.CEDAR_RESOURCE_SCOPES,
  }
})

jest.mock('@/cedarling/utility', () => {
  const { SHARED_CEDAR_CONSTANTS } = jest.requireActual('./assetCedarTestConstants')
  return { ADMIN_UI_RESOURCES: SHARED_CEDAR_CONSTANTS.ADMIN_UI_RESOURCES }
})

jest.mock('@/cedarling/constants/resourceScopes', () => {
  const { SHARED_CEDAR_CONSTANTS } = jest.requireActual('./assetCedarTestConstants')
  return { CEDAR_RESOURCE_SCOPES: SHARED_CEDAR_CONSTANTS.CEDAR_RESOURCE_SCOPES }
})

jest.mock('JansConfigApi', () => ({
  useGetAllAssets: jest.fn(() => ({
    data: { entries: [], totalEntriesCount: 0 },
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
  })),
  getGetAllAssetsQueryKey: jest.fn(() => ['assets']),
  useGetWebhooksByFeatureId: jest.fn(() => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isFetched: true,
  })),
}))

jest.mock('Plugins/admin/components/Assets/hooks', () => ({
  useDeleteAssetWithAudit: jest.fn(() => ({
    deleteAsset: jest.fn(),
    isLoading: false,
  })),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    assetReducer: (
      state = {
        assets: [],
        services: [],
        fileTypes: [],
        loading: false,
        saveOperationFlag: false,
        errorInSaveOperationFlag: false,
        totalItems: 0,
        entriesCount: 0,
        selectedAsset: {},
        loadingAssets: false,
        assetModal: false,
        showErrorModal: false,
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
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('JansAssetListPage', () => {
  it('renders the asset list page with search', () => {
    render(<JansAssetListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Assets/i)).toBeInTheDocument()
  })

  it('renders Add Jans Asset button when user has write permission', () => {
    render(<JansAssetListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Add Jans Asset/i)).toBeInTheDocument()
  })

  it('does not render Add Jans Asset button when user lacks write permission', () => {
    jest.mocked(useCedarling).mockReturnValue({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => false),
      hasCedarDeletePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
      authorize: jest.fn(),
      isLoading: false,
      error: null,
    })
    render(<JansAssetListPage />, { wrapper: Wrapper })
    expect(screen.queryByText(/Add Jans Asset/i)).not.toBeInTheDocument()
  })

  afterEach(() => {
    jest.mocked(useCedarling).mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      hasCedarDeletePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
      authorize: jest.fn(),
      isLoading: false,
      error: null,
    }))
  })
})

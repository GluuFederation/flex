import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JansAssetEditPage from 'Plugins/admin/components/Assets/JansAssetEditPage'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ id: 'test-inum-123' })),
}))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Assets: 'assets' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { assets: [] },
}))

jest.mock('Plugins/admin/components/Assets/hooks', () => ({
  useAssetServices: jest.fn(() => ({ data: ['service1', 'service2'], isLoading: false })),
}))

jest.mock('JansConfigApi', () => ({
  getGetAllAssetsQueryKey: jest.fn(() => ['assets']),
}))

const assetReducerState = {
  assets: [],
  services: [],
  fileTypes: [],
  loading: false,
  saveOperationFlag: false,
  errorInSaveOperationFlag: false,
  totalItems: 0,
  entriesCount: 0,
  selectedAsset: {
    inum: 'test-inum-123',
    fileName: 'test-asset',
    description: 'Test asset description',
    service: 'test-service',
    enabled: true,
  },
  loadingAssets: false,
  assetModal: false,
  showErrorModal: false,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    assetReducer: (state = assetReducerState) => state,
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

describe('JansAssetEditPage', () => {
  it('renders the asset edit page with form fields', async () => {
    render(<JansAssetEditPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Name/i)).toBeInTheDocument()
    expect(screen.getByText(/Description/i)).toBeInTheDocument()
  })
})

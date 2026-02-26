import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import JansAssetAddPage from 'Plugins/admin/components/Assets/JansAssetAddPage'

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

describe('JansAssetAddPage', () => {
  it('renders the asset add page with form fields', async () => {
    render(<JansAssetAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Name/i)).toBeInTheDocument()
    expect(screen.getByText(/Description/i)).toBeInTheDocument()
  })
})

import React from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
    authorize: jest.fn(),
    isLoading: false,
    error: null,
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

const defaultAssetReducerState = {
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
}

const defaultWebhookReducerState = {
  featureWebhooks: [],
  loadingWebhooks: false,
  webhookModal: false,
  triggerWebhookInProgress: false,
}

export function createAssetTestStore(assetReducerState = defaultAssetReducerState): Store {
  return configureStore({
    reducer: combineReducers({
      authReducer: (state = { permissions: [] }) => state,
      assetReducer: (state = assetReducerState) => state,
      webhookReducer: (state = defaultWebhookReducerState) => state,
      noReducer: (state = {}) => state,
    }),
  })
}

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

export function createAssetTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

export function createAssetTestWrapper(store: Store, client?: QueryClient) {
  const queryClientToUse = client ?? queryClient
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClientToUse}>
        <AppTestWrapper>
          <Provider store={store}>{children}</Provider>
        </AppTestWrapper>
      </QueryClientProvider>
    )
  }
}

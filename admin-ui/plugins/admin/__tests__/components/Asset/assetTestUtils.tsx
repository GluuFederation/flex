import React from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

import { SHARED_CEDAR_CONSTANTS as mockSHARED_CEDAR_CONSTANTS } from './assetCedarTestConstants'
export { SHARED_CEDAR_CONSTANTS } from './assetCedarTestConstants'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginSagasResolver', () => ({ __esModule: true, default: jest.fn(() => []) }))

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
  ADMIN_UI_RESOURCES: mockSHARED_CEDAR_CONSTANTS.ADMIN_UI_RESOURCES,
  CEDAR_RESOURCE_SCOPES: mockSHARED_CEDAR_CONSTANTS.CEDAR_RESOURCE_SCOPES,
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: mockSHARED_CEDAR_CONSTANTS.ADMIN_UI_RESOURCES,
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: mockSHARED_CEDAR_CONSTANTS.CEDAR_RESOURCE_SCOPES,
}))

jest.mock('Plugins/admin/components/Assets/hooks', () => ({
  useAssetServices: jest.fn(() => ({ data: ['service1', 'service2'], isLoading: false })),
}))

jest.mock('JansConfigApi', () => ({
  getGetAllAssetsQueryKey: jest.fn(() => ['assets']),
  useGetWebhooksByFeatureId: jest.fn(() => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isFetched: true,
  })),
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

const defaultAuthReducerState = {
  permissions: [] as string[],
  config: { clientId: '' },
  location: { IPv4: '' },
  userinfo: null as { name: string; inum: string } | null,
}

export function createAssetTestStore(assetReducerState = defaultAssetReducerState): Store {
  return configureStore({
    reducer: combineReducers({
      authReducer: (state = defaultAuthReducerState) => state,
      assetReducer: (state = assetReducerState) => state,
      webhookReducer: (state = defaultWebhookReducerState) => state,
      noReducer: (state = {}) => state,
    }),
  })
}

export function createAssetTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

export function createAssetTestWrapper(store: Store, client?: QueryClient) {
  const queryClientToUse = client ?? createAssetTestQueryClient()
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

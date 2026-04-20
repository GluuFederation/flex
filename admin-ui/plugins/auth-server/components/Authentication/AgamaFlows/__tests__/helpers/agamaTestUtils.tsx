import React from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { AuthState } from 'Redux/features/types/authTypes'
import { mockDeployments } from '../fixtures/mockAgamaProjects'

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
  ADMIN_UI_RESOURCES: {
    Authentication: 'Authentication',
  },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    Authentication: 'Authentication',
  },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Authentication: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetAgamaPrj: jest.fn(() => ({
    data: { entries: mockDeployments, totalEntriesCount: mockDeployments.length },
    isLoading: false,
  })),
  useDeleteAgamaPrj: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  getGetAgamaPrjQueryKey: jest.fn(() => ['/api/v1/agama-deployment']),
  useGetAgamaRepositories: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    refetch: jest.fn(),
  })),
  useGetAgamaPrjByName: jest.fn(() => ({
    data: undefined,
    isLoading: false,
  })),
  useGetAgamaPrjConfigs: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    refetch: jest.fn(),
  })),
  usePutAgamaPrj: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
}))

jest.mock('../../hooks/useAgamaActions', () => ({
  useAgamaActions: jest.fn(() => ({
    logAgamaCreation: jest.fn(),
    logAgamaUpdate: jest.fn(),
    logAgamaDeletion: jest.fn(),
    logAcrMappingUpdate: jest.fn(),
  })),
}))

jest.mock('Plugins/auth-server/hooks/useAuthServerJsonProperties', () => ({
  useAuthServerJsonPropertiesQuery: jest.fn(() => ({
    data: { agamaConfiguration: { enabled: true }, acrMappings: {} },
    isLoading: false,
    isFetching: false,
  })),
  usePatchAuthServerJsonPropertiesMutation: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
}))

jest.mock('../../../../../../../api-client', () => ({
  AXIOS_INSTANCE: {
    post: jest.fn().mockResolvedValue({ data: 'success' }),
    get: jest.fn().mockResolvedValue({ data: '' }),
  },
}))

type WebhookRecord = Record<string, string>

const defaultWebhookReducerState = {
  loadingWebhooks: false,
  featureWebhooks: [] as WebhookRecord[],
  webhookModal: false,
  triggerWebhookInProgress: false,
  triggerWebhookMessage: '',
  webhookTriggerErrors: [] as WebhookRecord[],
  triggerPayload: {
    feature: '',
    payload: {} as WebhookRecord,
  },
  featureToTrigger: '',
  showErrorModal: false,
}

const defaultAuthReducerState: AuthState = {
  isAuthenticated: false,
  userinfo: { inum: 'test-inum', name: 'Test User' },
  userinfo_jwt: null,
  idToken: null,
  jwtToken: null,
  issuer: null,
  permissions: [],
  location: { IPv4: '' },
  config: { clientId: '' },
  codeChallenge: null,
  codeChallengeMethod: 'S256',
  codeVerifier: null,
  backendStatus: {
    active: true,
    errorMessage: null,
    statusCode: null,
  },
  loadingConfig: false,
  authState: undefined,
  userInum: null,
  isUserInfoFetched: false,
  hasSession: false,
}

export const createAgamaTestStore = (): Store =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = defaultAuthReducerState) => state,
      webhookReducer: (state = defaultWebhookReducerState) => state,
    }),
  })

export const createAgamaQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

export const createAgamaTestWrapper = (
  store: Store,
  client?: QueryClient,
): ((props: { children: React.ReactNode }) => JSX.Element) => {
  const queryClientToUse = client ?? createAgamaQueryClient()
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClientToUse}>
      <AppTestWrapper>
        <Provider store={store}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
  Wrapper.displayName = 'AgamaTestWrapper'
  return Wrapper
}

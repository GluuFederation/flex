import React from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { AuthState } from 'Redux/features/types/authTypes'
import { mockAcrs, mockLdapConfigurations, mockScripts } from '../fixtures/mockAuthenticationData'

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
  useGetAcrs: jest.fn(() => ({
    data: mockAcrs,
    isLoading: false,
    error: null,
  })),
  useGetAgamaPrj: jest.fn(() => ({
    data: { entries: [], totalEntriesCount: 0 },
    isLoading: false,
    error: null,
  })),
  usePutAcrs: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  getGetAcrsQueryKey: jest.fn(() => ['/api/v1/acrs']),
  useGetConfigDatabaseLdap: jest.fn(() => ({
    data: mockLdapConfigurations,
    isLoading: false,
  })),
  usePutConfigDatabaseLdap: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  usePutConfigScripts: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useGetWebhooksByFeatureId: jest.fn(() => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isFetched: true,
  })),
}))

jest.mock('../../Acrs/hooks', () => ({
  useAcrAudit: jest.fn(() => ({
    logAcrUpdate: jest.fn(),
  })),
}))

jest.mock('Plugins/scripts/components/hooks', () => ({
  useCustomScriptsByType: jest.fn(() => ({
    data: { entries: mockScripts },
    isLoading: false,
  })),
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: jest.fn(() => ({
    navigateToRoute: jest.fn(),
  })),
  ROUTES: {
    AUTH_SERVER_AUTHN: '/auth-server/authn',
    AUTH_SERVER_AUTHN_EDIT: jest.fn((id: string) => `/auth-server/authn/edit/${id}`),
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

export const createAuthenticationTestStore = (): Store =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = defaultAuthReducerState) => state,
      webhookReducer: (state = defaultWebhookReducerState) => state,
    }),
  })

export const createAuthenticationQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

export const createAuthenticationTestWrapper = (
  store: Store,
  client?: QueryClient,
): ((props: { children: React.ReactNode }) => JSX.Element) => {
  const queryClientToUse = client ?? createAuthenticationQueryClient()
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClientToUse}>
      <AppTestWrapper>
        <Provider store={store}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
  Wrapper.displayName = 'AuthenticationTestWrapper'
  return Wrapper
}

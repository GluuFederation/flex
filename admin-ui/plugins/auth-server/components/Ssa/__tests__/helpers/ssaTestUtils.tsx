import React from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { AuthState } from 'Redux/features/types/authTypes'

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
    SSA: 'SSA',
  },
  CEDAR_RESOURCE_SCOPES: { SSA: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    SSA: 'SSA',
  },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { SSA: [] },
}))

jest.mock('JansConfigApi', () => ({
  useRevokeSsa: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useGetProperties: jest.fn(() => ({
    data: {
      ssaConfiguration: {
        ssaCustomAttributes: ['customAttr1', 'customAttr2'],
        ssaMapSoftwareRolesToScopes: { role1: ['scope1'], role2: ['scope2'] },
      },
    },
    isLoading: false,
  })),
  useGetWebhooksByFeatureId: jest.fn(() => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isFetched: true,
  })),
}))

jest.mock('../../hooks/useSsaApi', () => ({
  useGetAllSsas: jest.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useCreateSsa: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
    isSuccess: false,
  })),
  useGetSsaJwt: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  SSA_QUERY_KEYS: {
    all: ['ssas'],
    detail: (jti: string) => ['ssas', jti],
  },
}))

jest.mock('../../hooks/useSsaMutations', () => ({
  useRevokeSsaWithAudit: jest.fn(() => ({
    revokeSsa: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
  })),
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
  userinfo: null,
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

export const createSsaTestStore = (): Store =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = defaultAuthReducerState) => state,
      webhookReducer: (state = defaultWebhookReducerState) => state,
    }),
  })

export const createSsaQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

export const createSsaTestWrapper = (
  store: Store,
  client?: QueryClient,
): ((props: { children: React.ReactNode }) => JSX.Element) => {
  const queryClientToUse = client ?? createSsaQueryClient()
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClientToUse}>
      <AppTestWrapper>
        <Provider store={store}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
  Wrapper.displayName = 'SsaTestWrapper'
  return Wrapper
}

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
    Users: 'users',
    Lock: 'lock',
    Attributes: 'attributes',
    Webhooks: 'webhooks',
  },
  CEDAR_RESOURCE_SCOPES: { users: [], lock: [], attributes: [], webhooks: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    Users: 'users',
    Lock: 'lock',
    Attributes: 'attributes',
    Webhooks: 'webhooks',
  },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { users: [], lock: [], attributes: [], webhooks: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetUser: jest.fn(() => ({
    data: { entries: [], totalEntriesCount: 0 },
    isLoading: false,
    refetch: jest.fn(),
  })),
  getGetUserQueryKey: jest.fn(() => ['users']),
  useGetAttributes: jest.fn(() => ({ data: { entries: [] }, isLoading: false })),
  usePostUser: jest.fn(() => ({ mutate: jest.fn(), mutateAsync: jest.fn(), isPending: false })),
  usePutUser: jest.fn(() => ({ mutateAsync: jest.fn(), isPending: false })),
  useGetPropertiesPersistence: jest.fn(() => ({
    data: { persistenceType: 'ldap' },
    isLoading: false,
    isError: false,
  })),
  useRevokeUserSession: jest.fn(() => ({ mutateAsync: jest.fn() })),
  useGetAllAdminuiRoles: jest.fn(() => ({ data: [], isLoading: false, isError: false })),
  useGetRegistrationEntriesFido2: jest.fn(() => ({
    data: { entries: [] },
    refetch: jest.fn(),
    isLoading: false,
  })),
  useDeleteFido2Data: jest.fn(() => ({ mutateAsync: jest.fn() })),
  usePatchUserByInum: jest.fn(() => ({ mutateAsync: jest.fn(), isPending: false })),
  useGetWebhooksByFeatureId: jest.fn(() => ({
    data: [],
    isLoading: false,
    isFetching: false,
    isFetched: true,
  })),
}))

jest.mock('Plugins/user-management/hooks/useUserMutations', () => ({
  useDeleteUserWithAudit: jest.fn(() => ({
    deleteUser: jest.fn(),
    isLoading: false,
  })),
}))

const defaultWebhookReducerState = {
  loadingWebhooks: false,
  featureWebhooks: [] as unknown[],
  webhookModal: false,
  triggerWebhookInProgress: false,
  triggerWebhookMessage: '',
  webhookTriggerErrors: [] as unknown[],
  triggerPayload: {
    feature: null as string | null,
    payload: null as unknown,
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

export function createUserManagementTestStore(): Store {
  return configureStore({
    reducer: combineReducers({
      authReducer: (state = defaultAuthReducerState) => state,
      webhookReducer: (state = defaultWebhookReducerState) => state,
    }),
  })
}

export function createUserManagementQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

export function createUserManagementTestWrapper(
  store: Store,
  client?: QueryClient,
): (props: { children: React.ReactNode }) => JSX.Element {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    const queryClientToUse = React.useMemo(
      () => client ?? createUserManagementQueryClient(),
      [client],
    )
    return (
      <QueryClientProvider client={queryClientToUse}>
        <AppTestWrapper>
          <Provider store={store}>{children}</Provider>
        </AppTestWrapper>
      </QueryClientProvider>
    )
  }
}

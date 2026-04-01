import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import AuthServerPropertiesPage from './AuthServerPropertiesPage'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mockAuthServerJsonProperties as config } from './__tests__/authServerPropertiesTestData'

jest.mock('Routes/Apps/Gluu/GluuCommitDialog', () => ({
  __esModule: true,
  default: () => null,
}))

jest.mock('JansConfigApi', () => ({
  useGetAcrs: () => ({ data: { defaultAcr: 'simple' }, isLoading: false }),
  usePutAcrs: () => ({ mutateAsync: jest.fn(), isPending: false }),
  getGetAcrsQueryKey: () => ['acrs'],
}))

jest.mock('Plugins/auth-server/services/jsonPropertiesService', () => {
  const { mockAuthServerJsonProperties } = jest.requireActual<
    typeof import('./__tests__/authServerPropertiesTestData')
  >('./__tests__/authServerPropertiesTestData')
  return {
    fetchAuthServerJsonProperties: jest.fn(() => Promise.resolve(mockAuthServerJsonProperties)),
    patchAuthServerJsonProperties: jest.fn(),
  }
})

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: {
    AuthenticationServerConfiguration: 'AuthenticationServerConfiguration',
  },
  CEDAR_RESOURCE_SCOPES: { AuthenticationServerConfiguration: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    AuthenticationServerConfiguration: 'AuthenticationServerConfiguration',
  },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { AuthenticationServerConfiguration: [] },
}))

jest.mock('../AuthN/hooks', () => ({
  useAcrAudit: () => ({
    logAcrUpdate: jest.fn().mockResolvedValue(undefined),
  }),
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateBack: jest.fn() }),
  ROUTES: { HOME_DASHBOARD: '/home' },
}))

const clientPermissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]

const ACER_STATE = {
  acrReponse: {},
}

const SCRIPTS_STATE = {
  scripts: [],
}

const INIT_STATE = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  token: null,
  issuer: null,
  permissions: clientPermissions,
  location: {},
  config: {},
  backendIsUp: true,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    noReducer: (state = {}) => state,
    acrReducer: (state = ACER_STATE) => state,
    initReducer: (state = SCRIPTS_STATE) => state,
    cedarPermissions: (
      state = { permissions: {}, loading: false, error: null, initialized: true },
    ) => state,
    webhookReducer: (state = { loadingWebhooks: false, webhookModal: false }) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const Wrapper = ({ children }: React.PropsWithChildren) => (
  <AppTestWrapper>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  </AppTestWrapper>
)

it('Should render json properties page properly', async () => {
  render(<AuthServerPropertiesPage />, {
    wrapper: Wrapper,
  })
  await waitFor(() => {
    expect(screen.getByTestId('issuer')).toHaveValue(config.issuer)
  })
  expect(screen.getByTestId('baseEndpoint')).toHaveValue(config.baseEndpoint)
  expect(screen.getByTestId('authorizationEndpoint')).toHaveValue(config.authorizationEndpoint)
})

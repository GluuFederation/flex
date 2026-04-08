import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeAddPage from 'Plugins/auth-server/components/Scopes/ScopeAddPage'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock orval hooks
jest.mock('JansConfigApi', () => ({
  usePostOauthScopes: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  })),
  useGetAttributes: jest.fn(() => ({
    data: { entries: [] },
    isLoading: false,
  })),
  useGetConfigScripts: jest.fn(() => ({
    data: { entries: [] },
    isLoading: false,
  })),
  useGetWebhooksByFeatureId: jest.fn(() => ({
    data: [],
    isLoading: false,
  })),
  getGetOauthScopesQueryKey: jest.fn(() => ['/api/v1/oauth/scopes']),
}))

// Mock audit logger
jest.mock('Plugins/auth-server/components/Scopes/hooks/useScopeActions', () => ({
  useScopeActions: jest.fn(() => ({
    logScopeCreation: jest.fn(),
    navigateToScopeList: jest.fn(),
    navigateToScopeAdd: jest.fn(),
    navigateToScopeEdit: jest.fn(),
  })),
}))

const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const INIT_STATE = {
  permissions: permissions,
  userinfo: { inum: 'test-user-inum' },
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    cedarPermissions: (
      state = {
        permissions: {},
        loading: false,
        error: null,
        initialized: false,
        isInitializing: false,
      },
    ) => state,
    webhookReducer: (state = { webhookModal: false }) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

it('Should render the scope add page properly', () => {
  render(<ScopeAddPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Default Scope/)
})

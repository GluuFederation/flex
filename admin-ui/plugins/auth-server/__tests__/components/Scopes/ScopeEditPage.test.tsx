import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeEditPage from 'Plugins/auth-server/components/Scopes/ScopeEditPage'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock orval hooks
jest.mock('JansConfigApi', () => {
  const mockScopes = require('../../fixtures/mockScopes').default
  return {
    useGetOauthScopesByInum: jest.fn(() => ({
      data: mockScopes[0],
      isLoading: false,
    })),
    usePutOauthScopes: jest.fn(() => ({
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
  }
})

// Mock audit logger
jest.mock('Plugins/auth-server/components/Scopes/hooks/useScopeActions', () => ({
  useScopeActions: jest.fn(() => ({
    logScopeUpdate: jest.fn(),
    navigateToScopeList: jest.fn(),
    navigateToScopeAdd: jest.fn(),
    navigateToScopeEdit: jest.fn(),
  })),
}))

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: ':test-inum' }),
}))

const permissions = [
  'https://jans.io/oauth/config/scopes.readonly',
  'https://jans.io/oauth/config/scopes.write',
  'https://jans.io/oauth/config/scopes.delete',
]
const INIT_STATE = {
  permissions: permissions,
  userinfo: { inum: 'test-user-inum' },
}

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

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>
        <Provider store={store}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
}

it('Should render the scope edit page properly', () => {
  render(<ScopeEditPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Default Scope/)
})

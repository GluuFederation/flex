import React from 'react'
import { render, screen, within } from '@testing-library/react'
import ScopeListPage from 'Plugins/auth-server/components/Scopes/ScopeListPage'
import { Provider } from 'react-redux'
import scopes from '../../fixtures/mockScopes'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Scope } from 'Plugins/auth-server/components/Scopes/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginSagasResolver', () => ({ __esModule: true, default: jest.fn(() => []) }))

// Mock orval hooks
jest.mock('JansConfigApi', () => {
  const mockScopes = require('../../fixtures/mockScopes').default
  return {
    useGetOauthScopes: jest.fn(() => ({
      data: {
        entries: [mockScopes[0]],
        totalEntriesCount: 1,
      },
      isLoading: false,
      refetch: jest.fn(),
    })),
    useDeleteOauthScopesByInum: jest.fn(() => ({
      mutateAsync: jest.fn(),
    })),
    useGetWebhooksByFeatureId: jest.fn(() => ({
      data: [],
      isLoading: false,
    })),
  }
})

// Mock cedarling permissions
jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    checkPermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
    loading: false,
    error: null,
    initialized: true,
  })),
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: {},
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    Scopes: 'scopes',
    Webhooks: 'webhooks',
  },
}))

jest.mock('@/cedarling/hooks/useCedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    checkPermission: jest.fn(() => true),
    loading: false,
    error: null,
    initialized: true,
  })),
}))

// Mock audit logger — partial mock so useScopes and invalidateScopeQueries
// keep their real implementations while only useScopeActions is stubbed.
jest.mock('Plugins/auth-server/components/Scopes/hooks', () => ({
  ...jest.requireActual('Plugins/auth-server/components/Scopes/hooks'),
  useScopeActions: jest.fn(() => ({
    logScopeDeletion: jest.fn(),
    navigateToScopeList: jest.fn(),
    navigateToScopeAdd: jest.fn(),
    navigateToScopeEdit: jest.fn(),
  })),
}))

const permissions = [
  'https://jans.io/oauth/config/scopes.readonly',
  'https://jans.io/oauth/config/scopes.write',
  'https://jans.io/oauth/config/scopes.delete',
]
const INIT_STATE = {
  permissions: permissions,
}

const INIT_CEDAR_STATE = {
  permissions: permissions,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    cedarPermissions: (state = INIT_CEDAR_STATE) => state,
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

it('Should render the scope list page properly', () => {
  const { container } = render(<ScopeListPage />, {
    wrapper: Wrapper,
  })
  const scope = scopes[0] as Scope
  const id = scope.id
  const description = scope.description

  expect(screen.getByText('Description', { exact: false })).toBeInTheDocument()
  expect(screen.getByText('Clients', { exact: false })).toBeInTheDocument()
  expect(screen.getByPlaceholderText('search', { exact: false })).toBeInTheDocument()
  if (id) {
    expect(within(container).getAllByText(id).length).toBeGreaterThan(0)
  }
  if (description) {
    expect(screen.getByText(description)).toBeInTheDocument()
  }
})

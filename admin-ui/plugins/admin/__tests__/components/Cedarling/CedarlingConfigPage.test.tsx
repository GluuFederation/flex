import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CedarlingConfigPage from 'Plugins/admin/components/Cedarling/CedarlingConfigPage'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Security: 'security' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { security: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetAdminuiConf: jest.fn(() => ({
    data: {
      auiPolicyStoreUrl: 'https://example.com/policy',
      cedarlingPolicyStoreRetrievalPoint: 'remote',
    },
    isSuccess: true,
    isFetching: false,
  })),
  useEditAdminuiConf: jest.fn(() => ({ mutateAsync: jest.fn() })),
  useSyncRoleToScopesMappings: jest.fn(() => ({ mutateAsync: jest.fn() })),
  useSetRemotePolicyStoreAsDefault: jest.fn(() => ({ mutateAsync: jest.fn() })),
  getGetAdminuiConfQueryKey: jest.fn(() => ['adminuiConf']),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { userinfo: { name: 'Test' }, config: { clientId: '123' } }) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('CedarlingConfigPage', () => {
  it('renders the cedarling configuration page', async () => {
    render(<CedarlingConfigPage />, { wrapper: Wrapper })
    const policyStoreElements = await screen.findAllByText(/Policy Store/i)
    expect(policyStoreElements.length).toBeGreaterThan(0)
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CedarlingConfigPage from 'Plugins/admin/components/Cedarling/CedarlingConfigPage'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginSagasResolver', () => ({ __esModule: true, default: jest.fn(() => []) }))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: {
    Security: 'Security',
    Webhooks: 'Webhooks',
    Lock: 'Lock',
    Users: 'Users',
    Attributes: 'Attributes',
  },
  CEDAR_RESOURCE_SCOPES: { Security: [], Webhooks: [], Lock: [], Users: [], Attributes: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    Security: 'Security',
    Webhooks: 'Webhooks',
    Lock: 'Lock',
    Users: 'Users',
    Attributes: 'Attributes',
  },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Security: [], Webhooks: [], Lock: [], Users: [], Attributes: [] },
}))

jest.mock('JansConfigApi', () => ({
  useSyncRoleToScopesMappings: jest.fn(() => ({ mutateAsync: jest.fn() })),
}))

jest.mock('@/redux/api/backend-api', () => ({
  uploadPolicyStore: jest.fn().mockResolvedValue({ status: 200 }),
  fetchPolicyStore: jest.fn().mockResolvedValue({ data: { responseBytes: '' } }),
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

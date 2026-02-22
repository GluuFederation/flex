import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import SettingsPage from 'Plugins/admin/components/Settings/SettingsPage'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Settings: 'settings' },
  CEDAR_RESOURCE_SCOPES: { settings: [] },
  CedarlingLogType: { OFF: 'off', STD_OUT: 'std_out' },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Settings: 'settings' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { settings: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetAdminuiConf: jest.fn(() => ({
    data: { auiConfiguration: { listPagingSize: 10, maxCount: 200 } },
    isSuccess: true,
    isFetching: false,
    isLoading: false,
  })),
  useEditAdminuiConf: jest.fn(() => ({ mutateAsync: jest.fn() })),
  useGetConfigScriptsByType: jest.fn(() => ({
    data: { entries: [] },
    isLoading: false,
  })),
  getGetAdminuiConfQueryKey: jest.fn(() => ['adminuiConf']),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (
      state = {
        userinfo: { name: 'Test User' },
        config: { clientId: '123', configApiBaseUrl: 'https://example.com' },
      },
    ) => state,
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

it('Should render the settings page properly', async () => {
  render(<SettingsPage />, { wrapper: Wrapper })
  expect(await screen.findByText(/List paging size/)).toBeInTheDocument()
  expect(screen.getByText(/Config API URL/)).toBeInTheDocument()
})

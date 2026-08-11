import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import SettingsPage from 'Plugins/admin/components/Settings/SettingsPage'
import { useGetAgamaPrj } from 'JansConfigApi'
import type { Deployment } from 'JansConfigApi'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Settings: 'settings' },
  CEDAR_RESOURCE_SCOPES: { settings: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Settings: 'settings' },
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
  useGetAgamaPrj: jest.fn(() => ({
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

const agamaEntries: Deployment[] = [
  {
    details: {
      projectMetadata: {
        configs: { 'org.gluu.agama.pw.main': {}, 'org.gluu.agama.hidden': {} },
        noDirectLaunch: ['org.gluu.agama.hidden'],
      },
    },
  },
]

it('Should list installed agama project flows in the ACR dropdown', async () => {
  const agamaQuery = { data: { entries: agamaEntries }, isLoading: false }
  jest
    .mocked(useGetAgamaPrj)
    .mockReturnValue(
      agamaQuery as Partial<ReturnType<typeof useGetAgamaPrj>> as ReturnType<typeof useGetAgamaPrj>,
    )

  render(<SettingsPage />, { wrapper: Wrapper })

  expect(
    await screen.findByRole('option', { name: /agama_org\.gluu\.agama\.pw\.main \(agama\)/ }),
  ).toBeInTheDocument()
  expect(screen.queryByRole('option', { name: /agama_org\.gluu\.agama\.hidden/ })).toBeNull()
})

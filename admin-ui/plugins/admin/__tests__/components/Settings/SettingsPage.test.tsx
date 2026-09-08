import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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

const mockUsePermission = jest.fn(() => ({ canRead: true, canWrite: true, canDelete: true }))

jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: () => mockUsePermission(),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Settings: 'settings' },
  CEDAR_RESOURCE_SCOPES: { settings: [] },
  buildCedarPermissionKey: (resource: string, action: string) => `${resource}::${action}`,
}))

const mockMutateAsync = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetAdminuiConf: jest.fn(() => ({
    data: { auiConfiguration: { listPagingSize: 10, maxCount: 200 } },
    isSuccess: true,
    isFetching: false,
    isLoading: false,
  })),
  useEditAdminuiConf: jest.fn(() => ({ mutateAsync: mockMutateAsync })),
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
    cedarPermissions: (
      state = { permissions: { 'settings::read': true, 'settings::write': true } },
    ) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const makeWrapper = (permissions: Record<string, boolean>) => {
  const scopedStore = configureStore({
    reducer: combineReducers({
      authReducer: (
        state = {
          userinfo: { name: 'Test User' },
          config: { clientId: '123', configApiBaseUrl: 'https://example.com' },
        },
      ) => state,
      cedarPermissions: (state = { permissions }) => state,
      noReducer: (state = {}) => state,
    }),
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>
        <Provider store={scopedStore}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
}

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

describe('read-only access', () => {
  beforeEach(() => {
    mockMutateAsync.mockClear()
    mockUsePermission.mockReturnValue({ canRead: true, canWrite: false, canDelete: false })
  })

  afterEach(() => {
    mockUsePermission.mockReturnValue({ canRead: true, canWrite: true, canDelete: true })
  })

  it('does not submit when the role lacks Settings write', async () => {
    const { container } = render(<SettingsPage />, { wrapper: Wrapper })
    await screen.findByText(/List paging size/)

    const form = container.querySelector('form')
    expect(form).not.toBeNull()
    fireEvent.submit(form as HTMLFormElement)

    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('disables the editable fields when the role lacks Settings write', async () => {
    const { container } = render(<SettingsPage />, { wrapper: Wrapper })
    await screen.findByText(/List paging size/)

    const sessionTimeout = container.querySelector('input[name="sessionTimeoutInMins"]')
    expect(sessionTimeout).toBeDisabled()
  })
})

it('shows a loader instead of a permission error while the decision is pending', async () => {
  mockUsePermission.mockReturnValue({ canRead: false, canWrite: false, canDelete: false })

  render(<SettingsPage />, { wrapper: makeWrapper({}) })

  expect(screen.queryByTestId('MISSING')).toBeNull()

  mockUsePermission.mockReturnValue({ canRead: true, canWrite: true, canDelete: true })
})

it('shows the permission error once the decision resolves to denied', async () => {
  mockUsePermission.mockReturnValue({ canRead: false, canWrite: false, canDelete: false })

  render(<SettingsPage />, {
    wrapper: makeWrapper({ 'settings::read': false, 'settings::write': false }),
  })

  expect(await screen.findByTestId('MISSING')).toBeInTheDocument()

  mockUsePermission.mockReturnValue({ canRead: true, canWrite: true, canDelete: true })
})

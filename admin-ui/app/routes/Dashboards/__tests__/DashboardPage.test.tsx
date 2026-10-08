import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import DashboardPage from 'Routes/Dashboards/DashboardPage'
import { useHealthStatus } from 'Plugins/admin/components/Health/hooks'
import { JANS_SERVICES } from '@/constants/jansServices'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Dashboard: 'dashboard' },
  CEDAR_RESOURCE_SCOPES: { dashboard: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Dashboard: 'dashboard' },
  CEDAR_RESOURCE_SCOPES: { dashboard: [] },
}))

jest.mock('@/routes/License/hooks/useLicenseDetails', () => ({
  useLicenseDetails: jest.fn(() => ({
    item: { licenseEnabled: true, productName: 'Gluu Flex', companyName: 'Gluu' },
    loading: false,
    refetch: jest.fn(),
    queryKey: [],
    resetLicense: jest.fn(),
    isResetting: false,
  })),
}))

jest.mock('Plugins/auth-server/components/OidcClients/hooks', () => ({
  useClients: jest.fn(() => ({
    clients: [],
    totalCount: 5,
    isLoading: false,
    refetch: jest.fn(),
  })),
}))

jest.mock('Routes/Dashboards/hooks', () => ({
  useDashboardLockStats: jest.fn(() => ({
    latestStats: null,
    isLoading: false,
    data: null,
  })),
}))

jest.mock('Plugins/admin/components/Health/hooks', () => ({
  useHealthStatus: jest.fn(() => ({
    services: [],
    allServices: [],
    healthyCount: 0,
    totalCount: 0,
    isLoading: false,
    isFetching: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
  })),
}))

jest.mock('Plugins/admin/components/MAU/hooks', () => ({
  useMauStats: jest.fn(() => ({
    data: null,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: jest.fn(),
  })),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (
      state = {
        isUserInfoFetched: true,
        hasSession: true,
        permissions: [],
        userinfo: { name: 'Test User', inum: '123' },
        config: { clientId: '123' },
      },
    ) => state,
    cedarPermissions: (state = { initialized: true, isInitializing: false }) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

describe('DashboardPage', () => {
  it('renders the dashboard page with system status and summary cards', () => {
    render(<DashboardPage />, { wrapper: Wrapper })
    expect(screen.getByText(/System Status/i)).toBeInTheDocument()
    expect(screen.getByText(/OIDC Clients Count/i)).toBeInTheDocument()
  })

  it('shows a status-unavailable message when no services are reported', () => {
    render(<DashboardPage />, { wrapper: Wrapper })
    expect(screen.getByText('Service status unavailable')).toBeInTheDocument()
  })

  it('lists services instead of the message when health data is present', () => {
    jest.mocked(useHealthStatus).mockReturnValue({
      ...jest.mocked(useHealthStatus)(),
      allServices: [{ name: JANS_SERVICES.CONFIG_API, status: 'up' }],
    } as ReturnType<typeof useHealthStatus>)
    render(<DashboardPage />, { wrapper: Wrapper })
    expect(screen.queryByText('Service status unavailable')).not.toBeInTheDocument()
  })
})

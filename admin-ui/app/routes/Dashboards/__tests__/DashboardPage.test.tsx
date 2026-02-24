import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import DashboardPage from 'Routes/Dashboards/DashboardPage'

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
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { dashboard: [] },
}))

jest.mock('Routes/Dashboards/hooks', () => ({
  useDashboardLicense: jest.fn(() => ({
    data: { licenseEnabled: true, productName: 'Gluu Flex', companyName: 'Gluu' },
    isLoading: false,
  })),
  useDashboardClients: jest.fn(() => ({
    totalCount: 5,
    isLoading: false,
  })),
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
})

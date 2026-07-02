import React, { type PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import AuthenticatedRouteSelector from '../AuthenticatedRouteSelector'

const mockLocation = { pathname: '/' }
jest.mock('react-router-dom', () => ({ useLocation: () => mockLocation }))

jest.mock('@/helpers/navigation', () => ({
  ROUTES: {
    ROOT: '/',
    LOGOUT: '/admin/logout',
    HOME_DASHBOARD: '/home/dashboard',
    PROFILE: '/profile',
  },
}))

// Children are covered by their own suites; stub to markers and record mockPreloads.
// mock-prefixed so the hoisted factory may reference it.
const mockPreloads = {
  DashboardPage: jest.fn(),
  ProfilePage: jest.fn(),
  GluuToast: jest.fn(),
  DefaultSidebar: jest.fn(),
  GluuNavBar: jest.fn(),
  GluuWebhookExecutionDialog: jest.fn(),
}
jest.mock('Utils/RouteLoader', () => {
  const marker = (testid?: string) => () => (testid ? <div data-testid={testid} /> : null)
  const lazy = (preload: () => void, testid?: string) => Object.assign(marker(testid), { preload })
  return {
    LazyRoutes: {
      DashboardPage: lazy(() => mockPreloads.DashboardPage()),
      ProfilePage: lazy(() => mockPreloads.ProfilePage()),
      GluuToast: lazy(() => mockPreloads.GluuToast(), 'toast'),
      DefaultSidebar: lazy(() => mockPreloads.DefaultSidebar()),
      GluuNavBar: lazy(() => mockPreloads.GluuNavBar()),
      GluuWebhookExecutionDialog: lazy(
        () => mockPreloads.GluuWebhookExecutionDialog(),
        'webhook-dialog',
      ),
      ByeBye: lazy(() => {}, 'byebye'),
    },
  }
})

jest.mock('../../../layout/default', () => ({
  __esModule: true,
  default: ({ children }: PropsWithChildren) => <div data-testid="layout">{children}</div>,
}))
jest.mock('../../../routes/index', () => ({
  RoutedContent: () => <div data-testid="routed-content" />,
}))
jest.mock('Utils/AppAuthProvider', () => ({
  __esModule: true,
  default: ({ children }: PropsWithChildren) => <div data-testid="auth-provider">{children}</div>,
}))
jest.mock('../PermissionsPolicyInitializer', () => ({
  __esModule: true,
  default: () => <div data-testid="perms-init" />,
}))

beforeEach(() => {
  Object.values(mockPreloads).forEach((p) => p.mockClear())
  mockLocation.pathname = '/'
})

describe('AuthenticatedRouteSelector', () => {
  it('renders the ByeBye component on the logout route', () => {
    mockLocation.pathname = '/admin/logout'
    render(<AuthenticatedRouteSelector />)
    expect(screen.getByTestId('byebye')).toBeInTheDocument()
    expect(screen.queryByTestId('routed-content')).not.toBeInTheDocument()
  })

  it('renders the authenticated app shell on a normal route', () => {
    render(<AuthenticatedRouteSelector />)
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument()
    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByTestId('routed-content')).toBeInTheDocument()
    expect(screen.getByTestId('perms-init')).toBeInTheDocument()
  })

  it('always preloads the core chrome routes', () => {
    render(<AuthenticatedRouteSelector />)
    expect(mockPreloads.GluuToast).toHaveBeenCalled()
    expect(mockPreloads.DefaultSidebar).toHaveBeenCalled()
    expect(mockPreloads.GluuNavBar).toHaveBeenCalled()
    expect(mockPreloads.GluuWebhookExecutionDialog).toHaveBeenCalled()
  })

  it('preloads the dashboard on the root route', () => {
    mockLocation.pathname = '/'
    render(<AuthenticatedRouteSelector />)
    expect(mockPreloads.DashboardPage).toHaveBeenCalled()
    expect(mockPreloads.ProfilePage).not.toHaveBeenCalled()
  })

  it('preloads the dashboard on the home-dashboard route', () => {
    mockLocation.pathname = '/home/dashboard'
    render(<AuthenticatedRouteSelector />)
    expect(mockPreloads.DashboardPage).toHaveBeenCalled()
  })

  it('preloads the profile page on the profile route', () => {
    mockLocation.pathname = '/profile'
    render(<AuthenticatedRouteSelector />)
    expect(mockPreloads.ProfilePage).toHaveBeenCalled()
    expect(mockPreloads.DashboardPage).not.toHaveBeenCalled()
  })
})

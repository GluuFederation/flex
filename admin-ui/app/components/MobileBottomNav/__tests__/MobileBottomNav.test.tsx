import { render, screen, fireEvent } from '@testing-library/react'

let mockIsMobile = true
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: () => mockIsMobile,
}))

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

jest.mock('@/context/theme/themeContext', () => ({
  useTheme: () => ({ state: { theme: 'light' } }),
}))
jest.mock('@/context/theme/config', () => ({
  __esModule: true,
  default: () => ({ navbar: { background: '#fff', border: '#eee' }, textMuted: '#888' }),
}))

const mockNavigate = jest.fn()
jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateToRoute: mockNavigate }),
  ROUTES: {
    HOME_DASHBOARD: '/home/dashboard',
    AUTH_SERVER_CLIENTS_LIST: '/auth-server/clients',
    USER_MANAGEMENT: '/user/usersmanagement',
    CUSTOM_SCRIPT_LIST: '/home/scripts',
    ATTRIBUTES_LIST: '/attributes',
    SERVICES_CACHE: '/config/cache',
    SERVICES_PERSISTENCE: '/config/persistence',
    SMTP_BASE: '/smtp/smtpmanagement',
    SCIM_BASE: '/scim',
    FIDO_BASE: '/fido/configuration',
    FIDO_METRICS: '/fido/metrics',
    JANS_LOCK_BASE: '/jans-lock',
    PLUGIN_BASE_PATHS: {
      HOME: '/home',
      AUTH_SERVER: '/auth-server',
      USER_MANAGEMENT: '/user',
    },
  },
}))

let mockPathname = '/home/dashboard'
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: mockPathname }),
}))

jest.mock('../MobileNavSheet', () => ({
  __esModule: true,
  default: ({ openKey }: { openKey: string | null }) =>
    openKey ? <div data-testid="sheet-open">{openKey}</div> : null,
}))

import MobileBottomNav from '../MobileBottomNav'

beforeEach(() => {
  mockIsMobile = true
  mockPathname = '/home/dashboard'
  mockNavigate.mockReset()
})

describe('MobileBottomNav', () => {
  it('renders nothing on non-mobile viewports', () => {
    mockIsMobile = false
    const { container } = render(<MobileBottomNav />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the four tabs on mobile', () => {
    render(<MobileBottomNav />)
    expect(screen.getByTestId('mobile-bottom-nav')).toBeInTheDocument()
    for (const key of ['menus.home', 'menus.oauthserver', 'menus.users', 'menus.more']) {
      expect(screen.getByRole('button', { name: key })).toBeInTheDocument()
    }
  })

  it('opens the matching sheet on tab tap instead of navigating directly', () => {
    render(<MobileBottomNav />)
    fireEvent.click(screen.getByRole('button', { name: 'menus.oauthserver' }))
    expect(screen.getByTestId('sheet-open')).toHaveTextContent('auth-server')
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('opens the More (All Category) sheet when the More tab is tapped', () => {
    render(<MobileBottomNav />)
    fireEvent.click(screen.getByRole('button', { name: 'menus.more' }))
    expect(screen.getByTestId('sheet-open')).toHaveTextContent('more')
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('marks the tab whose sheet is open as active, suppressing route highlight', () => {
    render(<MobileBottomNav />)
    const more = screen.getByRole('button', { name: 'menus.more' })
    expect(more).not.toHaveAttribute('aria-current')
    fireEvent.click(more)
    expect(more).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'menus.home' })).not.toHaveAttribute('aria-current')
  })

  it('toggles a sheet closed when its own tab is tapped again', () => {
    render(<MobileBottomNav />)
    const auth = screen.getByRole('button', { name: 'menus.oauthserver' })
    fireEvent.click(auth)
    expect(screen.getByTestId('sheet-open')).toBeInTheDocument()
    fireEvent.click(auth)
    expect(screen.queryByTestId('sheet-open')).not.toBeInTheDocument()
  })

  it('navigates directly (no sheet) when the Users tab is tapped', () => {
    render(<MobileBottomNav />)
    fireEvent.click(screen.getByRole('button', { name: 'menus.users' }))
    expect(mockNavigate).toHaveBeenCalledWith('/user/usersmanagement')
    expect(screen.queryByTestId('sheet-open')).not.toBeInTheDocument()
  })

  it('keeps Auth Server active across any /auth-server sub-route (not just clients)', () => {
    mockPathname = '/auth-server/scopes'
    render(<MobileBottomNav />)
    expect(screen.getByRole('button', { name: 'menus.oauthserver' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('marks More active (not Home) when on a More-menu route under /home', () => {
    mockPathname = '/home/scripts'
    render(<MobileBottomNav />)
    expect(screen.getByRole('button', { name: 'menus.more' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: 'menus.home' })).not.toHaveAttribute('aria-current')
  })

  it('marks More active on a drilled More-menu route (FIDO metrics)', () => {
    mockPathname = '/fido/metrics'
    render(<MobileBottomNav />)
    expect(screen.getByRole('button', { name: 'menus.more' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('marks the tab matching the current route as active when idle', () => {
    mockPathname = '/auth-server/clients/edit/123'
    render(<MobileBottomNav />)
    expect(screen.getByRole('button', { name: 'menus.oauthserver' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: 'menus.home' })).not.toHaveAttribute('aria-current')
  })
})

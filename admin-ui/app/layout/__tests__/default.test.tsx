import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { DEFAULT_THEME, THEME_LIGHT } from '@/context/theme/constants'
import { STORAGE_KEYS } from '@/constants'

// getInitialThemeStyle is a module-private helper reached through AppLayout's
// render; ThemeProvider is stubbed to echo the initialStyle it receives so each
// resolution branch can be asserted. Collaborators have their own suites.
type ThemeProviderProps = PropsWithChildren<{ initialStyle?: string; initialColor?: string }>

jest.mock('Components', () => {
  const Layout = ({ children }: PropsWithChildren) => <div data-testid="layout">{children}</div>
  Layout.Navbar = ({ children }: PropsWithChildren) => <div>{children}</div>
  Layout.Sidebar = ({ children }: PropsWithChildren) => <div>{children}</div>
  Layout.Content = ({ children }: PropsWithChildren) => <div>{children}</div>
  return {
    Layout,
    ThemeProvider: ({ children, initialStyle, initialColor }: ThemeProviderProps) => (
      <div data-testid="theme-provider" data-style={initialStyle} data-color={initialColor}>
        {children}
      </div>
    ),
  }
})

jest.mock('../../routes', () => ({
  RoutedNavbars: () => <div data-testid="navbars" />,
  RoutedSidebars: () => <div data-testid="sidebars" />,
}))

// SCSS + favicon asset imports are handled by jest asset mocks, but stub the
// stylesheet side-effects and the .ico favicon (not covered by the asset mapper)
// explicitly to keep the module graph small.
jest.mock('Styles/bootstrap.scss', () => ({}), { virtual: true })
jest.mock('Styles/main.scss', () => ({}), { virtual: true })
jest.mock('../../images/favicons/favicon.ico', () => 'favicon.ico', { virtual: true })

const mockGet = jest.fn()
jest.mock('@/utils/storage', () => ({ storage: { get: (k: string) => mockGet(k) } }))

const mockLoggerError = jest.fn()
jest.mock('@/utils/logger', () => ({
  logger: { error: (m: string, e?: Error | string) => mockLoggerError(m, e) },
}))

import AppLayout from '../default'

const initialStyle = () => screen.getByTestId('theme-provider').getAttribute('data-style')

beforeEach(() => {
  mockGet.mockReset()
  mockLoggerError.mockReset()
})

describe('AppLayout', () => {
  it('renders the layout shell with navbar and sidebar routes', () => {
    mockGet.mockReturnValue(null)
    render(<AppLayout>page</AppLayout>)
    expect(screen.getByTestId('layout')).toBeInTheDocument()
    expect(screen.getByTestId('navbars')).toBeInTheDocument()
    expect(screen.getByTestId('sidebars')).toBeInTheDocument()
  })

  it('renders its children inside the content region', () => {
    mockGet.mockReturnValue(null)
    render(
      <AppLayout>
        <span data-testid="child">hello</span>
      </AppLayout>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('passes the primary color to the theme provider', () => {
    mockGet.mockReturnValue(null)
    render(<AppLayout>x</AppLayout>)
    expect(screen.getByTestId('theme-provider')).toHaveAttribute('data-color', 'primary')
  })

  describe('initial theme resolution', () => {
    it('uses a saved valid theme from storage', () => {
      mockGet.mockReturnValue(THEME_LIGHT)
      render(<AppLayout>x</AppLayout>)
      expect(mockGet).toHaveBeenCalledWith(STORAGE_KEYS.INIT_THEME)
      expect(initialStyle()).toBe(THEME_LIGHT)
    })

    it('falls back to the default theme when nothing is stored', () => {
      mockGet.mockReturnValue(null)
      render(<AppLayout>x</AppLayout>)
      expect(initialStyle()).toBe(DEFAULT_THEME)
    })

    it('falls back to the default theme for an invalid stored value', () => {
      mockGet.mockReturnValue('not-a-real-theme')
      render(<AppLayout>x</AppLayout>)
      expect(initialStyle()).toBe(DEFAULT_THEME)
    })

    it('logs and falls back to the default theme when storage access throws', () => {
      mockGet.mockImplementation(() => {
        throw new Error('storage blocked')
      })
      render(<AppLayout>x</AppLayout>)
      expect(initialStyle()).toBe(DEFAULT_THEME)
      expect(mockLoggerError).toHaveBeenCalledWith(
        expect.stringContaining('Failed to get initial theme'),
        expect.any(Error),
      )
    })
  })
})

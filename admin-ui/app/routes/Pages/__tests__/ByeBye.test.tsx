import { type PropsWithChildren } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ByeBye from '../ByeBye'

type ByeByeState = {
  authReducer: {
    config: { endSessionEndpoint: string; postLogoutRedirectUri: string }
    hasSession: boolean
  }
}
type AuthStatePayload = { state: boolean }

// jest hoists mock factories above imports; factory-closed variables must be `mock`-prefixed.
const mockDispatch = jest.fn()
const mockState: ByeByeState = {
  authReducer: {
    config: {
      endSessionEndpoint: 'https://idp.example.com/end',
      postLogoutRedirectUri: 'https://app.example.com/',
    },
    hasSession: true,
  },
}
jest.mock('@/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: <T,>(fn: (s: ByeByeState) => T) => fn(mockState),
}))

const mockDeleteSession = jest.fn()
jest.mock('Redux/api/backend-api', () => ({ deleteAdminUiSession: () => mockDeleteSession() }))
jest.mock('Redux/features/logoutSlice', () => ({ logoutUser: () => ({ type: 'logoutUser' }) }))
jest.mock('../../../redux/features/authSlice', () => ({
  setAuthState: (p: AuthStatePayload) => ({ type: 'setAuthState', payload: p }),
}))
jest.mock('Utils/Util', () => ({ uuidv4: () => 'fixed-state' }))
jest.mock('@/utils/logger', () => ({ logger: { error: jest.fn(), info: jest.fn() } }))

const mockBuildSafeLogoutUrl = jest.fn()
const mockBuildSafeNavigationUrl = jest.fn()
jest.mock('@/utils/urlSecurity', () => ({
  buildSafeLogoutUrl: (endpoint: string, redirectUri: string, state: string) =>
    mockBuildSafeLogoutUrl(endpoint, redirectUri, state),
  buildSafeNavigationUrl: (rawUrl: string) => mockBuildSafeNavigationUrl(rawUrl),
}))

// The component renders inside Components' EmptyLayout/Label; stub to plain markup.
jest.mock('Components', () => ({
  EmptyLayout: {
    Section: ({ children }: PropsWithChildren) => <div>{children}</div>,
  },
  Label: ({ children }: PropsWithChildren) => <div data-testid="label">{children}</div>,
}))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))
jest.mock('Context/theme/themeContext', () => {
  const { createContext } = jest.requireActual('react')
  return { ThemeContext: createContext({ state: { theme: 'light' } }) }
})
jest.mock('@/context/theme/config', () => ({
  __esModule: true,
  default: () => ({ background: '#fff', fontColor: '#000' }),
}))

describe('ByeBye', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    mockDeleteSession.mockReset().mockResolvedValue(undefined)
    mockBuildSafeLogoutUrl.mockReset()
    mockBuildSafeNavigationUrl.mockReset()
    mockState.authReducer = {
      config: {
        endSessionEndpoint: 'https://idp.example.com/end',
        postLogoutRedirectUri: 'https://app.example.com/',
      },
      hasSession: true,
    }
  })

  it('renders the goodbye message', () => {
    mockBuildSafeLogoutUrl.mockReturnValue('https://idp.example.com/end?state=fixed-state')
    render(<ByeBye />)
    expect(screen.getByTestId('label')).toHaveTextContent('messages.thanks_for_using_admin_ui')
  })

  it('marks auth as logged out and dispatches logout', async () => {
    mockBuildSafeLogoutUrl.mockReturnValue('https://idp.example.com/end?state=fixed-state')
    render(<ByeBye />)
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'setAuthState',
        payload: { state: false },
      }),
    )
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'logoutUser' })
  })

  it('deletes the admin UI session when one exists', async () => {
    mockBuildSafeLogoutUrl.mockReturnValue('https://idp.example.com/end?state=fixed-state')
    render(<ByeBye />)
    await waitFor(() => expect(mockDeleteSession).toHaveBeenCalledTimes(1))
  })

  it('skips session deletion when there is no session', async () => {
    mockState.authReducer.hasSession = false
    mockBuildSafeLogoutUrl.mockReturnValue('https://idp.example.com/end?state=fixed-state')
    render(<ByeBye />)
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith({ type: 'logoutUser' }))
    expect(mockDeleteSession).not.toHaveBeenCalled()
  })

  // window.location assignment is a no-op under jsdom, so the redirect branch is
  // asserted through which safe-URL builder ran with which arguments.
  it('builds the safe end-session URL when the config is complete', async () => {
    mockBuildSafeLogoutUrl.mockReturnValue('https://idp.example.com/end?state=fixed-state')
    render(<ByeBye />)
    await waitFor(() =>
      expect(mockBuildSafeLogoutUrl).toHaveBeenCalledWith(
        'https://idp.example.com/end',
        'https://app.example.com/',
        'fixed-state',
      ),
    )
    expect(mockBuildSafeNavigationUrl).not.toHaveBeenCalled()
  })

  it('falls back to the safe navigation URL when no end-session endpoint is configured', async () => {
    mockState.authReducer.config = {
      endSessionEndpoint: '',
      postLogoutRedirectUri: 'https://app.example.com/',
    } as never
    mockBuildSafeNavigationUrl.mockReturnValue('https://app.example.com/')
    render(<ByeBye />)
    await waitFor(() =>
      expect(mockBuildSafeNavigationUrl).toHaveBeenCalledWith('https://app.example.com/'),
    )
    expect(mockBuildSafeLogoutUrl).not.toHaveBeenCalled()
  })

  it('still resolves the navigation fallback when the redirect URI is unsafe', async () => {
    mockState.authReducer.config = {
      endSessionEndpoint: '',
      postLogoutRedirectUri: 'javascript:alert(1)',
    } as never
    mockBuildSafeNavigationUrl.mockReturnValue(null)
    render(<ByeBye />)
    await waitFor(() =>
      expect(mockBuildSafeNavigationUrl).toHaveBeenCalledWith('javascript:alert(1)'),
    )
    expect(mockBuildSafeLogoutUrl).not.toHaveBeenCalled()
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { ThemeContext } from '@/context/theme/themeContext'
import type { ThemeContextType } from '@/context/theme/themeContext'
import { THEME_LIGHT } from '@/context/theme/constants'
import { MobileProfileDropdown } from '../MobileProfileDropdown'
import sessionReducer, { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { ROUTES } from '@/helpers/navigation'

const mockToggleCedarLogs = jest.fn()

jest.mock('@/utils/hooks/useCedarlingLogToggle', () => ({
  useCedarlingLogToggle: () => ({
    enabled: false,
    toggle: mockToggleCedarLogs,
    isSaving: false,
    isConfigReady: true,
  }),
}))

const mockNavigateToRoute = jest.fn()

jest.mock('@/helpers/navigation', () => ({
  ...jest.requireActual('@/helpers/navigation'),
  useAppNavigation: () => ({ navigateToRoute: mockNavigateToRoute }),
}))

jest.mock('@/hooks/useThemePersistence', () => ({
  useThemePersistence: () => jest.fn(),
}))

jest.mock('@/hooks/useLangPersistence', () => ({
  useLangPersistence: () => ({ lang: 'en', changeLanguage: jest.fn() }),
}))

const makeStore = () =>
  configureStore({
    reducer: combineReducers({ sessionReducer }),
    preloadedState: { sessionReducer: { landingPath: null, logoutRequested: false } },
  })

const themeValue: ThemeContextType = {
  state: { theme: THEME_LIGHT },
  dispatch: jest.fn(),
}

const renderMobileProfile = (store = makeStore()) => {
  const dispatchSpy = jest.spyOn(store, 'dispatch')
  return {
    store,
    dispatchSpy,
    ...render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeContext.Provider value={themeValue}>
            <MobileProfileDropdown
              userInfo={{ inum: 'test-inum' } as never}
              renderTrigger={() => <span>Account</span>}
            />
          </ThemeContext.Provider>
        </I18nextProvider>
      </Provider>,
    ),
  }
}

const openMenu = () => fireEvent.click(screen.getByText('Account'))

describe('MobileProfileDropdown', () => {
  beforeEach(() => {
    mockNavigateToRoute.mockClear()
    mockToggleCedarLogs.mockClear()
  })

  it('renders the trigger', () => {
    renderMobileProfile()
    expect(screen.getByText('Account')).toBeInTheDocument()
  })

  it('shows profile and sign-out rows when opened', () => {
    renderMobileProfile()
    openMenu()
    expect(screen.getByText(i18n.t('menus.my_profile'))).toBeInTheDocument()
    expect(screen.getByText(i18n.t('menus.signout'))).toBeInTheDocument()
  })

  it('navigates to the profile route when "my profile" is clicked', () => {
    renderMobileProfile()
    openMenu()
    fireEvent.click(screen.getByText(i18n.t('menus.my_profile')))
    expect(mockNavigateToRoute).toHaveBeenCalledWith(ROUTES.PROFILE)
  })

  it('toggles cedarling logs once when the switch is changed', () => {
    renderMobileProfile()
    openMenu()
    fireEvent.click(screen.getByRole('switch', { name: i18n.t('fields.cedarlingLogs?') }))
    expect(mockToggleCedarLogs).toHaveBeenCalledTimes(1)
  })

  it('dispatches a logout audit when sign out is clicked', () => {
    const { dispatchSpy } = renderMobileProfile()
    openMenu()
    fireEvent.click(screen.getByText(i18n.t('menus.signout')))
    expect(dispatchSpy).toHaveBeenCalledWith(
      auditLogoutLogs({ message: 'User logged out manually' }),
    )
  })
})

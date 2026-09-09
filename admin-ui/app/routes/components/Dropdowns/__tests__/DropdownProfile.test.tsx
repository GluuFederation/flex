import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { DropdownProfile } from '../DropdownProfile'
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

const makeStore = () =>
  configureStore({
    reducer: combineReducers({ sessionReducer }),
    preloadedState: { sessionReducer: { landingPath: null, logoutRequested: false } },
  })

const renderProfile = (store = makeStore()) => {
  const dispatchSpy = jest.spyOn(store, 'dispatch')
  return {
    store,
    dispatchSpy,
    ...render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <DropdownProfile trigger={<button type="button">Account</button>} />
        </I18nextProvider>
      </Provider>,
    ),
  }
}

const openMenu = () => fireEvent.click(screen.getByText('Account'))

describe('DropdownProfile', () => {
  beforeEach(() => {
    mockNavigateToRoute.mockClear()
    mockToggleCedarLogs.mockClear()
  })

  it('renders the trigger', () => {
    renderProfile()
    expect(screen.getByText('Account')).toBeInTheDocument()
  })

  it('shows profile and sign-out options when opened', () => {
    renderProfile()
    openMenu()
    expect(screen.getByText(i18n.t('menus.my_profile'))).toBeInTheDocument()
    expect(screen.getByText(i18n.t('menus.signout'))).toBeInTheDocument()
  })

  it('navigates to the profile route when "my profile" is clicked', () => {
    renderProfile()
    openMenu()
    fireEvent.click(screen.getByText(i18n.t('menus.my_profile')))
    expect(mockNavigateToRoute).toHaveBeenCalledWith(ROUTES.PROFILE)
  })

  it('toggles cedarling logs once when the option is activated', () => {
    renderProfile()
    openMenu()
    fireEvent.click(screen.getByRole('switch', { name: i18n.t('fields.cedarlingLogs?') }))
    expect(mockToggleCedarLogs).toHaveBeenCalledTimes(1)
  })

  it('keeps the menu open after cedarling logs is toggled', () => {
    renderProfile()
    openMenu()
    fireEvent.click(screen.getByRole('switch', { name: i18n.t('fields.cedarlingLogs?') }))
    expect(screen.getByText(i18n.t('menus.signout'))).toBeInTheDocument()
  })

  it('closes the menu after sign out is clicked', () => {
    renderProfile()
    openMenu()
    fireEvent.click(screen.getByText(i18n.t('menus.signout')))
    expect(screen.queryByText(i18n.t('menus.my_profile'))).not.toBeInTheDocument()
  })

  it('dispatches a logout audit when sign out is clicked', () => {
    const { dispatchSpy } = renderProfile()
    openMenu()
    fireEvent.click(screen.getByText(i18n.t('menus.signout')))
    expect(dispatchSpy).toHaveBeenCalledWith(
      auditLogoutLogs({ message: 'User logged out manually' }),
    )
  })
})

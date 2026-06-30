import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { DropdownProfile } from '../DropdownProfile'
import sessionReducer, { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { ROUTES } from '@/helpers/navigation'

const mockNavigateToRoute = jest.fn()

jest.mock('@/helpers/navigation', () => ({
  ...jest.requireActual('@/helpers/navigation'),
  useAppNavigation: () => ({ navigateToRoute: mockNavigateToRoute }),
}))

type StoreOptions = { logoutAuditSucceeded?: boolean | null }

const makeStore = ({ logoutAuditSucceeded = null }: StoreOptions = {}) =>
  configureStore({
    reducer: combineReducers({ logoutAuditReducer: sessionReducer }),
    preloadedState: { logoutAuditReducer: { logoutAuditSucceeded } },
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

  it('dispatches a logout audit when sign out is clicked', () => {
    const { dispatchSpy } = renderProfile()
    openMenu()
    fireEvent.click(screen.getByText(i18n.t('menus.signout')))
    expect(dispatchSpy).toHaveBeenCalledWith(
      auditLogoutLogs({ message: 'User logged out manually' }),
    )
  })

  it('navigates to the logout route once the logout audit succeeds', () => {
    renderProfile(makeStore({ logoutAuditSucceeded: true }))
    expect(mockNavigateToRoute).toHaveBeenCalledWith(ROUTES.LOGOUT)
  })

  it('does not navigate to logout while the audit has not succeeded', () => {
    renderProfile(makeStore({ logoutAuditSucceeded: null }))
    expect(mockNavigateToRoute).not.toHaveBeenCalledWith(ROUTES.LOGOUT)
  })
})

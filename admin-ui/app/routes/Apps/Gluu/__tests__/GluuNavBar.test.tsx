import { type ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import type { UserInfo } from 'Redux/features/types/authTypes'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuNavBar from '../GluuNavBar'

const createTestStore = (userinfo: UserInfo | null): Store =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { userinfo }) => state,
      logoutAuditReducer: (state = { logoutAuditSucceeded: null }) => state,
    }),
  })

const renderNavBar = (userinfo: UserInfo | null) => {
  const store = createTestStore(userinfo)
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <AppTestWrapper>{children}</AppTestWrapper>
    </Provider>
  )
  return render(<GluuNavBar />, { wrapper: Wrapper })
}

describe('GluuNavBar', () => {
  it('renders the page title element with the default title', () => {
    renderNavBar(null)
    const pageTitle = document.getElementById('page-title-navbar')
    expect(pageTitle).not.toBeNull()
    expect(pageTitle).toHaveTextContent('Dashboard')
  })

  it('falls back to the "User" display name when there is no user info', () => {
    renderNavBar(null)
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('does not render the theme or language menus when there is no user info', () => {
    renderNavBar(null)
    expect(screen.queryByTestId('ACTIVE_LANG')).not.toBeInTheDocument()
  })

  it('renders the full name when given and family name are present', () => {
    renderNavBar({ given_name: 'Jane', family_name: 'Doe' })
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('renders the theme and language menus when user info is present', () => {
    renderNavBar({ given_name: 'Jane', family_name: 'Doe' })
    expect(screen.getByTestId('ACTIVE_LANG')).toBeInTheDocument()
  })

  it('renders the notifications trigger', () => {
    renderNavBar(null)
    expect(screen.getByAltText('Notifications')).toBeInTheDocument()
  })
})

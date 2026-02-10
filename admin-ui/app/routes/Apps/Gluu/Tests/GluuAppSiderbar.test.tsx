import React, { ReactNode } from 'react'
import { render, waitFor } from '@testing-library/react'
import GluuAppSidebar from '../GluuAppSidebar'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from '../../../../context/theme/themeContext'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { processMenus } from '../../../../../plugins/PluginMenuResolver'

jest.spyOn(global.console, 'log').mockImplementation(jest.fn())
jest.spyOn(global.console, 'error').mockImplementation(jest.fn())
jest.spyOn(global.console, 'warn').mockImplementation(jest.fn())

jest.mock('@/cedarling', () => ({
  useCedarling: () => ({
    authorize: jest.fn().mockResolvedValue({ isAuthorized: true }),
  }),
  AdminUiFeatureResource: {},
}))

jest.mock('@/cedarling/utility', () => ({
  CEDARLING_BYPASS: 'CEDARLING_BYPASS',
}))

jest.mock('Plugins/PluginMenuResolver', () => ({
  processMenus: jest.fn().mockResolvedValue([]),
}))

const mockProcessMenus = jest.mocked(processMenus)

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({
    navigateToRoute: jest.fn(),
  }),
  ROUTES: {
    JANS_LOCK_BASE: '/jans-lock',
    FIDO_BASE: '/fido',
    SCIM_BASE: '/scim',
    SAML_BASE: '/saml',
    LOGOUT: '/logout',
  },
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    noReducer: (state = {}) => state,
    healthReducer: (state = { health: {} }) => state,
    logoutAuditReducer: (state = { logoutAuditSucceeded: null }) => state,
  }),
})

const Wrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>
    <ThemeProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>{children}</MemoryRouter>
      </Provider>
    </ThemeProvider>
  </I18nextProvider>
)

it('Should show the sidebar properly', async () => {
  const { container } = render(<GluuAppSidebar />, { wrapper: Wrapper })

  await waitFor(() => {
    expect(mockProcessMenus).toHaveBeenCalled()
  })

  await waitFor(() => {
    expect(container.querySelector('.sidebar-menu')).toBeInTheDocument()
  })
})

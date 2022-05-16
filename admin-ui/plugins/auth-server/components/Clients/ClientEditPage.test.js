import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientEditPage from './ClientEditPage'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import clients from './clients'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
import initReducer from 'Redux/reducers/InitReducer'
import oidcDiscoveryReducer from 'Redux/reducers/OidcDiscoveryReducer'
import scopeReducer from 'Plugins/auth-server/redux/reducers/ScopeReducer'
const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const INIT_STATE = {
  permissions: permissions,
}

const INIT_CLIENTS_STATE = {
  items: [clients[0]],
  item: clients[0],
}
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    oidcReducer: (state = INIT_CLIENTS_STATE) => state,
    scopeReducer,
    initReducer,
    oidcDiscoveryReducer,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Router basename="/admin">{children}</Router>
    </Provider>
  </I18nextProvider>
)
const emptyArray = []

it('Should the client edit page properly', () => {
  render(<ClientEditPage />, { wrapper: Wrapper })
  screen.getByText(/Basic/)
  screen.getByText(/Advanced/)
  screen.getByText('Encryption/Signing')
  screen.getByText(/Client Attributes/)
  screen.getByText(/Client Scripts/)
  screen.getByText(/Client Name/)
  screen.getByText(/The openid connect client name/)
  screen.getByText(/The openid connect client id/)
  screen.getByText(/Inum/)
})

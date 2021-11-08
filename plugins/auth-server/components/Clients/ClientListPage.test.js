import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientListPage from './ClientListPage'
import { combineReducers } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../app/i18n'
import clients from './clients'
import { I18nextProvider } from 'react-i18next'
import authReducer from '../../../../app/redux/reducers/AuthReducer'
import oidcReducer from '../../redux/reducers/OIDCReducer'
import scopeReducer from '../../redux/reducers/ScopeReducer'

const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const INIT_STATE = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  token: null,
  issuer: null,
  permissions: permissions,
  location: {},
  config: {},
  backendIsUp: true,
}

const INIT_CLIENTS_STATE = {
  items: [clients[0]],
  item: {},
  view: false,
  loading: false,
}

const INIT_SCPOPES_STATE = {
  items: [
    {
      id: 'https://jans.io/oauth/config/smtp.delete',
      scopeType: 'oauth',
      dn: 'inum=1800.85A227,ou=scopes,o=jans',
      inum: '1800.85A227',
      displayName: 'Config API scope https://jans.io/oauth/config/smtp.delete',
      description: 'Delete SMTP related information',
      defaultScope: false,
      attributes: { showInConfigurationEndpoint: false },
      umaType: false,
      tableData: { id: 0 },
    },
  ],
  item: {},
  loading: false,
}
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    oidcReducer: (state = INIT_SCPOPES_STATE) => state,
    scopeReducer,
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

it('Should show the sidebar properly', () => {
  render(
    <ClientListPage
      clients={emptyArray}
      permissions={permissions}
      scopes={emptyArray}
    />,
    { wrapper: Wrapper },
  )
  screen.getByText(/OIDC Clients/)
  screen.getByTitle('Add Client')
  screen.getByText(/refresh/)
  screen.getByText(/search/)
})

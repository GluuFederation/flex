import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientAddPage from './ClientAddPage'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
import initReducer from '../../../../app/redux/reducers/InitReducer'
import oidcDiscoveryReducer from '../../../../app/redux/reducers/OidcDiscoveryReducer'
import scopeReducer from '../../redux/reducers/ScopeReducer'
const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const INIT_STATE = {
  permissions: permissions,
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

it('Should render client add page properly', () => {
  render(<ClientAddPage />, { wrapper: Wrapper })
  screen.getByText(/Basic/)
  screen.getByText(/Advanced/)
  screen.getByText('Encryption/Signing')
  screen.getByText(/Client Attributes/)
  screen.getByText(/Client Scripts/)
  screen.getByText(/Client Name/)
  screen.getByText(/The openid connect client name/)
  screen.getByText(/description/)
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeAddPage from './ScopeAddPage'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
import scopeReducer from '../../redux/reducers/ScopeReducer'
import scopes from './scopes'

const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const INIT_STATE = {
  permissions: permissions,
}
const SCPOPES_STATE = {
  items: scopes,
  item: {},
  loading: false,
}
const STATE = {
  scopes: [],
  scripts: [],
  attributes: [],
}
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    initReducer: (state = STATE) => state,
    scopeReducer: (state = SCPOPES_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render the scope add page properly', () => {
  render(<ScopeAddPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Default Scope/)
})

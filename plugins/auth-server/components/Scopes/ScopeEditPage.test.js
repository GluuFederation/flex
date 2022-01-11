import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeEditPage from './ScopeEditPage'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
import scopes from './scopes'

const permissions = [
  'https://jans.io/oauth/config/scopes.readonly',
  'https://jans.io/oauth/config/scopes.write',
  'https://jans.io/oauth/config/scopes.delete',
]
const INIT_STATE = {
  permissions: permissions,
}
const INIT_SHARED_STATE = {
  scopes: [scopes[0]],
  attributes: [],
  scripts: [],
}
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    initReducer: (state = INIT_SHARED_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render the scope edit page properly', () => {
  render(<ScopeEditPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Default Scope/)
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeListPage from './ScopeListPage'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import scopes from './scopes'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'

const permissions = [
  'https://jans.io/oauth/config/scopes.readonly',
  'https://jans.io/oauth/config/scopes.write',
  'https://jans.io/oauth/config/scopes.delete',
]
const INIT_STATE = {
  permissions: permissions,
}

const INIT_SCPOPES_STATE = {
  items: [scopes[0]],
  item: {},
  loading: false,
}
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    scopeReducer: (state = INIT_SCPOPES_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render the scope list page properly', () => {
  render(<ScopeListPage />, {
    wrapper: Wrapper,
  })
  const inum = scopes[0].inum
  const description = scopes[0].description
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Scopes/)
  screen.getByText(/search/)
  screen.getByText(inum)
  screen.getByText(description)
})

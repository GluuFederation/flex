import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeAddPage from './ScopeAddPage'
import { Provider } from 'react-redux'
import scopes from './scopes.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

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

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    initReducer: (state = STATE) => state,
    scopeReducer: (state = SCPOPES_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the scope add page properly', () => {
  render(<ScopeAddPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Default Scope/)
})

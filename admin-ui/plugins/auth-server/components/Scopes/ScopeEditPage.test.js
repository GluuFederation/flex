import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeEditPage from './ScopeEditPage'
import { Provider } from 'react-redux'
import scopes from './scopes.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

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

const SCOPE_REDUCER = {
  item: {},
  loading: false,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    initReducer: (state = INIT_SHARED_STATE) => state,
    noReducer: (state = {}) => state,
    scopeReducer: (state = SCOPE_REDUCER) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the scope edit page properly', () => {
  render(<ScopeEditPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Default Scope/)
})

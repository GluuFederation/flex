import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeAddPage from './ScopeAddPage'
import { Provider } from 'react-redux'
import scopes from './scopes.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

// Mock orval hooks
jest.mock('JansConfigApi', () => ({
  usePostOauthScopes: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  })),
}))

// Mock audit logger
jest.mock('./hooks', () => ({
  useScopeActions: jest.fn(() => ({
    logScopeCreation: jest.fn(),
    navigateToScopeList: jest.fn(),
    navigateToScopeAdd: jest.fn(),
    navigateToScopeEdit: jest.fn(),
  })),
}))

const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const INIT_STATE = {
  permissions: permissions,
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
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
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

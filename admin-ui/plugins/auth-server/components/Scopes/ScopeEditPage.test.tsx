import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeEditPage from './ScopeEditPage'
import { Provider } from 'react-redux'
import scopes from './scopes.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Scope } from './types'
import { BrowserRouter } from 'react-router-dom'

// Mock orval hooks
jest.mock('JansConfigApi', () => ({
  useGetOauthScopesByInum: jest.fn(() => ({
    data: scopes[0],
    isLoading: false,
  })),
  usePutOauthScopes: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  })),
}))

// Mock audit logger
jest.mock('./hooks', () => ({
  useScopeActions: jest.fn(() => ({
    logScopeUpdate: jest.fn(),
    navigateToScopeList: jest.fn(),
    navigateToScopeAdd: jest.fn(),
    navigateToScopeEdit: jest.fn(),
  })),
}))

// Mock useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: ':test-inum' }),
}))

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
  item: scopes[0] as Scope,
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

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </BrowserRouter>
)

it('Should render the scope edit page properly', () => {
  render(<ScopeEditPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Default Scope/)
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeListPage from './ScopeListPage'
import { Provider } from 'react-redux'
import scopes from './scopes.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Scope } from './types'

// Mock orval hooks
jest.mock('JansConfigApi', () => ({
  useGetOauthScopes: jest.fn(() => ({
    data: {
      entries: [scopes[0]],
      totalEntriesCount: 1,
    },
    isLoading: false,
    refetch: jest.fn(),
  })),
  useDeleteOauthScopesByInum: jest.fn(() => ({
    mutateAsync: jest.fn(),
  })),
}))

// Mock audit logger
jest.mock('./hooks', () => ({
  useScopeActions: jest.fn(() => ({
    logScopeDeletion: jest.fn(),
    navigateToScopeList: jest.fn(),
    navigateToScopeAdd: jest.fn(),
    navigateToScopeEdit: jest.fn(),
  })),
}))

const permissions = [
  'https://jans.io/oauth/config/scopes.readonly',
  'https://jans.io/oauth/config/scopes.write',
  'https://jans.io/oauth/config/scopes.delete',
]
const INIT_STATE = {
  permissions: permissions,
}

const INIT_CEDAR_STATE = {
  permissions: permissions,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    cedarPermissions: (state = INIT_CEDAR_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the scope list page properly', () => {
  const { container } = render(<ScopeListPage />, {
    wrapper: Wrapper,
  })
  const scope = scopes[0] as Scope
  const id = scope.id
  const description = scope.description

  screen.getByText('Description', { exact: false })
  screen.getByText('Clients', { exact: false })
  screen.getByPlaceholderText('search', { exact: false })
  const colId = container.querySelector(`td[value=${id}]`)
  expect(colId).toBeInTheDocument()
  if (description) {
    screen.getByText(description)
  }
})

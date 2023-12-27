import React from 'react'
import { render, screen } from '@testing-library/react'
import ScopeListPage from './ScopeListPage'
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

const INIT_SCPOPES_STATE = {
  items: [scopes[0]],
  item: {},
  loading: false,
  totalItems: 0,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    scopeReducer: (state = INIT_SCPOPES_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the scope list page properly', () => {
  const { container } = render(<ScopeListPage />, {
    wrapper: Wrapper,
  })
  const id = scopes[0].id
  const description = scopes[0].description
  screen.getByText('Description', { exact: false })
  screen.getByText('Clients', { exact: false })
  screen.getByPlaceholderText('search', { exact: false })
  const colId = container.querySelector(`td[value=${id}]`)
  expect(colId).toBeInTheDocument()
  screen.getByText(description)
})

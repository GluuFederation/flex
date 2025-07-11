import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ClientListPage from 'Plugins/auth-server/components/Clients/ClientListPage'
import { Provider } from 'react-redux'
import clients from './clients.test'
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

const INIT_CLIENTS_STATE = {
  items: [clients[0]],
  item: {},
  view: false,
  loading: false,
  totalItems: 0,
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
      totalItems: 0,
    },
  ],
  item: {},
  loading: false,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    oidcReducer: (state = INIT_CLIENTS_STATE) => state,
    scopeReducer: (state = INIT_SCPOPES_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should show the sidebar properly', async () => {
  const { container } = render(<ClientListPage />, { wrapper: Wrapper })

  const addClientButton = container.querySelector(`button[aria-label="Add Client"]`)
  expect(addClientButton).toBeInTheDocument()

  fireEvent.mouseOver(addClientButton)

  await waitFor(() => screen.getByText('Add Client'))

  const refreshClientButton = container.querySelector(`button[aria-label="Refresh data"]`)
  expect(refreshClientButton).toBeInTheDocument()

  fireEvent.mouseOver(refreshClientButton)

  await waitFor(() => screen.getByText('Refresh data'))

  const inputSearch = container.querySelector(`input[placeholder="Search"]`)
  expect(inputSearch).toBeInTheDocument()
})

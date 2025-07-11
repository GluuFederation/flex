import React from 'react'
import { render } from '@testing-library/react'
import UiRoleListPage from 'Plugins/admin/components/Roles/UiRoleListPage'
import { Provider } from 'react-redux'
import roles from './roles.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const INIT_STATE = {
  permissions: permissions,
}
const INIT_API_ROLE_STATE = {
  items: roles,
  loading: false,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    apiRoleReducer: (state = INIT_API_ROLE_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the api role list page properly', () => {
  render(<UiRoleListPage />, { wrapper: Wrapper })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import item from './item.test'
import script from './script.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import CustomScriptEditPage from 'Plugins/admin/components/CustomScripts/CustomScriptEditPage'

const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const INIT_STATE = {
  permissions: permissions,
}
const INIT_CUSTOM_SCRIPT_STATE = {
  items: [script],
  item: item,
  loading: false,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    customScriptReducer: (state = INIT_CUSTOM_SCRIPT_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the Custom Script edit page properly', () => {
  render(<CustomScriptEditPage />, { wrapper: Wrapper })
  screen.getByText(/Name/)
  screen.getByText(/Description/)
  screen.getByText(/Select SAML ACRS/)
  screen.getByText(/Script Type/)
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import AttributeEditPage from 'Plugins/schema/components/Person/AttributeEditPage'
import { Provider } from 'react-redux'
import attributes from '../../utils/attributes'
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
const INIT_ATTRIBUTE_STATE = {
  items: [attributes[0]],
  item: {},
  loading: false,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    attributeReducer: (state = INIT_ATTRIBUTE_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render the attribute edit page properly', () => {
  render(<AttributeEditPage />, { wrapper: Wrapper })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Status/)
  screen.getByText(/Edit Type/)
  screen.getByText(/View Type/)
  screen.getByText(/Usage Type/)
})

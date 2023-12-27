import React from 'react'
import { render, screen } from '@testing-library/react'
import AttributeAddPage from 'Plugins/schema/components/Person/AttributeAddPage'
import { Provider } from 'react-redux'
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
  items: [
    {
      name: 'givenName',
      inum: 'B4B0',
      displayName: 'givenName',
      description: 'First Name',
      status: 'ACTIVE',
      dataType: 'STRING',
      editType: 'ADMIN',
      viewType: 'ADMIN',
      usageType: 'OPENID',
      jansHideOnDiscovery: false,
      oxMultiValuedAttribute: false,
      attributeValidation: { maxLength: null, regexp: null, minLength: null },
      scimCustomAttr: false,
    },
  ],
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

it('Should render the attribute add page properly', () => {
  render(<AttributeAddPage />, { wrapper: Wrapper })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Status/)
  screen.getByText(/Edit Type/)
  screen.getByText(/View Type/)
  screen.getByText(/Usage Type/)
})

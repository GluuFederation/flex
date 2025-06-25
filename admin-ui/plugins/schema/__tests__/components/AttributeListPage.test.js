import React from 'react'
import { render, screen } from '@testing-library/react'
import AttributeListPage from 'Plugins/schema/components/Person/AttributeListPage'
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
  totalItems: 0,
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

it('Should render the attribute list page properly', () => {
  render(<AttributeListPage />, {
    wrapper: Wrapper,
  })
  const inum = attributes[0].inum
  const displayName = attributes[0].displayName
  screen.getByText(/Inum/i)
  screen.getByText(/Display Name/)
  screen.getByText(/Status/)
  screen.getByText(inum)
  screen.getByText(displayName)
})

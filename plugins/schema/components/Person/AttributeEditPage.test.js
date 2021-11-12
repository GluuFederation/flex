import React from 'react'
import { render, screen } from '@testing-library/react'
import AttributeEditPage from './AttributeEditPage'
import { combineReducers } from 'redux'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
import attributes from './attributes'
const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const INIT_STATE = {
  isAuthenticated: false,
  userinfo: null,
  userinfo_jwt: null,
  token: null,
  issuer: null,
  permissions: permissions,
}
const INIT_ATTRIBUTE_STATE = {
  items: [attributes[0]],
  item: {},
  loading: false,
}
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    attributeReducer: (state = INIT_ATTRIBUTE_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render the attribute edit page properly', () => {
  render(
    <AttributeEditPage item={attributes[0]}/>,
    { wrapper: Wrapper },
  )
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Status/)
  screen.getByText(/Edit Type/)
  screen.getByText(/View Type/)
  screen.getByText(/Usage Type/)
})

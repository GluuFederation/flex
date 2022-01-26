import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomScriptAddPage from './CustomScriptAddPage'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
import item from "./item"

const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const INIT_STATE = {
  permissions: permissions,
}
const INIT_CUSTOM_SCRIPT_STATE = {
  items: [
    item,
  ],
  loading: false,
}
const store = createStore(
  combineReducers({
    authReducer: (state = INIT_STATE) => state,
    customScriptReducer: (state = INIT_CUSTOM_SCRIPT_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render the Custom Script add page properly', () => {
  render(<CustomScriptAddPage />, { wrapper: Wrapper })
  screen.getByText(/Name/)
  screen.getByText(/Description/)
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import AcrsPage from './AcrsPage'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'

const permissions = [
  'https://jans.io/oauth/config/acrs.readonly',
  'https://jans.io/oauth/config/acrs.write',
  'https://jans.io/oauth/config/acrs.delete',
]
const ACRS_STATE = {
  acrs: {},
  scripts: [],
  loading: false,
}

const AUTH_STATE = {
  permissions: permissions,
}
const SCRIPT_STATE = {
  items: [],
}

const store = createStore(
  combineReducers({
    authReducer: (state = AUTH_STATE) => state,
    acrReducer: (state = ACRS_STATE) => state,
    customScriptReducer: (state = SCRIPT_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render Acr page properly', () => {
  render(<AcrsPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/simple_password_auth/)
  expect(screen.getByTestId('defaultAcr')).toBeInTheDocument()
})

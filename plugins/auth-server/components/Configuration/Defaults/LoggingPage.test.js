import React from 'react'
import { render, screen } from '@testing-library/react'
import LoggingPage from './LoggingPage'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import i18n from '../../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'

const permissions = [
  'https://jans.io/oauth/config/logging.readonly',
  'https://jans.io/oauth/config/logging.write',
  'https://jans.io/oauth/config/logging.delete',
]

const AUTH_STATE = {
  permissions: permissions,
}
const logging = {
  loggingLevel: 'TRACE',
  loggingLayout: 'text',
  httpLoggingEnabled: true,
  disableJdkLogger: false,
  enabledOAuthAuditLogging: false,
}
const LOGGING_STATE = {
  logging: logging,
  loading: false,
}

const store = createStore(
  combineReducers({
    authReducer: (state = AUTH_STATE) => state,
    loggingReducer: (state = LOGGING_STATE) => state,
    noReducer: (state = {}) => state,
  }),
)

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>{children}</Provider>
  </I18nextProvider>
)

it('Should render Acr page properly', () => {
  render(<LoggingPage />, {
    wrapper: Wrapper,
  })
  expect(screen.getByTestId('loggingLayout')).toHaveDisplayValue(
    logging.loggingLayout,
  )
  expect(screen.getByTestId('loggingLevel')).toHaveDisplayValue(
    logging.loggingLevel,
  )
  expect(screen.getByTestId('httpLoggingEnabled')).toBeChecked()
  expect(screen.getByTestId('disableJdkLogger')).not.toBeChecked()
  expect(screen.getByTestId('enabledOAuthAuditLogging')).not.toBeChecked()
})

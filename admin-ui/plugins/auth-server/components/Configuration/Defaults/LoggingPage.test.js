import React from 'react'
import { render, screen } from '@testing-library/react'
import LoggingPage from './LoggingPage'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

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

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = AUTH_STATE) => state,
    loggingReducer: (state = LOGGING_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

it('Should render Acr page properly', () => {
  render(<LoggingPage />, {
    wrapper: Wrapper,
  })
  expect(screen.getByTestId('loggingLayout')).toHaveDisplayValue(logging.loggingLayout)
  expect(screen.getByTestId('loggingLevel')).toHaveDisplayValue(logging.loggingLevel)
  expect(screen.getByTestId('httpLoggingEnabled')).toBeChecked()
  expect(screen.getByTestId('disableJdkLogger')).not.toBeChecked()
  expect(screen.getByTestId('enabledOAuthAuditLogging')).not.toBeChecked()
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import LoggingPage from './LoggingPage'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Logging } from 'JansConfigApi'

jest.mock('./hooks', () => ({
  useLoggingConfig: jest.fn(),
  useUpdateLoggingConfig: jest.fn(),
}))

const permissions = [
  'https://jans.io/oauth/config/logging.readonly',
  'https://jans.io/oauth/config/logging.write',
  'https://jans.io/oauth/config/logging.delete',
]

const AUTH_STATE = {
  permissions: permissions,
  token: {
    access_token: 'test-token',
  },
  config: {
    clientId: 'test-client-id',
  },
  userinfo: {
    inum: 'test-inum',
    name: 'Test User',
  },
}

const logging: Logging = {
  loggingLevel: 'TRACE',
  loggingLayout: 'text',
  httpLoggingEnabled: true,
  disableJdkLogger: false,
  enabledOAuthAuditLogging: false,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = AUTH_STATE) => state,
    cedarPermissions: (state = { permissions: {} }) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

interface WrapperProps {
  children: React.ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => (
  <AppTestWrapper>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  </AppTestWrapper>
)

it('Should render Logging page properly', () => {
  const { useLoggingConfig, useUpdateLoggingConfig } = require('./hooks')

  useLoggingConfig.mockReturnValue({
    data: logging,
    isLoading: false,
    error: null,
  })

  useUpdateLoggingConfig.mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
  })

  render(<LoggingPage />, {
    wrapper: Wrapper,
  })

  expect(screen.getByTestId('loggingLayout')).toHaveDisplayValue(logging.loggingLayout)
  expect(screen.getByTestId('loggingLevel')).toHaveDisplayValue(logging.loggingLevel)
  expect(screen.getByTestId('httpLoggingEnabled')).toBeChecked()
  expect(screen.getByTestId('disableJdkLogger')).not.toBeChecked()
  expect(screen.getByTestId('enabledOAuthAuditLogging')).not.toBeChecked()
})

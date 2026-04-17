import React from 'react'
import { render, screen } from '@testing-library/react'
import { ClientAddPage } from 'Plugins/auth-server/components/OidcClients'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the hooks used by ClientAddPage directly
jest.mock('Plugins/auth-server/components/OidcClients/hooks', () => ({
  useCreateClient: jest.fn(() => ({
    createClient: jest.fn(),
    isCreating: false,
  })),
  useClientScripts: jest.fn(() => ({
    scripts: [],
    isLoading: false,
    isError: false,
  })),
  useOidcProperties: jest.fn(() => ({
    oidcConfiguration: undefined,
    isLoading: false,
    isError: false,
  })),
}))

// Mock ClientWizardForm to keep this test focused on page-level behaviour
jest.mock('Plugins/auth-server/components/OidcClients/components/ClientWizardForm', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="client-wizard-form" />),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
]

const INIT_STATE = {
  permissions,
  userinfo: { inum: 'test-user-inum' },
  hasSession: true,
  config: { clientId: 'test-client-id' },
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    cedarPermissions: (
      state = {
        permissions: {},
        loading: false,
        error: null,
        initialized: false,
        isInitializing: false,
      },
    ) => state,
    webhookReducer: (state = { webhookModal: false }) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>
        <Provider store={store}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
}

it('Should render the client add page and mount the wizard form', () => {
  render(<ClientAddPage />, { wrapper: Wrapper })
  expect(screen.getByTestId('client-wizard-form')).toBeInTheDocument()
})

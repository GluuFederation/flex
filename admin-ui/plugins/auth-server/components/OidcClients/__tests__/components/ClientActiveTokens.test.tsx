import React from 'react'
import { render } from '@testing-library/react'
import ClientActiveTokens from 'Plugins/auth-server/components/OidcClients/components/ClientActiveTokens'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('Plugins/auth-server/components/OidcClients/hooks', () => ({
  useClientTokens: jest.fn(() => ({
    rows: [],
    totalItems: 0,
    isLoading: false,
    revokeToken: jest.fn(),
    refetch: jest.fn(),
  })),
}))

const INIT_STATE = {
  permissions: ['https://jans.io/oauth/config/openid/clients.readonly'],
  userinfo: { inum: 'test-user-inum' },
  hasSession: true,
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
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>
        <Provider store={store}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
}

const mockClient = { inum: '0008-0DB1' }

it('Should render the active tokens table without crashing', () => {
  const { container } = render(<ClientActiveTokens client={mockClient} />, { wrapper: Wrapper })
  expect(container).toBeTruthy()
})

it('Should render with loading state when isLoading is true', () => {
  const { useClientTokens } = jest.requireMock(
    'Plugins/auth-server/components/OidcClients/hooks',
  ) as { useClientTokens: jest.Mock }
  useClientTokens.mockReturnValueOnce({
    rows: [],
    totalItems: 0,
    isLoading: true,
    revokeToken: jest.fn(),
    refetch: jest.fn(),
  })

  const { container } = render(<ClientActiveTokens client={mockClient} />, { wrapper: Wrapper })
  expect(container).toBeTruthy()
})

it('Should render with client having no inum gracefully', () => {
  const { container } = render(<ClientActiveTokens client={{}} />, { wrapper: Wrapper })
  expect(container).toBeTruthy()
})

it('Should call onExportReady callback if provided', () => {
  const onExportReady = jest.fn()
  render(<ClientActiveTokens client={mockClient} onExportReady={onExportReady} />, {
    wrapper: Wrapper,
  })
  // onExportReady is called with the export function after mount
  expect(onExportReady).toHaveBeenCalledWith(expect.any(Function))
})

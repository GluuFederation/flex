import React from 'react'
import { render, screen } from '@testing-library/react'
import AttributeAddPage from 'Plugins/schema/components/Person/AttributeAddPage'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

// Mock the JansConfigApi hooks
jest.mock('JansConfigApi', () => ({
  usePostAttributes: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  getGetAttributesQueryKey: jest.fn(() => ['attributes']),
  JansAttribute: {},
}))

const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const INIT_STATE = {
  permissions: permissions,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
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

const Wrapper = ({ children }) => (
  <AppTestWrapper>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
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

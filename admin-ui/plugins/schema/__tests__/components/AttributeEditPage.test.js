import React from 'react'
import { render, screen } from '@testing-library/react'
import AttributeEditPage from 'Plugins/schema/components/Person/AttributeEditPage'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import attributes from '../../utils/attributes'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    gid: ':' + attributes[0].inum,
  }),
}))

// Mock the JansConfigApi hooks
jest.mock('JansConfigApi', () => ({
  useGetAttributesByInum: jest.fn(() => ({
    data: attributes[0],
    isLoading: false,
    error: null,
  })),
  usePutAttributes: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  getGetAttributesQueryKey: jest.fn(() => ['attributes']),
  getGetAttributesByInumQueryKey: jest.fn(() => ['attributes', attributes[0].inum]),
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

it('Should render the attribute edit page properly', () => {
  render(<AttributeEditPage />, { wrapper: Wrapper })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Status/)
  screen.getByText(/Edit Type/)
  screen.getByText(/View Type/)
  screen.getByText(/Usage Type/)
})

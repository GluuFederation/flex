import React from 'react'
import { render, screen } from '@testing-library/react'
import AttributeListPage from 'Plugins/schema/components/Person/AttributeListPage'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import attributes from '../../utils/attributes'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

// Mock the JansConfigApi hooks
jest.mock('JansConfigApi', () => ({
  useGetAttributes: jest.fn(() => ({
    data: {
      entries: [attributes[0]],
      totalEntriesCount: 1,
      entriesCount: 1,
    },
    isLoading: false,
    error: null,
  })),
  useDeleteAttributesByInum: jest.fn(() => ({
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
    cedarPermissions: (state = { permissions: [] }) => state,
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

it('Should render the attribute list page properly', () => {
  render(<AttributeListPage />, {
    wrapper: Wrapper,
  })
  const inum = attributes[0].inum
  const displayName = attributes[0].displayName
  screen.getByText(/Inum/i)
  screen.getByText(/Display Name/)
  screen.getByText(/Status/)
  screen.getByText(inum)
  screen.getByText(displayName)
})

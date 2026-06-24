import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import ConfigApiPropertiesPage from '../../components/ConfigApiPropertiesPage'
import type { ApiAppConfiguration } from '../../types'

type MockQueryResult = {
  data: ApiAppConfiguration | undefined
  isLoading: boolean
  error: { message: string } | null
  refetch: () => void
}

const mockHasCedarReadPermission = jest.fn(() => true)
const mockUseGetConfigApiProperties = jest.fn<MockQueryResult, []>(() => ({
  data: undefined,
  isLoading: false,
  error: null,
  refetch: jest.fn(),
}))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: mockHasCedarReadPermission,
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { ConfigApiConfiguration: 'ConfigApiConfiguration' },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { ConfigApiConfiguration: 'ConfigApiConfiguration' },
  CEDAR_RESOURCE_SCOPES: { ConfigApiConfiguration: ['read', 'write'] },
}))

jest.mock('JansConfigApi', () => ({
  useGetConfigApiProperties: () => mockUseGetConfigApiProperties(),
  usePatchConfigApiProperties: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
}))

jest.mock('../../utils/useConfigApiActions', () => ({
  useConfigApiActions: () => ({
    logConfigApiUpdate: jest.fn(),
  }),
}))

jest.mock('../../components/ConfigApiPropertiesForm', () => {
  const MockForm = () => <div data-testid="config-api-properties-form">Mock Form</div>
  MockForm.displayName = 'MockConfigApiPropertiesForm'
  return MockForm
})

const createStore = () =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { hasSession: true, permissions: [], config: {} }) => state,
      cedarPermissions: (state = { initialized: true }) => state,
      noReducer: (state = {}) => state,
    }),
  })

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    <AppTestWrapper>
      <Provider store={createStore()}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('ConfigApiPropertiesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockHasCedarReadPermission.mockReturnValue(true)
    mockUseGetConfigApiProperties.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
  })

  it('renders without crashing and shows the form when permitted', () => {
    render(<ConfigApiPropertiesPage />, { wrapper: Wrapper })
    expect(screen.getByTestId('config-api-properties-form')).toBeInTheDocument()
  })

  it('renders the search toolbar', () => {
    render(<ConfigApiPropertiesPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Search/i)).toBeInTheDocument()
  })

  it('renders the form when configuration data is provided', () => {
    mockUseGetConfigApiProperties.mockReturnValue({
      data: { apiApprovedIssuer: ['issuer1'] },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
    render(<ConfigApiPropertiesPage />, { wrapper: Wrapper })
    expect(screen.getByTestId('config-api-properties-form')).toBeInTheDocument()
  })

  it('hides the form and shows the missing permission view when read is denied', () => {
    mockHasCedarReadPermission.mockReturnValue(false)
    render(<ConfigApiPropertiesPage />, { wrapper: Wrapper })
    expect(screen.queryByTestId('config-api-properties-form')).not.toBeInTheDocument()
    expect(screen.getByTestId('MISSING')).toBeInTheDocument()
  })

  it('renders an error message when the query returns an error', () => {
    mockUseGetConfigApiProperties.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Boom' },
      refetch: jest.fn(),
    })
    render(<ConfigApiPropertiesPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Boom/i)).toBeInTheDocument()
    expect(screen.queryByTestId('config-api-properties-form')).not.toBeInTheDocument()
  })
})

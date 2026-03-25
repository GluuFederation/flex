import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import PersistenceDetail from 'Plugins/services/Components/Configuration/PersistenceDetail'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Persistence: 'Persistence' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Persistence: [] },
}))

const mockPersistenceData = {
  persistenceType: 'sql',
  databaseName: 'jansdb',
  schemaName: 'public',
  productName: 'PostgreSQL',
  productVersion: '15.4',
  driverName: 'PostgreSQL JDBC Driver',
  driverVersion: '42.6.0',
}

jest.mock('JansConfigApi', () => ({
  useGetPropertiesPersistence: jest.fn(() => ({
    data: mockPersistenceData,
    isLoading: false,
  })),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { permissions: [] }) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('PersistenceDetail', () => {
  beforeEach(() => {
    queryClient.clear()
    jest.requireMock('@/cedarling').useCedarling.mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
    }))
    jest.requireMock('JansConfigApi').useGetPropertiesPersistence.mockImplementation(() => ({
      data: mockPersistenceData,
      isLoading: false,
    }))
  })

  it('renders without crashing', () => {
    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    const databaseNameInput = document.querySelector('input[name="databaseName"]')
    expect(databaseNameInput).toBeInTheDocument()
  })

  it('renders database name with correct value', () => {
    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="databaseName"]')
    expect(input).toHaveValue('jansdb')
  })

  it('renders schema name with correct value', () => {
    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="schemaName"]')
    expect(input).toHaveValue('public')
  })

  it('renders product name with correct value', () => {
    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="productName"]')
    expect(input).toHaveValue('PostgreSQL')
  })

  it('renders product version with correct value', () => {
    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="productVersion"]')
    expect(input).toHaveValue('15.4')
  })

  it('renders driver name with correct value', () => {
    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="driverName"]')
    expect(input).toHaveValue('PostgreSQL JDBC Driver')
  })

  it('renders driver version with correct value', () => {
    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="driverVersion"]')
    expect(input).toHaveValue('42.6.0')
  })

  it('renders all fields as disabled', () => {
    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    const fields = [
      'databaseName',
      'schemaName',
      'productName',
      'productVersion',
      'driverName',
      'driverVersion',
    ]
    fields.forEach((name) => {
      const input = document.querySelector(`input[name="${name}"]`)
      expect(input).toBeDisabled()
    })
  })

  it('renders when user has no read permission', () => {
    jest.requireMock('@/cedarling').useCedarling.mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => false),
      hasCedarWritePermission: jest.fn(() => false),
      authorizeHelper: jest.fn(),
    }))

    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    expect(document.querySelector('[data-testid="MISSING"]')).toBeInTheDocument()
    expect(document.querySelector('input[name="databaseName"]')).not.toBeInTheDocument()
  })

  it('renders loading state', () => {
    jest.requireMock('JansConfigApi').useGetPropertiesPersistence.mockImplementation(() => ({
      data: undefined,
      isLoading: true,
    }))

    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    expect(document.querySelector('[aria-busy="true"]')).toBeInTheDocument()
  })

  it('renders with empty config', () => {
    jest.requireMock('JansConfigApi').useGetPropertiesPersistence.mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }))

    render(
      <Wrapper>
        <PersistenceDetail />
      </Wrapper>,
    )

    const input = document.querySelector('input[name="databaseName"]')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })
})

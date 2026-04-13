import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import KeysPage from './KeysPage'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { formatDate } from '@/utils/dayjsUtils'
import {
  mockJwksConfig,
  mockJwksConfigWithZeroExp,
  mockEmptyJwksConfig,
} from './__tests__/fixtures/jwkTestData'
import { DATE_FORMAT } from './constants'
import { useJwkApi } from './hooks'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Keys: 'Keys', Lock: 'Lock', Webhooks: 'Webhooks' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { Keys: [], Lock: [], Webhooks: [] },
}))

jest.mock('./hooks', () => ({
  useJwkApi: jest.fn(() => ({
    jwks: mockJwksConfig,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useJwkActions: jest.fn(() => ({
    navigateToKeysList: jest.fn(),
  })),
}))

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const mockedUseJwkApi = useJwkApi as jest.Mock
const firstKey = mockJwksConfig.keys?.[0]
const firstKeyName = firstKey?.name ?? 'Unnamed Key'

describe('KeysPage', () => {
  beforeEach(() => {
    mockedUseJwkApi.mockReturnValue({
      jwks: mockJwksConfig,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
  })

  it('renders the page title and section heading', () => {
    render(<KeysPage />, { wrapper: Wrapper })
    expect(screen.getByText(/JSON Web Keys/)).toBeInTheDocument()
  })

  it('renders accordion headers for each key', () => {
    render(<KeysPage />, { wrapper: Wrapper })
    expect(screen.getByText(firstKeyName)).toBeInTheDocument()
  })

  it('renders key fields when accordion is expanded', () => {
    render(<KeysPage />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText(firstKeyName))

    expect(screen.getByTestId('x5c')).toHaveValue(firstKey?.x5c?.[0] ?? '')
    expect(screen.getByTestId('kid')).toHaveValue(firstKey?.kid ?? '')
    expect(screen.getByTestId('kty')).toHaveValue(firstKey?.kty ?? '')
    expect(screen.getByTestId('use')).toHaveValue(firstKey?.use ?? '')
    expect(screen.getByTestId('alg')).toHaveValue(firstKey?.alg ?? '')

    const expectedExp = firstKey?.exp != null ? formatDate(firstKey.exp, DATE_FORMAT) : ''
    expect(screen.getByTestId('exp')).toHaveValue(expectedExp)
  })

  it('handles exp=0 edge case', () => {
    mockedUseJwkApi.mockReturnValue({
      jwks: mockJwksConfigWithZeroExp,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<KeysPage />, { wrapper: Wrapper })
    const keyName = mockJwksConfigWithZeroExp.keys?.[0]?.name ?? 'Unnamed Key'
    fireEvent.click(screen.getByText(keyName))

    expect(screen.getByTestId('exp')).toHaveValue('1970-Jan-01')
  })

  it('shows empty state when no keys', () => {
    mockedUseJwkApi.mockReturnValue({
      jwks: mockEmptyJwksConfig,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<KeysPage />, { wrapper: Wrapper })
    expect(screen.getByText(/no.*found/i)).toBeInTheDocument()
  })

  it('shows error state on API failure', () => {
    mockedUseJwkApi.mockReturnValue({
      jwks: undefined,
      isLoading: false,
      error: new Error('Failed to fetch'),
      refetch: jest.fn(),
    })

    render(<KeysPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument()
  })

  it('handles undefined exp gracefully', () => {
    const keys = mockJwksConfig.keys ?? []
    mockedUseJwkApi.mockReturnValue({
      jwks: { keys: [{ ...keys[0], exp: undefined }] },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<KeysPage />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText(firstKeyName))

    expect(screen.getByTestId('exp')).toHaveValue('')
  })

  it('handles null exp gracefully', () => {
    const keys = mockJwksConfig.keys ?? []
    mockedUseJwkApi.mockReturnValue({
      jwks: { keys: [{ ...keys[0], exp: null }] },
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<KeysPage />, { wrapper: Wrapper })
    fireEvent.click(screen.getByText(firstKeyName))

    expect(screen.getByTestId('exp')).toHaveValue('')
  })
})

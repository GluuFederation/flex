import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
} from '../../__tests__/helpers/authenticationTestUtils'
import AcrsEditPage from '../AcrsEditPage'
import type { AuthNItem } from '../../types'
import {
  mockAuthenticationItem,
  mockBuiltInAuthenticationItem,
} from '../../__tests__/fixtures/mockAuthenticationData'

type LocationState = { authnTab: number; selectedItem: AuthNItem | null }
const mockUseLocation = jest.fn<{ state: LocationState; pathname: string }, []>(() => ({
  state: { authnTab: 2, selectedItem: null },
  pathname: '/auth-server/authn/edit/test',
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation(),
}))

jest.mock('JansConfigApi', () => ({
  usePutAcrs: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  usePutConfigDatabaseLdap: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  usePutConfigScripts: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useGetAcrs: jest.fn(() => ({
    data: { defaultAcr: 'simple_password_auth' },
    isLoading: false,
  })),
}))

describe('AcrsEditPage', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  it('shows "No item selected" when no item is in location state', () => {
    mockUseLocation.mockReturnValue({
      state: { authnTab: 2, selectedItem: null },
      pathname: '/auth-server/authn/edit/test',
    })
    render(<AcrsEditPage />, { wrapper: Wrapper })
    expect(screen.getByText(/No item selected/i)).toBeInTheDocument()
  })

  it('renders AcrsForm when a script item is in location state', () => {
    mockUseLocation.mockReturnValue({
      state: { authnTab: 2, selectedItem: mockAuthenticationItem },
      pathname: '/auth-server/authn/edit/test',
    })
    render(<AcrsEditPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Level/i)).toBeInTheDocument()
  })

  it('renders AcrsForm when a built-in item is in location state', () => {
    mockUseLocation.mockReturnValue({
      state: { authnTab: 2, selectedItem: mockBuiltInAuthenticationItem },
      pathname: '/auth-server/authn/edit/test',
    })
    render(<AcrsEditPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Level/i)).toBeInTheDocument()
  })
})

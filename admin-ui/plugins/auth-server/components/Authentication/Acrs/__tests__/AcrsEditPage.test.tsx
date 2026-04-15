import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
} from '../../__tests__/helpers/authenticationTestUtils'
import AcrsEditPage from '../AcrsEditPage'
import { useAtomValue } from 'jotai'
import {
  mockAuthenticationItem,
  mockBuiltInAuthenticationItem,
} from '../../__tests__/fixtures/mockAuthenticationData'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({
    state: { authnTab: 2 },
    pathname: '/auth-server/authn/edit/test',
  })),
}))

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useSetAtom: jest.fn(() => jest.fn()),
  useAtomValue: jest.fn(() => null),
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

  it('shows "No item selected" when no atom item is set', () => {
    jest.mocked(useAtomValue).mockReturnValue(null)
    render(<AcrsEditPage />, { wrapper: Wrapper })
    expect(screen.getByText(/No item selected/i)).toBeInTheDocument()
  })

  it('renders AcrsForm when a script item is selected', () => {
    jest.mocked(useAtomValue).mockReturnValue(mockAuthenticationItem)
    render(<AcrsEditPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Level/i)).toBeInTheDocument()
  })

  it('renders AcrsForm when a built-in item is selected', () => {
    jest.mocked(useAtomValue).mockReturnValue(mockBuiltInAuthenticationItem)
    render(<AcrsEditPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Level/i)).toBeInTheDocument()
  })
})

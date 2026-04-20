import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
} from '../../__tests__/helpers/authenticationTestUtils'
import Acrs from '../Acrs'
import { useCedarling } from '@/cedarling'
import type { UseCedarlingReturn } from '@/cedarling'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(),
  ADMIN_UI_RESOURCES: {
    Authentication: 'Authentication',
  },
  CEDAR_RESOURCE_SCOPES: { Authentication: [] },
}))

const makeMockCedarling = (overrides?: Partial<UseCedarlingReturn>): UseCedarlingReturn =>
  ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn().mockResolvedValue([]),
    authorize: jest.fn().mockResolvedValue({ decision: 'ALLOW', person_id: '' }),
    isLoading: false,
    error: null,
    ...overrides,
  }) as Partial<UseCedarlingReturn> as UseCedarlingReturn

describe('Acrs — ACRs tab (isBuiltIn=false)', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  it('renders the ACR list table with column headers', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getByText('ACR', { exact: true })).toBeInTheDocument()
    expect(screen.getByText('Level', { exact: true })).toBeInTheDocument()
  })

  it('renders LDAP-based ACR entry in the table', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getByText('test-ldap')).toBeInTheDocument()
  })

  it('renders script-based ACR entry in the table', () => {
    render(<Acrs />, { wrapper: Wrapper })
    expect(screen.getByText('test_otp')).toBeInTheDocument()
  })
})

describe('Acrs — Built-In ACRs tab (isBuiltIn=true)', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  it('renders the built-in ACR list with simple_password_auth', () => {
    render(<Acrs isBuiltIn={true} />, { wrapper: Wrapper })
    expect(screen.getByText('simple_password_auth')).toBeInTheDocument()
  })

  it('renders table column headers for built-in mode', () => {
    render(<Acrs isBuiltIn={true} />, { wrapper: Wrapper })
    expect(screen.getAllByText(/ACR/i)[0]).toBeInTheDocument()
    expect(screen.getByText(/Level/i)).toBeInTheDocument()
    expect(screen.getByText(/Default/i)).toBeInTheDocument()
  })

  it('does not render edit action when user lacks write permission', () => {
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarWritePermission: jest.fn(() => false) }))
    render(<Acrs isBuiltIn={true} />, { wrapper: Wrapper })
    expect(screen.queryByTitle(/Edit AuthN/i)).not.toBeInTheDocument()
  })
})

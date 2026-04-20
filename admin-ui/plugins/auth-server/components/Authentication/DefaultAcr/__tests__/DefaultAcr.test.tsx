import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  createAuthenticationTestStore,
  createAuthenticationTestWrapper,
} from '../../__tests__/helpers/authenticationTestUtils'
import DefaultAcr from '../DefaultAcr'
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

describe('DefaultAcr', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    const store = createAuthenticationTestStore()
    Wrapper = createAuthenticationTestWrapper(store)
  })

  it('renders the Default ACR form', () => {
    render(<DefaultAcr />, { wrapper: Wrapper })
    expect(screen.getByText(/Default Authentication Method/i)).toBeInTheDocument()
  })

  it('renders form footer buttons when user has write permission', () => {
    render(<DefaultAcr />, { wrapper: Wrapper })
    expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
  })

  it('does not render form footer buttons when user lacks write permission', () => {
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarWritePermission: jest.fn(() => false) }))
    render(<DefaultAcr />, { wrapper: Wrapper })
    expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
  })
})

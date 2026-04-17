import React from 'react'
import { render, screen } from '@testing-library/react'
import { createSsaTestStore, createSsaTestWrapper } from '../helpers/ssaTestUtils'
import { SsaListPage } from '../..'
import { useCedarling } from '@/cedarling'
import type { UseCedarlingReturn } from '@/cedarling'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(),
  ADMIN_UI_RESOURCES: {
    SSA: 'SSA',
  },
  CEDAR_RESOURCE_SCOPES: { SSA: [] },
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

describe('SsaListPage', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    const store = createSsaTestStore()
    Wrapper = createSsaTestWrapper(store)
  })

  it('renders the SSA list page with search', () => {
    render(<SsaListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Search/i)).toBeInTheDocument()
  })

  it('renders Add SSA button when user has write permission', () => {
    render(<SsaListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Add SSA/i)).toBeInTheDocument()
  })

  it('does not render Add SSA button when user lacks write permission', () => {
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarWritePermission: jest.fn(() => false) }))
    render(<SsaListPage />, { wrapper: Wrapper })
    expect(screen.queryByText(/Add SSA/i)).not.toBeInTheDocument()
  })
})

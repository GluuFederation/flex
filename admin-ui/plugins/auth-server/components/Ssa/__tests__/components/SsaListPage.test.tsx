import React from 'react'
import { render, screen } from '@testing-library/react'
import { createSsaTestStore, createSsaTestWrapper } from '../helpers/ssaTestUtils'
import SsaListPage from '../../components/SsaListPage'
import { useCedarling } from '@/cedarling'
import type { UseCedarlingReturn } from '@/cedarling'

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
  }) as unknown as UseCedarlingReturn

describe('SsaListPage', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    const store = createSsaTestStore()
    Wrapper = createSsaTestWrapper(store)
  })

  it('renders the SSA list page with search', () => {
    render(<SsaListPage />, { wrapper: Wrapper })
    expect(screen.getByText(/Search/i)).toBeInTheDocument()
  })

  it('renders Add SSA button when user has write permission', () => {
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
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

import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementTestWrapper,
} from 'Plugins/user-management/__tests__/helpers/userManagementTestUtils'
import UserList from 'Plugins/user-management/components/UserList'
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

describe('UserList', () => {
  let Wrapper: React.ComponentType<{ children: React.ReactNode }>

  beforeEach(() => {
    const store = createUserManagementTestStore()
    Wrapper = createUserManagementTestWrapper(store)
  })

  it('renders the user list page with search', () => {
    render(<UserList />, { wrapper: Wrapper })
    expect(screen.getByText(/Search/i)).toBeInTheDocument()
  })

  it('renders Add user button when user has write permission', () => {
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    render(<UserList />, { wrapper: Wrapper })
    expect(screen.getByText(/Add user/i)).toBeInTheDocument()
  })

  it('does not render Add user button when user lacks write permission', () => {
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarWritePermission: jest.fn(() => false) }))
    render(<UserList />, { wrapper: Wrapper })
    expect(screen.queryByText(/Add user/i)).not.toBeInTheDocument()
  })
})

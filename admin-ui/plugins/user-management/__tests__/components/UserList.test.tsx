import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementTestWrapper,
} from 'Plugins/user-management/__tests__/helpers/userManagementTestUtils'
import UserList from 'Plugins/user-management/components/UserList'
import { useGetUser } from 'JansConfigApi'
import { useCedarling } from '@/cedarling'
import type { UseCedarlingReturn } from '@/cedarling'

const mockNavigateToRoute = jest.fn()
jest.mock('@/helpers/navigation', () => ({
  ...jest.requireActual('@/helpers/navigation'),
  useAppNavigation: () => ({ navigateToRoute: mockNavigateToRoute, navigateBack: jest.fn() }),
}))

const showOneUser = () =>
  (useGetUser as jest.Mock).mockReturnValue({
    data: {
      entries: [{ inum: 'user-1', userId: 'jdoe', displayName: 'John Doe', mail: 'j@x.org' }],
      totalEntriesCount: 1,
    },
    isLoading: false,
    refetch: jest.fn(),
  })

const makeMockCedarling = (overrides?: Partial<UseCedarlingReturn>): UseCedarlingReturn =>
  ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn().mockResolvedValue([]),
    isLoading: false,
    error: null,
    ...overrides,
  }) as UseCedarlingReturn

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

  it('shows the inum as the first column', () => {
    render(<UserList />, { wrapper: Wrapper })
    const headers = screen
      .getAllByRole('columnheader')
      .map((header) => header.textContent?.trim())
      .filter(Boolean)
    expect(headers[0]).toBe('Inum')
  })

  it('opens a user read-only from View and editable from Edit', () => {
    jest.mocked(useCedarling).mockReturnValue(makeMockCedarling())
    showOneUser()
    render(<UserList />, { wrapper: Wrapper })

    fireEvent.click(screen.getByRole('button', { name: 'View User' }))
    expect(mockNavigateToRoute).toHaveBeenLastCalledWith('/user/usermanagement/view/user-1', {
      state: { selectedUser: expect.objectContaining({ inum: 'user-1' }) },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Edit User' }))
    expect(mockNavigateToRoute).toHaveBeenLastCalledWith('/user/usermanagement/edit/user-1', {
      state: { selectedUser: expect.objectContaining({ inum: 'user-1' }) },
    })
  })

  it('offers View but not Edit without Users write', () => {
    jest
      .mocked(useCedarling)
      .mockReturnValue(makeMockCedarling({ hasCedarWritePermission: jest.fn(() => false) }))
    showOneUser()
    render(<UserList />, { wrapper: Wrapper })

    expect(screen.getByRole('button', { name: 'View User' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit User' })).not.toBeInTheDocument()
  })
})

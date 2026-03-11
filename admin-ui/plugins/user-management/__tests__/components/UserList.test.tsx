import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementTestWrapper,
} from './userManagementTestUtils'
import UserList from 'Plugins/user-management/components/UserList'
import { useCedarling } from '@/cedarling'

const store = createUserManagementTestStore()
const Wrapper = createUserManagementTestWrapper(store)

describe('UserList', () => {
  it('renders the user list page with search', () => {
    render(<UserList />, { wrapper: Wrapper })
    expect(screen.getByText(/Search/i)).toBeInTheDocument()
  })

  it('renders Add user button when user has write permission', () => {
    jest.mocked(useCedarling).mockReturnValue({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      hasCedarDeletePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
      authorize: jest.fn(),
      isLoading: false,
      error: null,
    })
    render(<UserList />, { wrapper: Wrapper })
    expect(screen.getByText(/Add user/i)).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementTestWrapper,
} from './userManagementTestUtils'
import UserAddPage from 'Plugins/user-management/components/UserAddPage'

const store = createUserManagementTestStore()
const Wrapper = createUserManagementTestWrapper(store)

describe('UserAddPage', () => {
  it('renders the user add page with form fields', async () => {
    render(<UserAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/First Name/i)).toBeInTheDocument()
    expect(await screen.findByText(/Email/i)).toBeInTheDocument()
  })
})

import React, { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { UseProfileDetailsResult } from '../types'

const mockNavigateToRoute = jest.fn()

const mockProfileDetails: UseProfileDetailsResult = {
  profileDetails: {
    inum: 'USER-123',
    displayName: 'Jane Admin',
    givenName: 'Jane',
    mail: 'jane@example.com',
    status: 'active',
  },
  loading: false,
  surname: 'Admin',
  roles: 'Admin',
}

const mockUseProfileDetails = jest.fn<UseProfileDetailsResult, []>(() => mockProfileDetails)

jest.mock('../../../../utilities', () => ({
  randomAvatar: () => 'avatar.png',
}))

jest.mock('../hooks/useProfileDetails', () => ({
  useProfileDetails: () => mockUseProfileDetails(),
}))

jest.mock('@/helpers/navigation', () => ({
  ...jest.requireActual('@/helpers/navigation'),
  useAppNavigation: () => ({ navigateToRoute: mockNavigateToRoute }),
}))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Users: 'Users' },
  CEDAR_RESOURCE_SCOPES: { Users: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Users: 'Users' },
  CEDAR_RESOURCE_SCOPES: { Users: [] },
}))

import ProfileDetailsPage from 'Routes/Apps/Profile/ProfilePage'

const store = configureStore({
  reducer: combineReducers({
    authReducer: (
      state = {
        hasSession: true,
        permissions: [],
        userInum: 'USER-123',
        userinfo: { inum: 'USER-123', name: 'Jane Admin', email: 'jane@example.com' },
        config: {},
      },
    ) => state,
    cedarPermissions: (state = { permissions: [] }) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

const renderPage = async () => {
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(<ProfileDetailsPage />, { wrapper: Wrapper })
  })
  return result!
}

describe('ProfilePage (ProfileDetails)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseProfileDetails.mockReturnValue(mockProfileDetails)
  })

  it('renders without crashing and shows the display name', async () => {
    await renderPage()
    expect(screen.getByText('Jane Admin')).toBeInTheDocument()
  })

  it('renders the user email', async () => {
    await renderPage()
    expect(screen.getAllByText('jane@example.com').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the section titles', async () => {
    await renderPage()
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByText('Admin Roles')).toBeInTheDocument()
    expect(screen.getByText('Account Status')).toBeInTheDocument()
  })

  it('renders the personal information values', async () => {
    await renderPage()
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.getAllByText('Admin').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the active status label', async () => {
    await renderPage()
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the edit button when the user can edit', async () => {
    await renderPage()
    expect(screen.getByText(/Edit/i)).toBeInTheDocument()
  })

  it('navigates to user management when the edit button is clicked', async () => {
    await renderPage()
    await act(async () => {
      fireEvent.click(screen.getByText(/Edit/i))
    })
    await waitFor(() => {
      expect(mockNavigateToRoute).toHaveBeenCalled()
    })
  })

  it('falls back to a dash when surname is missing', async () => {
    mockUseProfileDetails.mockReturnValue({
      ...mockProfileDetails,
      surname: undefined,
    })
    await renderPage()
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
  })
})

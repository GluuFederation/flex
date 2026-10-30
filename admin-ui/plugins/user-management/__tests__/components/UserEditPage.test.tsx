import { render, screen, waitFor } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementQueryClient,
  createUserManagementTestWrapper,
} from 'Plugins/user-management/__tests__/helpers/userManagementTestUtils'
import UserEditPage from 'Plugins/user-management/components/UserEditPage'
import { ROUTES } from '@/helpers/navigation'
import { useCedarling } from '@/cedarling'
import { useGetUserByInum } from 'JansConfigApi'

const mockMatchedPattern = { current: '' }
const mockSelectedUser = {
  inum: 'test-inum-123',
  userId: 'testuser',
  displayName: 'Test User',
  mail: 'test@example.com',
  dn: 'dn=test',
}
const mockLocationState: { current: { selectedUser?: typeof mockSelectedUser } | null } = {
  current: { selectedUser: mockSelectedUser },
}
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useMatch: (pattern: string) => (pattern === mockMatchedPattern.current ? { params: {} } : null),
  useParams: jest.fn(() => ({ id: 'test-inum-123' })),
  useLocation: jest.fn(() => ({ state: mockLocationState.current })),
}))

const mockNavigateBack = jest.fn()
jest.mock('@/helpers/navigation', () => ({
  ...jest.requireActual('@/helpers/navigation'),
  useAppNavigation: () => ({ navigateBack: mockNavigateBack, navigateToRoute: jest.fn() }),
}))

const store = createUserManagementTestStore()
const queryClient = createUserManagementQueryClient()
const Wrapper = createUserManagementTestWrapper(store, queryClient)

describe('UserEditPage', () => {
  afterEach(() => {
    queryClient.clear()
    mockMatchedPattern.current = ''
    mockLocationState.current = { selectedUser: mockSelectedUser }
    mockNavigateBack.mockClear()
    ;(useGetUserByInum as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetched: false,
    })
  })

  it('loads the user from the route id when there is no navigation state', async () => {
    mockLocationState.current = null
    mockMatchedPattern.current = ROUTES.USER_VIEW_TEMPLATE
    ;(useGetUserByInum as jest.Mock).mockReturnValue({
      data: mockSelectedUser,
      isLoading: false,
      isFetched: true,
    })
    render(<UserEditPage />, { wrapper: Wrapper })
    expect(await screen.findByTestId('displayName')).toHaveValue('Test User')
    expect(useGetUserByInum).toHaveBeenCalledWith('test-inum-123', {
      query: { enabled: true },
    })
    expect(mockNavigateBack).not.toHaveBeenCalled()
  })

  it('goes back to the list when the route id matches no user', async () => {
    mockLocationState.current = null
    ;(useGetUserByInum as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetched: true,
    })
    render(<UserEditPage />, { wrapper: Wrapper })
    await waitFor(() => expect(mockNavigateBack).toHaveBeenCalledWith(ROUTES.USER_MANAGEMENT))
  })

  it('renders the user edit page with form fields', async () => {
    render(<UserEditPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/First Name/i)).toBeInTheDocument()
    expect(await screen.findByText(/Email/i)).toBeInTheDocument()
  })

  it('opens editable on the edit route', async () => {
    render(<UserEditPage />, { wrapper: Wrapper })
    expect(await screen.findByTestId('givenName')).not.toBeDisabled()
    expect(screen.getByText(/Apply/i)).toBeInTheDocument()
  })

  it('opens read-only on the view route', async () => {
    mockMatchedPattern.current = ROUTES.USER_VIEW_TEMPLATE
    render(<UserEditPage />, { wrapper: Wrapper })
    expect(await screen.findByTestId('givenName')).toBeDisabled()
    expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
  })

  it('falls back to read-only on the edit route without Users write', async () => {
    const cedarling = jest.mocked(useCedarling)
    const defaultImplementation = cedarling.getMockImplementation()
    cedarling.mockImplementation(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => false),
      hasCedarDeletePermission: jest.fn(() => false),
      authorizeHelper: jest.fn().mockResolvedValue([]),
    }))
    try {
      render(<UserEditPage />, { wrapper: Wrapper })
      expect(await screen.findByTestId('givenName')).toBeDisabled()
    } finally {
      cedarling.mockImplementation(defaultImplementation)
    }
  })
})

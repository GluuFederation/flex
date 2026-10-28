import { render, screen } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementQueryClient,
  createUserManagementTestWrapper,
} from 'Plugins/user-management/__tests__/helpers/userManagementTestUtils'
import UserEditPage from 'Plugins/user-management/components/UserEditPage'
import { ROUTES } from '@/helpers/navigation'
import { useCedarling } from '@/cedarling'

const mockMatchedPattern = { current: '' }
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useMatch: (pattern: string) => (pattern === mockMatchedPattern.current ? { params: {} } : null),
  useParams: jest.fn(() => ({ id: 'test-inum-123' })),
  useLocation: jest.fn(() => ({
    state: {
      selectedUser: {
        inum: 'test-inum-123',
        userId: 'testuser',
        displayName: 'Test User',
        mail: 'test@example.com',
        dn: 'dn=test',
      },
    },
  })),
}))

const store = createUserManagementTestStore()
const queryClient = createUserManagementQueryClient()
const Wrapper = createUserManagementTestWrapper(store, queryClient)

describe('UserEditPage', () => {
  afterEach(() => {
    queryClient.clear()
    mockMatchedPattern.current = ''
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

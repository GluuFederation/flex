import { render, screen } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementQueryClient,
  createUserManagementTestWrapper,
} from 'Plugins/user-management/__tests__/helpers/userManagementTestUtils'
import UserEditPage from 'Plugins/user-management/components/UserEditPage'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
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
  })

  it('renders the user edit page with form fields', async () => {
    render(<UserEditPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/First Name/i)).toBeInTheDocument()
    expect(await screen.findByText(/Email/i)).toBeInTheDocument()
  })
})

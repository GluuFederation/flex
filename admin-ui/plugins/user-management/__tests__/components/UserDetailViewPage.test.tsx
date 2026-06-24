import { render, screen } from '@testing-library/react'
import {
  createUserManagementTestStore,
  createUserManagementQueryClient,
  createUserManagementTestWrapper,
} from 'Plugins/user-management/__tests__/helpers/userManagementTestUtils'
import UserDetailViewPage from 'Plugins/user-management/components/UserDetailViewPage'
import type { RowProps } from 'Plugins/user-management/types/UserApiTypes'

const store = createUserManagementTestStore()
const queryClient = createUserManagementQueryClient()
const Wrapper = createUserManagementTestWrapper(store, queryClient)

const baseRow: RowProps['row'] = {
  rowData: {
    displayName: 'Test User',
    mail: 'test@example.com',
    givenName: 'Test',
    userId: 'testuser',
    customAttributes: [
      { name: 'jansAdminUIRole', values: ['api-admin', 'cb-admin'] },
      { name: 'sn', values: ['Doe'] },
    ],
  },
}

describe('UserDetailViewPage', () => {
  afterEach(() => {
    queryClient.clear()
  })

  it('renders without crashing', () => {
    render(<UserDetailViewPage row={baseRow} />, { wrapper: Wrapper })
    expect(screen.getByText('Name:')).toBeInTheDocument()
  })

  it('renders all field labels', () => {
    render(<UserDetailViewPage row={baseRow} />, { wrapper: Wrapper })
    expect(screen.getByText('Name:')).toBeInTheDocument()
    expect(screen.getByText('Email:')).toBeInTheDocument()
    expect(screen.getByText('Given Name:')).toBeInTheDocument()
    expect(screen.getByText('Jans Admin UI Role:')).toBeInTheDocument()
    expect(screen.getByText('User Name:')).toBeInTheDocument()
    expect(screen.getByText('Last Name:')).toBeInTheDocument()
  })

  it('populates field values from rowData', () => {
    render(<UserDetailViewPage row={baseRow} />, { wrapper: Wrapper })
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('joins multiple admin UI role values with comma', () => {
    render(<UserDetailViewPage row={baseRow} />, { wrapper: Wrapper })
    expect(screen.getByText('api-admin, cb-admin')).toBeInTheDocument()
  })

  it('renders em dash placeholder for empty values', () => {
    const emptyRow: RowProps['row'] = {
      rowData: {
        displayName: '',
        mail: '',
        givenName: '',
        userId: '',
        customAttributes: [],
      },
    }
    render(<UserDetailViewPage row={emptyRow} />, { wrapper: Wrapper })
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
  })
})

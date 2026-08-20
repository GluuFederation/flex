import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import PolicyStoreHistoryPage from 'Plugins/admin/components/Cedarling/PolicyStoreHistoryPage'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginListenersResolver', () => ({ __esModule: true, default: jest.fn() }))

// jest.mock factories are hoisted above const declarations, so these objects must be inlined.
jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Security: 'Security', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Security: [], Webhooks: [] },
}))
jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Security: 'Security', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Security: [], Webhooks: [] },
}))
jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: jest.fn(() => ({ canRead: true, canWrite: true, canDelete: true })),
}))

const mockActiveStore = {
  inum: 'active-1',
  displayname: 'current-policies.cjar',
  description: 'Live policies',
  jansStatus: 'active',
  creationDate: '2026-07-14T10:15:30.000Z',
  jansUsrDN: 'inum=admin-user,ou=people,o=jans',
  policyStore: btoa('active-archive-bytes'),
}

const mockBackupStore = {
  inum: 'backup-1',
  displayname: 'previous-policies.cjar',
  description: 'Kept as a rollback point',
  jansStatus: 'inactive',
  creationDate: '2026-07-01T09:00:00.000Z',
  jansUsrDN: 'inum=other-user,ou=people,o=jans',
  policyStore: btoa('backup-archive-bytes'),
}

const mockEditMutate = jest.fn().mockResolvedValue(undefined)
const mockDeleteMutate = jest.fn().mockResolvedValue(undefined)

jest.mock('JansConfigApi', () => ({
  useGetAdminuiPolicyStore: jest.fn(() => ({
    data: { entries: [mockActiveStore, mockBackupStore], totalEntriesCount: 2 },
    isLoading: false,
    isFetching: false,
    refetch: jest.fn(),
  })),
  useCreateAdminuiPolicyStore: jest.fn(() => ({ mutateAsync: jest.fn(), isPending: false })),
  useEditAdminuiPolicyStore: jest.fn(() => ({ mutateAsync: mockEditMutate, isPending: false })),
  useDeleteAdminuiPolicyStore: jest.fn(() => ({ mutateAsync: mockDeleteMutate, isPending: false })),
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isLoading: false, isFetched: true })),
  getGetAdminuiPolicyStoreQueryKey: () => ['/admin-ui/security1/policyStore'],
}))

jest.mock('@/utils/AuditLogger', () => ({
  logAuditUserAction: jest.fn().mockResolvedValue(undefined),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { userinfo: { name: 'Test' }, config: { clientId: '123' } }) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

const openConfirmFor = async (actionLabel: string) => {
  const button = await screen.findByRole('button', { name: actionLabel })
  fireEvent.click(button)
  const commentsBox = await waitFor(() => {
    const box = document.getElementById('user_action_message')
    if (!box) throw new Error('comments box not rendered')
    return box
  })
  fireEvent.change(commentsBox, { target: { value: 'Reverting a bad policy rollout' } })
  fireEvent.click(screen.getByText('Yes'))
}

describe('PolicyStoreHistoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('lists every uploaded policy store with its status', async () => {
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })

    expect(await screen.findByText('current-policies.cjar')).toBeInTheDocument()
    expect(screen.getByText('previous-policies.cjar')).toBeInTheDocument()
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    expect(screen.getByText('BACKUP')).toBeInTheDocument()
  })

  it('shows the comments recorded at upload time', async () => {
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    expect(await screen.findByText('Kept as a rollback point')).toBeInTheDocument()
  })

  it('offers Set active and Delete only on backups, never on the active store', async () => {
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('current-policies.cjar')

    // One active + one backup, and only the backup row exposes these two actions — the ticket
    // requires that a policy store is always active, so the live one cannot be removed or re-activated.
    expect(screen.getAllByRole('button', { name: 'Set active' })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(1)
  })

  it('activates a backup through the confirm dialog', async () => {
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('previous-policies.cjar')

    await openConfirmFor('Set active')

    await waitFor(() => {
      expect(mockEditMutate).toHaveBeenCalledWith({
        inum: 'backup-1',
        data: { jansStatus: 'active' },
      })
    })
  })

  it('deletes a backup through the confirm dialog', async () => {
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('previous-policies.cjar')

    await openConfirmFor('Delete')

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith({ inum: 'backup-1' })
    })
  })

  it('records an audit entry carrying the administrator comments', async () => {
    const { logAuditUserAction } = jest.requireMock('@/utils/AuditLogger') as {
      logAuditUserAction: jest.Mock
    }
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('previous-policies.cjar')

    await openConfirmFor('Delete')

    await waitFor(() => {
      expect(logAuditUserAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'DELETION',
          payload: expect.objectContaining({ comments: 'Reverting a bad policy rollout' }),
        }),
      )
    })
  })
})

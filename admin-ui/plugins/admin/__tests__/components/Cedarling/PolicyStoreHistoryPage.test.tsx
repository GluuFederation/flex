import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import PolicyStoreHistoryPage from 'Plugins/admin/components/Cedarling/PolicyStoreHistoryPage'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginListenersResolver', () => ({ __esModule: true, default: jest.fn() }))

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
const mockSyncMutate = jest.fn().mockResolvedValue(undefined)

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
  useSyncRoleToScopesMappings: jest.fn(() => ({ mutateAsync: mockSyncMutate, isPending: false })),
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
  const buttons = await screen.findAllByRole('button', { name: actionLabel })
  const button = buttons.find((candidate) => !candidate.hasAttribute('disabled'))
  if (!button) throw new Error(`no enabled "${actionLabel}" action found`)
  fireEvent.click(button)
  if (actionLabel === 'Set active') {
    const confirmTitle = await screen.findByText('Confirm Policy Store Activation')
    expect(confirmTitle).toBeInTheDocument()
    fireEvent.click(screen.getByText('Yes'))
  }
  const commentsBox = await waitFor(() => {
    const box = document.getElementById('user_action_message')
    if (!box) throw new Error('comments box not rendered')
    return box
  })
  fireEvent.change(commentsBox, { target: { value: 'Reverting a bad policy rollout' } })
  fireEvent.click(screen.getByText('Yes'))
}

type WebhookTriggerAction = {
  type?: string
  payload?: { feature?: string; createdFeatureValue?: Record<string, string> }
}

describe('PolicyStoreHistoryPage', () => {
  const mockUsePermission = jest.requireMock('@/cedarling/hooks/usePermission')
    .usePermission as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePermission.mockReturnValue({ canRead: true, canWrite: true, canDelete: true })
  })

  const webhookTriggers = (dispatchSpy: jest.SpyInstance) =>
    dispatchSpy.mock.calls
      .map(([action]) => action as WebhookTriggerAction)
      .filter((action) => action?.type === 'webhook/triggerWebhook')

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

  it('disables Set active and Delete on the active store, keeping them on backups', async () => {
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('current-policies.cjar')

    const setActiveButtons = screen.getAllByRole('button', { name: 'Set active' })
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    expect(setActiveButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)

    expect(setActiveButtons[0]).toBeDisabled()
    expect(deleteButtons[0]).toBeDisabled()
    expect(setActiveButtons[1]).toBeEnabled()
    expect(deleteButtons[1]).toBeEnabled()
  })

  it('offers Delete on write permission alone', async () => {
    mockUsePermission.mockReturnValue({ canRead: true, canWrite: true, canDelete: false })

    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('previous-policies.cjar')

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    expect(deleteButtons).toHaveLength(2)
    expect(deleteButtons.some((button) => !button.hasAttribute('disabled'))).toBe(true)
  })

  it('hides Set active and Delete without write permission', async () => {
    mockUsePermission.mockReturnValue({ canRead: true, canWrite: false, canDelete: false })

    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('previous-policies.cjar')

    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Set active' })).not.toBeInTheDocument()
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

    await waitFor(() => {
      expect(mockSyncMutate).toHaveBeenCalled()
    })
  })

  it('still reports activation as successful when the role-scope sync fails', async () => {
    const { logAuditUserAction } = jest.requireMock('@/utils/AuditLogger') as {
      logAuditUserAction: jest.Mock
    }
    mockSyncMutate.mockRejectedValueOnce(new Error('sync unavailable'))
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('previous-policies.cjar')

    await openConfirmFor('Set active')

    await waitFor(() => {
      expect(mockEditMutate).toHaveBeenCalledWith({
        inum: 'backup-1',
        data: { jansStatus: 'active' },
      })
    })

    await waitFor(() => {
      expect(logAuditUserAction).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'UPDATE',
          payload: expect.objectContaining({ comments: 'Reverting a bad policy rollout' }),
        }),
      )
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

  it('triggers the policy store delete webhook once the store is gone', async () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('previous-policies.cjar')

    await openConfirmFor('Delete')

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(webhookTriggers(dispatchSpy)).toEqual([
        expect.objectContaining({
          payload: expect.objectContaining({ feature: 'policy_store_delete' }),
        }),
      ])
    })
    dispatchSpy.mockRestore()
  })

  it('triggers the policy store add/edit webhook on activation', async () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    render(<PolicyStoreHistoryPage />, { wrapper: Wrapper })
    await screen.findByText('previous-policies.cjar')

    await openConfirmFor('Set active')

    await waitFor(() => {
      expect(mockEditMutate).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(webhookTriggers(dispatchSpy)).toHaveLength(1)
    })

    const [trigger] = webhookTriggers(dispatchSpy)
    expect(trigger.payload).toEqual({
      feature: 'policy_store_write',
      createdFeatureValue: expect.objectContaining({
        inum: 'backup-1',
        displayname: 'previous-policies.cjar',
        jansStatus: 'active',
      }),
    })
    dispatchSpy.mockRestore()
  })
})

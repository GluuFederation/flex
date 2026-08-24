import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { writeArchive, textToBytes, readArchive } from '@/utils/cjarArchive'
import ArchiveExplorerPage from 'Plugins/admin/components/Cedarling/ArchiveExplorerPage'

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

type RouteMatch = { params: Record<string, string> } | null

const mockUseMatch = jest.fn((_pattern: string): RouteMatch => null)
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ inum: 'store-1' }),
  useMatch: (pattern: string) => mockUseMatch(pattern),
}))

jest.mock('ace-builds/src-noconflict/mode-json', () => ({}))
jest.mock('ace-builds/src-noconflict/mode-xml', () => ({}))
jest.mock('ace-builds/src-noconflict/mode-text', () => ({}))
jest.mock('ace-builds/src-noconflict/theme-xcode', () => ({}))
jest.mock('ace-builds/src-noconflict/theme-monokai', () => ({}))

jest.mock('react-ace', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
    readOnly,
  }: {
    value: string
    onChange: (next: string) => void
    readOnly: boolean
  }) => (
    <textarea
      data-testid="archive-editor"
      value={value}
      readOnly={readOnly}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}))

const mockGetPolicyStore = jest.fn()
jest.mock('JansConfigApi', () => ({
  useGetAdminuiPolicyStore: (...args: Parameters<typeof mockGetPolicyStore>) =>
    mockGetPolicyStore(...args),
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

const toBase64 = (bytes: Uint8Array): string => {
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

const buildStore = async (jansStatus = 'active') => {
  const packed = await writeArchive([
    { path: 'META-INF/MANIFEST.MF', bytes: textToBytes('Manifest-Version: 1.0\n') },
    { path: 'policies/allow.cedar', bytes: textToBytes('permit(principal, action, resource);') },
  ])
  return {
    inum: 'store-1',
    displayname: 'current-policies.cjar',
    jansStatus,
    policyStore: toBase64(packed),
  }
}

const mockStoreWithStatus = async (jansStatus: string) => {
  const policyStore = await buildStore(jansStatus)
  mockGetPolicyStore.mockReturnValue({ data: { entries: [policyStore] }, isLoading: false })
}

describe('ArchiveExplorerPage', () => {
  beforeAll(() => {
    URL.createObjectURL = jest.fn(() => 'blob:archive')
    URL.revokeObjectURL = jest.fn()
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    const policyStore = await buildStore()
    mockGetPolicyStore.mockReturnValue({
      data: { entries: [policyStore] },
      isLoading: false,
    })
  })

  it('renders the archive directory tree', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    expect(await screen.findByRole('button', { name: 'META-INF' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'MANIFEST.MF' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'policies' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'allow.cedar' })).toBeInTheDocument()
  })

  const onEditRoute = () => {
    mockUseMatch.mockReturnValue({ params: { inum: 'store-1' } })
  }

  it('keeps the active policy store read-only', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))

    const editor = await screen.findByTestId('archive-editor')
    expect(editor).toHaveValue('permit(principal, action, resource);')
    expect(editor).toHaveAttribute('readonly')
    expect(
      screen.getByText(
        'The active policy store is read-only. Download it, edit the copy, then upload it as a new policy store.',
      ),
    ).toBeInTheDocument()
  })

  it('offers the edit action for an inactive store on the view route', async () => {
    await mockStoreWithStatus('inactive')
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))

    expect(await screen.findByTestId('archive-editor')).toHaveAttribute('readonly')
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Download' })).not.toBeInTheDocument()
  })

  it('hides the edit action for an active store', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))

    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })

  it('allows editing an inactive policy store and flags unsaved changes', async () => {
    await mockStoreWithStatus('inactive')
    onEditRoute()
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))

    const editor = await screen.findByTestId('archive-editor')
    expect(editor).not.toHaveAttribute('readonly')

    fireEvent.change(editor, { target: { value: 'forbid(principal, action, resource);' } })

    expect(await screen.findByTestId('archive-editor')).toHaveValue(
      'forbid(principal, action, resource);',
    )
    expect(screen.getByText('(Not downloaded yet)')).toBeInTheDocument()
  })

  it('reverts pending edits when cancel is clicked', async () => {
    await mockStoreWithStatus('inactive')
    onEditRoute()
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))

    const cancel = screen.getByRole('button', { name: 'Cancel' })
    expect(cancel).toBeDisabled()

    fireEvent.change(await screen.findByTestId('archive-editor'), {
      target: { value: 'forbid(principal, action, resource);' },
    })
    expect(screen.getByText('(Not downloaded yet)')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(await screen.findByText('Discard unsaved changes?')).toBeInTheDocument()
    expect(
      screen.getByText('Your edits have not been downloaded. Discarding clears them.'),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByText('Yes'))

    expect(await screen.findByTestId('archive-editor')).toHaveValue(
      'permit(principal, action, resource);',
    )
    expect(screen.queryByText('(Not downloaded yet)')).not.toBeInTheDocument()
  })

  it('confirms before leaving with pending edits and discards them on confirm', async () => {
    await mockStoreWithStatus('inactive')
    onEditRoute()
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))
    fireEvent.change(await screen.findByTestId('archive-editor'), {
      target: { value: 'forbid(principal, action, resource);' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(await screen.findByText('Discard unsaved changes?')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Yes'))

    expect(screen.queryByText('Discard unsaved changes?')).not.toBeInTheDocument()
  })

  it('leaves without confirmation when there are no pending edits', async () => {
    await mockStoreWithStatus('inactive')
    onEditRoute()
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.queryByText('Discard unsaved changes?')).not.toBeInTheDocument()
  })

  it('clears pending edits once the archive is downloaded', async () => {
    await mockStoreWithStatus('inactive')
    onEditRoute()
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))
    fireEvent.change(await screen.findByTestId('archive-editor'), {
      target: { value: 'forbid(principal, action, resource);' },
    })
    expect(screen.getByText('(Not downloaded yet)')).toBeInTheDocument()

    const download = screen.getByRole('button', { name: 'Download' })
    expect(download).toBeEnabled()
    fireEvent.click(download)

    await waitFor(() => expect(screen.queryByText('(Not downloaded yet)')).not.toBeInTheDocument())
  })

  it('offers a download control but no delete or add controls on the edit route', async () => {
    await mockStoreWithStatus('inactive')
    onEditRoute()
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))

    expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByText('Add file')).not.toBeInTheDocument()
  })

  it('packs the edited archive back into a readable zip', async () => {
    const edited = await writeArchive([
      { path: 'policies/allow.cedar', bytes: textToBytes('forbid();') },
    ])
    const roundTripped = await readArchive(edited)
    expect(roundTripped).toHaveLength(1)
    expect(roundTripped[0].path).toBe('policies/allow.cedar')
  })
})

import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ inum: 'store-1' }),
}))

// Ace's mode/theme side-effect imports must be mocked WITHOUT `virtual: true` — the real modules
// are installed and spawn a worker that leaks past teardown.
jest.mock('ace-builds/src-noconflict/mode-json', () => ({}))
jest.mock('ace-builds/src-noconflict/mode-xml', () => ({}))
jest.mock('ace-builds/src-noconflict/mode-text', () => ({}))
jest.mock('ace-builds/src-noconflict/theme-xcode', () => ({}))
jest.mock('ace-builds/src-noconflict/theme-monokai', () => ({}))

// Ace pulls in workers and canvas APIs jsdom lacks; a textarea stands in for the editor.
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

const buildStore = async () => {
  const packed = await writeArchive([
    { path: 'META-INF/MANIFEST.MF', bytes: textToBytes('Manifest-Version: 1.0\n') },
    { path: 'policies/allow.cedar', bytes: textToBytes('permit(principal, action, resource);') },
  ])
  return {
    inum: 'store-1',
    displayname: 'current-policies.cjar',
    jansStatus: 'active',
    policyStore: toBase64(packed),
  }
}

describe('ArchiveExplorerPage', () => {
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

    expect(await screen.findByText('META-INF')).toBeInTheDocument()
    expect(screen.getByText('MANIFEST.MF')).toBeInTheDocument()
    expect(screen.getByText('policies')).toBeInTheDocument()
    expect(screen.getByText('allow.cedar')).toBeInTheDocument()
  })

  it('shows the selected file contents read-only until Edit is clicked', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))

    const editor = await screen.findByTestId('archive-editor')
    expect(editor).toHaveValue('permit(principal, action, resource);')
    expect(editor).toHaveAttribute('readonly')

    fireEvent.click(screen.getByText('Edit'))
    await waitFor(() =>
      expect(screen.getByTestId('archive-editor')).not.toHaveAttribute('readonly'),
    )
  })

  it('keeps an edit in memory and marks the file as unsaved', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))
    fireEvent.click(screen.getByText('Edit'))
    fireEvent.change(screen.getByTestId('archive-editor'), { target: { value: 'forbid();' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(screen.getByLabelText('unsaved changes')).toBeInTheDocument()
    })
    expect(screen.getByTestId('archive-editor')).toHaveValue('forbid();')
  })

  it('discards an edit without changing the file', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))
    fireEvent.click(screen.getByText('Edit'))
    fireEvent.change(screen.getByTestId('archive-editor'), { target: { value: 'forbid();' } })
    fireEvent.click(screen.getByText('Discard'))

    await waitFor(() => {
      expect(screen.getByTestId('archive-editor')).toHaveValue(
        'permit(principal, action, resource);',
      )
    })
    expect(screen.queryByLabelText('unsaved changes')).not.toBeInTheDocument()
  })

  it('adds a new file at the given path', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })
    await screen.findByText('allow.cedar')

    fireEvent.click(screen.getByText('Add file'))
    fireEvent.change(screen.getByLabelText('e.g. policies/new-policy.cedar'), {
      target: { value: 'policies/deny.cedar' },
    })
    fireEvent.click(screen.getByText('Create'))

    expect(await screen.findByText('deny.cedar')).toBeInTheDocument()
  })

  it('removes a file from the archive', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(screen.queryByText('allow.cedar')).not.toBeInTheDocument()
    })
    expect(screen.getByText('MANIFEST.MF')).toBeInTheDocument()
  })

  it('packs the edited archive back into a readable zip', async () => {
    // Guards the whole point of the screen: edit in the browser, download, re-upload.
    const edited = await writeArchive([
      { path: 'policies/allow.cedar', bytes: textToBytes('forbid();') },
    ])
    const roundTripped = await readArchive(edited)
    expect(roundTripped).toHaveLength(1)
    expect(roundTripped[0].path).toBe('policies/allow.cedar')
  })
})

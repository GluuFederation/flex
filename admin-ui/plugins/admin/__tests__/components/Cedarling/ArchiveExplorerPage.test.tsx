import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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

    expect(await screen.findByRole('button', { name: 'META-INF' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'MANIFEST.MF' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'policies' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'allow.cedar' })).toBeInTheDocument()
  })

  it('shows the selected file contents read-only', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))

    const editor = await screen.findByTestId('archive-editor')
    expect(editor).toHaveValue('permit(principal, action, resource);')
    expect(editor).toHaveAttribute('readonly')
  })

  it('offers no edit, delete, add, or download controls', async () => {
    render(<ArchiveExplorerPage />, { wrapper: Wrapper })

    fireEvent.click(await screen.findByText('allow.cedar'))

    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    expect(screen.queryByText('Add file')).not.toBeInTheDocument()
    expect(screen.queryByText('Download')).not.toBeInTheDocument()
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

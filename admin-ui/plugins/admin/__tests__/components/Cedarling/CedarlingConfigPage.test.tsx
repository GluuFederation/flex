import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import CedarlingConfigPage from 'Plugins/admin/components/Cedarling/CedarlingConfigPage'

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginListenersResolver', () => ({ __esModule: true, default: jest.fn() }))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: {
    Security: 'Security',
    Webhooks: 'Webhooks',
    Lock: 'Lock',
    Users: 'Users',
    Attributes: 'Attributes',
  },
  CEDAR_RESOURCE_SCOPES: { Security: [], Webhooks: [], Lock: [], Users: [], Attributes: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: {
    Security: 'Security',
    Webhooks: 'Webhooks',
    Lock: 'Lock',
    Users: 'Users',
    Attributes: 'Attributes',
  },
  CEDAR_RESOURCE_SCOPES: { Security: [], Webhooks: [], Lock: [], Users: [], Attributes: [] },
}))

const mockMutateAsync = jest.fn().mockResolvedValue(undefined)
const mockCreatePolicyStore = jest.fn().mockResolvedValue(undefined)
jest.mock('JansConfigApi', () => ({
  useSyncRoleToScopesMappings: jest.fn(() => ({ mutateAsync: mockMutateAsync })),
  useCreateAdminuiPolicyStore: jest.fn(() => ({ mutateAsync: mockCreatePolicyStore })),
  useEditAdminuiPolicyStore: jest.fn(() => ({ mutateAsync: jest.fn() })),
  useDeleteAdminuiPolicyStore: jest.fn(() => ({ mutateAsync: jest.fn() })),
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isLoading: false, isFetched: true })),
  getGetAdminuiPolicyStoreQueryKey: () => ['/admin-ui/security1/policyStore'],
}))

jest.mock('@/redux/api/backend-api', () => ({
  fetchActivePolicyStoreBytes: jest.fn().mockResolvedValue(''),
  postUserAction: jest.fn().mockResolvedValue({ status: 200 }),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { userinfo: { name: 'Test' }, config: { clientId: '123' } }) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('CedarlingConfigPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMutateAsync.mockResolvedValue(undefined)
  })

  it('renders the cedarling configuration page', async () => {
    render(<CedarlingConfigPage />, { wrapper: Wrapper })
    const policyStoreElements = await screen.findAllByText(/Policy Store/i)
    expect(policyStoreElements.length).toBeGreaterThan(0)
  })

  it('applies the uploaded .cjar immediately and re-syncs the role mappings', async () => {
    render(<CedarlingConfigPage />, { wrapper: Wrapper })

    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toBeInTheDocument()

    const file = new File(['policy-data'], 'test-policy.cjar', { type: 'application/zip' })

    // Simulate dropzone file selection via native change event
    const dataTransfer = {
      files: [file],
      items: [{ kind: 'file', type: file.type, getAsFile: () => file }],
      types: ['Files'],
    }
    fireEvent.drop(input, { dataTransfer })

    await waitFor(() => {
      // The file name should appear in the UI after drop
      expect(screen.getByText('test-policy.cjar')).toBeInTheDocument()
    })

    // Button label is the translation value "Upload"
    const uploadButton = screen.getByText('Upload')
    fireEvent.click(uploadButton)

    const commentsBox = await screen.findByRole('textbox')
    fireEvent.change(commentsBox, { target: { value: 'Rolling out updated admin policies' } })

    fireEvent.click(screen.getByText('Yes'))

    await waitFor(() => {
      expect(mockCreatePolicyStore).toHaveBeenCalledWith({
        data: expect.objectContaining({
          displayname: 'test-policy.cjar',
          description: 'Rolling out updated admin policies',
          policyStore: expect.any(String),
          jansStatus: 'active',
        }),
      })
    })

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled()
    })
  })
})

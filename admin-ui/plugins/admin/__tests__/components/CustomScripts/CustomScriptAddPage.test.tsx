import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomScriptAddPage from 'Plugins/scripts/components/CustomScripts/CustomScriptAddPage'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { Webhooks: 'webhooks', Scripts: 'customscripts' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { webhooks: [], customscripts: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetCustomScriptType: jest.fn(() => ({ data: [], isLoading: false })),
  useGetConfigScripts: jest.fn(() => ({ data: { entries: [] }, isLoading: false })),
  useGetConfigScriptsByInum: jest.fn(() => ({ data: null, isLoading: false })),
  useGetConfigScriptsByType: jest.fn(() => ({ data: { entries: [] }, isLoading: false })),
  usePostConfigScripts: jest.fn(() => ({ mutateAsync: jest.fn(), isPending: false })),
  usePutConfigScripts: jest.fn(() => ({ mutateAsync: jest.fn(), isPending: false })),
  useDeleteConfigScriptsByInum: jest.fn(() => ({ mutateAsync: jest.fn(), isPending: false })),
  getGetConfigScriptsQueryKey: jest.fn(() => ['configScripts']),
  getGetConfigScriptsByTypeQueryKey: jest.fn(() => ['configScriptsByType']),
  getGetConfigScriptsByInumQueryKey: jest.fn(() => ['configScriptsByInum']),
}))

jest.mock('Plugins/scripts/components/CustomScripts/hooks', () => ({
  useCreateCustomScript: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  })),
  useCustomScriptTypes: jest.fn(() => ({
    data: [
      { value: 'person_authentication', name: 'Person Authentication' },
      { value: 'introspection', name: 'Introspection' },
    ],
    isLoading: false,
  })),
  useMutationEffects: jest.fn(),
}))

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { hasSession: true, permissions: [] }) => state,
    webhookReducer: (
      state = {
        featureWebhooks: [],
        loadingWebhooks: false,
        webhookModal: false,
        triggerWebhookInProgress: false,
      },
    ) => state,
    noReducer: (state = {}) => state,
  }),
})

const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { retry: false } } })

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('CustomScriptAddPage', () => {
  it('renders the form with empty Name and Description inputs', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    const nameInput = await screen.findByTestId('name')
    expect(nameInput).toHaveValue('')
    const descInput = screen.getByTestId('description')
    expect(descInput).toHaveValue('')
  })

  it('renders Script Type select with script type options', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    await screen.findByText(/Script Type/)
    const scriptTypeSelect = screen.getByTestId('scriptType') as HTMLSelectElement
    expect(scriptTypeSelect).not.toBeDisabled()
    const options = Array.from(scriptTypeSelect.options)
    const optionValues = options.map((o) => o.value)
    expect(optionValues).toContain('person_authentication')
    expect(optionValues).toContain('introspection')
  })

  it('renders Programming Language select with python as default', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    await screen.findByText(/Programming Language/)
    const langSelect = screen.getByTestId('programmingLanguage') as HTMLSelectElement
    expect(langSelect.value).toBe('python')
  })

  it('renders Location Type and Script Path fields', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Location Type/)).toBeInTheDocument()
    expect(screen.getByText(/Script Path/)).toBeInTheDocument()
  })

  it('renders Level counter defaulting to 1', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Level/)).toBeInTheDocument()
    const levelInput = document.querySelector('input#level') as HTMLInputElement
    expect(levelInput).toBeTruthy()
    expect(levelInput.value).toBe('1')
  })

  it('renders Enabled toggle checked by default for new scripts', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    await screen.findByText(/Enabled/)
    const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
    expect(toggle).toBeTruthy()
    expect(toggle.checked).toBe(true)
  })

  it('renders Custom Properties and Module Properties sections', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    expect(await screen.findByText(/Custom Properties/i)).toBeInTheDocument()
    expect(screen.getByText(/Module Properties/i)).toBeInTheDocument()
  })

  it('does not render inum field for new script', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    await screen.findByText(/Name/)
    expect(screen.queryByTestId('inum')).not.toBeInTheDocument()
  })

  it('does not render PersonAuthentication fields when no script type selected', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    await screen.findByText(/Name/)
    expect(screen.queryByText(/SAML ACRs/i)).not.toBeInTheDocument()
  })

  it('renders footer with Back and Cancel buttons', async () => {
    render(<CustomScriptAddPage />, { wrapper: Wrapper })
    await screen.findByText(/Name/)
    expect(screen.getByText(/Back/i)).toBeInTheDocument()
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import CustomScriptEditPage from 'Plugins/scripts/components/CustomScripts/CustomScriptEditPage'

const mockUseCustomScript = jest.fn()
const mockUseUpdateCustomScript = jest.fn()
const mockUseMatch = jest.fn()

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ id: 'test-inum-123' })),
  useMatch: (pattern: string) => mockUseMatch(pattern),
}))

jest.mock('Plugins/scripts/components/CustomScripts/hooks', () => ({
  useCustomScript: (inum: string) => mockUseCustomScript(inum),
  useUpdateCustomScript: () => mockUseUpdateCustomScript(),
  useCustomScriptTypes: jest.fn(() => ({
    data: [
      { value: 'person_authentication', name: 'Person Authentication' },
      { value: 'introspection', name: 'Introspection' },
    ],
    isLoading: false,
  })),
  useMutationEffects: jest.fn(),
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

const mockScriptData = {
  inum: 'test-inum-123',
  name: 'test_script',
  description: 'Test description',
  scriptType: 'person_authentication',
  programmingLanguage: 'python',
  locationType: 'ldap',
  level: 5,
  revision: 1,
  enabled: true,
  internal: false,
  script: 'print("hello")',
  moduleProperties: [],
  configurationProperties: [],
}

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

beforeEach(() => {
  jest.clearAllMocks()
  mockUseMatch.mockReturnValue(null)
  mockUseUpdateCustomScript.mockReturnValue({
    mutateAsync: jest.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  })
})

describe('CustomScriptEditPage', () => {
  describe('when script data is loaded', () => {
    beforeEach(() => {
      mockUseCustomScript.mockReturnValue({
        data: mockScriptData,
        isLoading: false,
        error: null,
      })
    })

    it('renders inum field with the correct script inum', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      const inumInput = await screen.findByTestId('inum')
      expect(inumInput).toHaveValue('test-inum-123')
    })

    it('populates Name input with script name', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      const nameInput = await screen.findByTestId('name')
      expect(nameInput).toHaveValue('test_script')
    })

    it('populates Description input with script description', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      const descInput = await screen.findByTestId('description')
      expect(descInput).toHaveValue('Test description')
    })

    it('disables Script Type dropdown in edit mode', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Script Type/)
      const scriptTypeSelect = screen.getByTestId('scriptType')
      expect(scriptTypeSelect).toBeDisabled()
    })

    it('renders Programming Language with script value', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Programming Language/)
      const langSelect = screen.getByTestId('programmingLanguage') as HTMLSelectElement
      expect(langSelect.value).toBe('python')
    })

    it('renders Location Type and Script Path fields', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/Location Type/)).toBeInTheDocument()
      expect(screen.getByText(/Script Path/)).toBeInTheDocument()
    })

    it('renders Level counter with script level value', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/Level/)).toBeInTheDocument()
      const levelInput = document.querySelector('input#level') as HTMLInputElement
      expect(levelInput).toBeTruthy()
      expect(levelInput.value).toBe('5')
    })

    it('renders Enabled toggle reflecting script enabled state', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Enabled/)
      const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
    })

    it('renders PersonAuthentication fields for person_authentication scripts', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/SAML ACRs/i)).toBeInTheDocument()
      expect(screen.getByText(/Interactive/i)).toBeInTheDocument()
    })

    it('renders Custom Properties and Module Properties sections', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/Custom Properties/i)).toBeInTheDocument()
      expect(screen.getByText(/Module Properties/i)).toBeInTheDocument()
    })

    it('renders footer with Back and Cancel buttons', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Name/)
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
    })
  })

  describe('when script fetch fails', () => {
    beforeEach(() => {
      mockUseCustomScript.mockReturnValue({
        data: null,
        isLoading: false,
        error: { message: 'Script not found' },
      })
    })

    it('renders error alert with the error message', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/Script not found/i)).toBeInTheDocument()
    })

    it('does not render the form fields', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Script not found/i)
      expect(screen.queryByTestId('name')).not.toBeInTheDocument()
    })
  })

  describe('when in view-only mode', () => {
    beforeEach(() => {
      mockUseCustomScript.mockReturnValue({
        data: mockScriptData,
        isLoading: false,
        error: null,
      })
      mockUseMatch.mockReturnValue({ params: { id: 'test-inum-123' } })
    })

    it('renders Back button and hides Cancel button (view-only footer)', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Name/)
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })

    it('disables the Enabled toggle', async () => {
      render(<CustomScriptEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Enabled/)
      const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.disabled).toBe(true)
    })
  })
})

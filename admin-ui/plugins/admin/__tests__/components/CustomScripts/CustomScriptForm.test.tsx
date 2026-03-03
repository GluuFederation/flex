import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'

const item = {
  name: 'basic',
  script: '',
  scriptType: 'person_authentication',
  programmingLanguage: 'python',
  moduleProperties: [
    { value1: 'usage_type', value2: 'interactive' },
    { value1: 'location_type', value2: 'ldap' },
  ],
  level: 10,
  dn: 'inum=A51E-76DA,ou=scripts,o=jans',
  inum: 'A51E-76DA',
  description: 'Sample authentication module',
  revision: 1,
  enabled: false,
  modified: false,
  internal: false,
}
import CustomScriptForm from 'Plugins/scripts/components/CustomScripts/CustomScriptForm'

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

jest.mock('Plugins/scripts/components/CustomScripts/hooks', () => ({
  useCustomScriptTypes: jest.fn(() => ({
    data: [
      { value: 'person_authentication', name: 'Person Authentication' },
      { value: 'introspection', name: 'Introspection' },
    ],
    isLoading: false,
  })),
  useCustomScript: jest.fn(() => ({ data: null, isLoading: false })),
  useUpdateCustomScript: jest.fn(() => ({ mutateAsync: jest.fn(), isLoading: false })),
  useMutationEffects: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('JansConfigApi', () => ({
  useGetCustomScriptType: jest.fn(() => ({ data: [], isLoading: false })),
  useGetConfigScripts: jest.fn(() => ({ data: { entries: [] }, isLoading: false })),
  useGetConfigScriptsByInum: jest.fn(() => ({ data: null, isLoading: false })),
  useGetConfigScriptsByType: jest.fn(() => ({ data: { entries: [] }, isLoading: false })),
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

const handleSubmit = jest.fn()

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

describe('CustomScriptForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with existing item (edit mode)', () => {
    it('renders inum field with correct value', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      const inumInput = await screen.findByTestId('inum')
      expect(inumInput).toHaveValue(item.inum)
    })

    it('populates Name input with item name', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      const nameInput = await screen.findByTestId('name')
      expect(nameInput).toHaveValue(item.name)
    })

    it('populates Description input with item description', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      const descInput = await screen.findByTestId('description')
      expect(descInput).toHaveValue(item.description)
    })

    it('disables Script Type dropdown in edit mode', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Script Type/)
      const scriptTypeSelect = screen.getByTestId('scriptType')
      expect(scriptTypeSelect).toBeDisabled()
    })

    it('renders Programming Language with item value', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Programming Language/)
      const langSelect = screen.getByTestId('programmingLanguage') as HTMLSelectElement
      expect(langSelect.value).toBe(item.programmingLanguage)
    })

    it('renders Location Type and Script Path fields', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      expect(await screen.findByText(/Location Type/)).toBeInTheDocument()
      expect(screen.getByText(/Script Path/)).toBeInTheDocument()
    })

    it('renders Level counter with item level', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      expect(await screen.findByText(/Level/)).toBeInTheDocument()
      const levelInput = document.querySelector('input#level') as HTMLInputElement
      expect(levelInput).toBeTruthy()
      expect(levelInput.value).toBe(String(item.level))
    })

    it('renders Enabled toggle reflecting item enabled state', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Enabled/)
      const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(item.enabled)
    })

    it('renders Custom Properties section with Add Property button', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      expect(await screen.findByText(/Custom Properties/i)).toBeInTheDocument()
      const addButtons = screen.getAllByText(/Add Property/i)
      expect(addButtons.length).toBeGreaterThanOrEqual(1)
    })

    it('renders Module Properties section with Add Property button', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      expect(await screen.findByText(/Module Properties/i)).toBeInTheDocument()
    })

    it('renders PersonAuthentication fields for person_authentication type', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      expect(await screen.findByText(/SAML ACRs/i)).toBeInTheDocument()
      expect(screen.getByText(/Interactive/i)).toBeInTheDocument()
    })

    it('renders footer with Back, Cancel, and Apply', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Name/)
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })
  })

  describe('with empty item (add mode)', () => {
    it('does not render inum field', async () => {
      render(<CustomScriptForm item={{}} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Name/)
      expect(screen.queryByTestId('inum')).not.toBeInTheDocument()
    })

    it('renders empty Name and Description inputs', async () => {
      render(<CustomScriptForm item={{}} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      const nameInput = await screen.findByTestId('name')
      expect(nameInput).toHaveValue('')
      const descInput = screen.getByTestId('description')
      expect(descInput).toHaveValue('')
    })

    it('enables Script Type dropdown', async () => {
      render(<CustomScriptForm item={{}} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Script Type/)
      const scriptTypeSelect = screen.getByTestId('scriptType')
      expect(scriptTypeSelect).not.toBeDisabled()
    })

    it('defaults Programming Language to python', async () => {
      render(<CustomScriptForm item={{}} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Programming Language/)
      const langSelect = screen.getByTestId('programmingLanguage') as HTMLSelectElement
      expect(langSelect.value).toBe('python')
    })

    it('defaults Level counter to 1', async () => {
      render(<CustomScriptForm item={{}} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Level/)
      const levelInput = document.querySelector('input#level') as HTMLInputElement
      expect(levelInput).toBeTruthy()
      expect(levelInput.value).toBe('1')
    })

    it('defaults Enabled toggle to checked', async () => {
      render(<CustomScriptForm item={{}} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Enabled/)
      const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
    })

    it('does not render PersonAuthentication fields when no type is selected', async () => {
      render(<CustomScriptForm item={{}} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Name/)
      expect(screen.queryByText(/SAML ACRs/i)).not.toBeInTheDocument()
    })
  })

  describe('with viewOnly mode', () => {
    it('renders Back button and hides Cancel', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} viewOnly />, {
        wrapper: Wrapper,
      })
      await screen.findByText(/Name/)
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })

    it('disables the Enabled toggle', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} viewOnly />, {
        wrapper: Wrapper,
      })
      await screen.findByText(/Enabled/)
      const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.disabled).toBe(true)
    })

    it('disables Script Type dropdown', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} viewOnly />, {
        wrapper: Wrapper,
      })
      await screen.findByText(/Script Type/)
      const scriptTypeSelect = screen.getByTestId('scriptType')
      expect(scriptTypeSelect).toBeDisabled()
    })
  })

  describe('form interactions', () => {
    it('allows typing in the Name field', async () => {
      render(<CustomScriptForm item={{}} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      const nameInput = await screen.findByTestId('name')
      fireEvent.change(nameInput, { target: { value: 'my_new_script' } })
      expect(nameInput).toHaveValue('my_new_script')
    })

    it('allows typing in the Description field', async () => {
      render(<CustomScriptForm item={{}} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      const descInput = await screen.findByTestId('description')
      fireEvent.change(descInput, { target: { value: 'A new script description' } })
      expect(descInput).toHaveValue('A new script description')
    })

    it('triggers commit dialog flow when Apply is clicked on dirty form', async () => {
      render(<CustomScriptForm item={item} handleSubmit={handleSubmit} />, { wrapper: Wrapper })
      const nameInput = await screen.findByTestId('name')
      fireEvent.change(nameInput, { target: { value: 'updated_script' } })

      const applyBtn = await screen.findByText(/Apply/i)
      expect(applyBtn).toBeInTheDocument()
      await waitFor(() => {
        expect(applyBtn.closest('button')).not.toBeDisabled()
      })
      fireEvent.click(applyBtn)
    })
  })
})

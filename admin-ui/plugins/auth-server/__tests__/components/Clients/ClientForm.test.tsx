import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'
import ClientForm from 'Plugins/auth-server/components/Clients/components/ClientForm'

const mockClient = {
  inum: '1801.a0beec01-617b-4607-8a35-3e46ac43deb5',
  clientName: 'Jans Config Api Client',
  displayName: 'Jans Config Api Client',
  applicationType: 'web',
  disabled: false,
  grantTypes: ['authorization_code', 'refresh_token', 'client_credentials'],
  responseTypes: ['code'],
  tokenEndpointAuthMethod: 'client_secret_basic',
  description: 'Test client description',
  redirectUris: ['https://example.com/callback'],
  scopes: [],
}

jest.mock('@janssenproject/cedarling_wasm', () => ({
  __esModule: true,
  default: jest.fn(),
  init: jest.fn(),
  Cedarling: jest.fn(),
  AuthorizeResult: jest.fn(),
}))

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    authorize: jest.fn(() => true),
    authorizeHelper: jest.fn(),
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarDeletePermission: jest.fn(() => true),
  })),
  AdminUiFeatureResource: {},
}))

jest.mock('JansConfigApi', () => ({
  useGetConfigScripts: jest.fn(() => ({
    data: {
      entries: [],
      totalEntriesCount: 0,
    },
    isLoading: false,
  })),
  useGetProperties: jest.fn(() => ({
    data: {},
    isLoading: false,
  })),
}))

jest.mock('Plugins/auth-server/components/Clients/hooks', () => ({
  useClientScopes: jest.fn(() => ({
    scopes: [],
    scopesLoading: false,
    handleScopeSearch: jest.fn(),
  })),
}))

const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]

const INIT_STATE = {
  permissions: permissions,
}

const WEBHOOK_STATE = {
  loadingWebhooks: false,
  webhookModal: false,
  webhooks: [],
  featureWebhooks: [],
  triggerWebhookInProgress: false,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    cedarPermissions: (state = { permissions: [] }) => state,
    webhookReducer: (state = WEBHOOK_STATE) => state,
    noReducer: (state = {}) => state,
  }),
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppTestWrapper>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  </AppTestWrapper>
)

describe('ClientForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
  })

  it('renders form with client name', () => {
    render(
      <Wrapper>
        <ClientForm client={mockClient} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </Wrapper>,
    )

    const clientNameInputs = screen.getAllByDisplayValue(mockClient.clientName)
    expect(clientNameInputs.length).toBeGreaterThan(0)
  })

  it('renders navigation sections', () => {
    render(
      <Wrapper>
        <ClientForm client={mockClient} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </Wrapper>,
    )

    expect(screen.getByText(/basic info/i)).toBeInTheDocument()
  })

  it('renders cancel button', () => {
    render(
      <Wrapper>
        <ClientForm client={mockClient} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </Wrapper>,
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    expect(cancelButton).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <Wrapper>
        <ClientForm client={mockClient} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </Wrapper>,
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('renders in view-only mode without save button', () => {
    render(
      <Wrapper>
        <ClientForm
          client={mockClient}
          viewOnly={true}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      </Wrapper>,
    )

    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument()
  })

  it('renders save button in edit mode', () => {
    render(
      <Wrapper>
        <ClientForm
          client={mockClient}
          isEdit={true}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      </Wrapper>,
    )

    const saveButtons = screen.getAllByRole('button', { name: /save/i })
    expect(saveButtons.length).toBeGreaterThan(0)
  })

  it('allows editing client name field', () => {
    render(
      <Wrapper>
        <ClientForm client={mockClient} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </Wrapper>,
    )

    const clientNameInputs = screen.getAllByDisplayValue(mockClient.clientName)
    fireEvent.change(clientNameInputs[0], { target: { value: 'Updated Client Name' } })
    expect(screen.getAllByDisplayValue('Updated Client Name').length).toBeGreaterThan(0)
  })

  it('renders description field with initial value', () => {
    render(
      <Wrapper>
        <ClientForm client={mockClient} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </Wrapper>,
    )

    expect(screen.getByDisplayValue(mockClient.description)).toBeInTheDocument()
  })

  it('renders application type selector', () => {
    render(
      <Wrapper>
        <ClientForm client={mockClient} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </Wrapper>,
    )

    expect(screen.getByText(/web/i)).toBeInTheDocument()
  })

  it('renders disabled checkbox', () => {
    render(
      <Wrapper>
        <ClientForm client={mockClient} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </Wrapper>,
    )

    const disabledCheckboxes = screen.getAllByRole('checkbox')
    expect(disabledCheckboxes.length).toBeGreaterThan(0)
  })

  it('navigates to authentication section when clicked', async () => {
    render(
      <Wrapper>
        <ClientForm client={mockClient} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </Wrapper>,
    )

    const authSection = screen.getByText(/authentication/i)
    fireEvent.click(authSection)

    await waitFor(() => {
      expect(screen.getByText('Token Endpoint Authentication')).toBeInTheDocument()
    })
  })

  it('calls onSubmit with payload when form is submitted', async () => {
    render(
      <Wrapper>
        <ClientForm
          client={mockClient}
          isEdit={true}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      </Wrapper>,
    )

    // Modify client name to make form dirty
    const clientNameInputs = screen.getAllByDisplayValue(mockClient.clientName)
    fireEvent.change(clientNameInputs[0], { target: { value: 'Updated Client Name' } })

    // Click save button to open commit dialog
    const saveButtons = screen.getAllByRole('button', { name: /save/i })
    fireEvent.click(saveButtons[0])

    // Wait for commit dialog modal to appear
    const modal = await screen.findByRole('dialog')
    expect(modal).toBeInTheDocument()

    // Find and fill the commit message input within the modal
    const commitInput = within(modal).getByPlaceholderText(/reason/i)
    fireEvent.change(commitInput, { target: { value: 'Test commit message for update' } })

    // Click accept button within the modal
    const acceptButton = within(modal).getByRole('button', { name: /accept/i })
    fireEvent.click(acceptButton)

    // Verify onSubmit was called with payload containing updated client name
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          clientName: 'Updated Client Name',
        }),
        'Test commit message for update',
        expect.any(Object),
      )
    })
  })
})

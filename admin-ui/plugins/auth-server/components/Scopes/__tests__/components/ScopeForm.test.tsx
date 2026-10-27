import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ScopeForm from 'Plugins/auth-server/components/Scopes/components/ScopeForm'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ExtendedScope } from 'Plugins/auth-server/components/Scopes/types'
import type {
  ScopeScript,
  ScopeClaim,
  ModifiedFields,
} from 'Plugins/auth-server/components/Scopes/types'

jest.mock('@/utils/hooks/useWebhookDialogAction', () => ({
  __esModule: true,
  default: () => ({
    webhookTriggerModal: () => null,
    onCloseModal: jest.fn(),
    webhookCheckComplete: true,
  }),
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const mockOpenidScope: ExtendedScope = {
  inum: 'F0C4',
  dn: 'inum=F0C4,ou=scopes,o=jans',
  id: 'openid',
  displayName: 'OpenID Connect',
  description: 'Authenticate using OpenID Connect.',
  scopeType: 'openid',
  defaultScope: true,
  attributes: { showInConfigurationEndpoint: true },
  umaType: false,
  claims: [],
  clients: [],
}

const mockOauthScope: ExtendedScope = {
  inum: 'CACA-2AE5',
  dn: 'inum=CACA-2AE5,ou=scopes,o=jans',
  id: 'https://jans.io/oauth/config/database/ldap.readonly',
  displayName: 'LDAP Read',
  description: 'View LDAP database related information',
  scopeType: 'oauth',
  defaultScope: false,
  attributes: { showInConfigurationEndpoint: false },
  umaType: false,
  clients: [],
}

const mockScripts: ScopeScript[] = [
  {
    dn: 'inum=CB5B-3211,ou=scripts,o=jans',
    name: 'dynamic_scope_script',
    scriptType: 'dynamic_scope',
    enabled: true,
  },
  {
    dn: 'inum=2DAF-F9A5,ou=scripts,o=jans',
    name: 'uma_rpt_policy',
    scriptType: 'uma_rpt_policy',
    enabled: true,
  },
]

const mockClaims: ScopeClaim[] = [
  { dn: 'inum=2B29,ou=attributes,o=jans', name: 'name', claimName: 'name', displayName: 'Name' },
  {
    dn: 'inum=0C85,ou=attributes,o=jans',
    name: 'email',
    claimName: 'email',
    displayName: 'Email',
  },
]

// ---------------------------------------------------------------------------
// Redux store
// ---------------------------------------------------------------------------

const permissions = [
  'https://jans.io/oauth/config/scopes.readonly',
  'https://jans.io/oauth/config/scopes.write',
]

const INIT_STATE = {
  permissions,
  userinfo: { inum: 'test-user-inum' },
  hasSession: true,
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    cedarPermissions: (
      state = {
        permissions: {},
        loading: false,
        error: null,
        initialized: false,
        isInitializing: false,
      },
    ) => state,
    webhookReducer: (state = { webhookModal: false }) => state,
    noReducer: (state = {}) => state,
  }),
})

// ---------------------------------------------------------------------------
// Wrapper
// ---------------------------------------------------------------------------

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>
        <Provider store={store}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

it('Should render the scope form with basic fields for an openid scope', () => {
  const handleSubmit = jest.fn()
  const setModifiedFields = jest.fn()
  const modifiedFields: ModifiedFields = {}

  render(
    <ScopeForm
      scope={mockOpenidScope}
      scripts={mockScripts}
      attributes={mockClaims}
      handleSubmit={handleSubmit}
      modifiedFields={modifiedFields}
      setModifiedFields={setModifiedFields}
    />,
    { wrapper: Wrapper },
  )

  // getByText throws when multiple matches exist — use getAllByText instead
  expect(screen.getAllByText(/Display Name/i).length).toBeGreaterThan(0)
  expect(screen.getAllByText(/Description/i).length).toBeGreaterThan(0)
  expect(screen.getAllByText(/Default Scope/i).length).toBeGreaterThan(0)
})

it('Should render the scope form for an oauth scope', () => {
  const handleSubmit = jest.fn()
  const setModifiedFields = jest.fn()
  const modifiedFields: ModifiedFields = {}

  render(
    <ScopeForm
      scope={mockOauthScope}
      scripts={[]}
      attributes={[]}
      handleSubmit={handleSubmit}
      modifiedFields={modifiedFields}
      setModifiedFields={setModifiedFields}
    />,
    { wrapper: Wrapper },
  )

  expect(screen.getAllByText(/Display Name/i).length).toBeGreaterThan(0)
  expect(screen.getAllByText(/Description/i).length).toBeGreaterThan(0)
})

it('Should render with empty scripts and attributes gracefully', () => {
  const { container } = render(
    <ScopeForm
      scope={mockOpenidScope}
      scripts={[]}
      attributes={[]}
      handleSubmit={jest.fn()}
      modifiedFields={{}}
      setModifiedFields={jest.fn()}
    />,
    { wrapper: Wrapper },
  )

  expect(container).toBeTruthy()
})

const renderScopeForm = (scope: ExtendedScope) =>
  render(
    <ScopeForm
      scope={scope}
      scripts={mockScripts}
      attributes={mockClaims}
      handleSubmit={jest.fn()}
      modifiedFields={{}}
      setModifiedFields={jest.fn()}
    />,
    { wrapper: Wrapper },
  )

it('shows associated clients as links for a non-UMA scope', () => {
  renderScopeForm({
    ...mockOpenidScope,
    clients: [{ inum: '1201.abc', displayName: 'SCIM client' }, { inum: '1202.def' }],
  })

  expect(screen.getByText(/Associated Clients/i)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'SCIM client' })).toHaveAttribute(
    'href',
    expect.stringContaining('1201.abc'),
  )
  expect(screen.getByRole('link', { name: '1202.def' })).toBeInTheDocument()
})

it('says so when no clients are associated', () => {
  renderScopeForm(mockOpenidScope)

  expect(screen.getByText('No clients are associated with this scope')).toBeInTheDocument()
})

it('hides associated clients for a scope that is not saved yet', () => {
  renderScopeForm({ ...mockOpenidScope, inum: undefined })

  expect(screen.queryByText(/Associated Clients/i)).toBeNull()
})

it('leaves associated clients out of the saved scope', async () => {
  const handleSubmit = jest.fn()
  render(
    <ScopeForm
      scope={{ ...mockOauthScope, clients: [{ inum: '1201.abc', displayName: 'SCIM client' }] }}
      scripts={mockScripts}
      attributes={mockClaims}
      handleSubmit={handleSubmit}
      modifiedFields={{}}
      setModifiedFields={jest.fn()}
    />,
    { wrapper: Wrapper },
  )

  fireEvent.change(screen.getByDisplayValue('View LDAP database related information'), {
    target: { value: 'View LDAP database details' },
  })
  const applyButton = screen.getByText(/Apply/i).closest('button') as HTMLButtonElement
  await waitFor(() => expect(applyButton).not.toBeDisabled())
  fireEvent.click(applyButton)

  fireEvent.change(await screen.findByPlaceholderText('Provide the reason of this change'), {
    target: { value: 'Shorter scope description' },
  })
  fireEvent.click(screen.getByText(/^Yes$/i))

  await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1))
  const saved = JSON.parse(handleSubmit.mock.calls[0][0])
  expect(saved.description).toBe('View LDAP database details')
  expect(saved).not.toHaveProperty('clients')
})

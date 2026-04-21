import React from 'react'
import { render } from '@testing-library/react'
import ClientWizardForm from 'Plugins/auth-server/components/OidcClients/components/ClientWizardForm'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type {
  ClientFormInitialData,
  ClientModifiedFields,
} from 'Plugins/auth-server/components/OidcClients/types'
import type { SetStateAction } from 'react'

// ---------------------------------------------------------------------------
// Mock all sub-panels to keep this test focused on the wizard form itself
// ---------------------------------------------------------------------------

jest.mock('Plugins/auth-server/components/OidcClients/components/ClientBasicPanel', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="panel-basic" />),
}))
jest.mock('Plugins/auth-server/components/OidcClients/components/ClientTokensPanel', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="panel-tokens" />),
}))
jest.mock('Plugins/auth-server/components/OidcClients/components/ClientLogoutPanel', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="panel-logout" />),
}))
jest.mock('Plugins/auth-server/components/OidcClients/components/ClientSoftwarePanel', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="panel-software" />),
}))
jest.mock('Plugins/auth-server/components/OidcClients/components/ClientCibaParUmaPanel', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="panel-ciba" />),
}))
jest.mock(
  'Plugins/auth-server/components/OidcClients/components/ClientEncryptionSigningPanel',
  () => ({ __esModule: true, default: jest.fn(() => <div data-testid="panel-encryption" />) }),
)
jest.mock('Plugins/auth-server/components/OidcClients/components/ClientAdvancedPanel', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="panel-advanced" />),
}))
jest.mock('Plugins/auth-server/components/OidcClients/components/ClientScriptPanel', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="panel-scripts" />),
}))
jest.mock('Plugins/auth-server/components/OidcClients/components/ClientActiveTokens', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="panel-active-tokens" />),
}))
jest.mock(
  'Plugins/auth-server/components/OidcClients/components/ClientShowSpontaneousScopes',
  () => ({ __esModule: true, default: jest.fn(() => null) }),
)

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarReadPermission: jest.fn(() => true),
    authorizeHelper: jest.fn(() => Promise.resolve(true)),
  })),
}))

jest.mock('@/cedarling/hooks/useCedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarWritePermission: jest.fn(() => true),
    hasCedarReadPermission: jest.fn(() => true),
    authorizeHelper: jest.fn(() => Promise.resolve(true)),
  })),
}))

// GluuCommitDialog uses useCedarling internally via a direct import
jest.mock('Routes/Apps/Gluu/GluuCommitDialog', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: jest.fn(() => ({
    navigateToRoute: jest.fn(),
  })),
  ROUTES: {
    AUTH_SERVER_SCOPE_EDIT: jest.fn((id: string) => `/scope/${id}`),
    AUTH_SERVER_CLIENT_EDIT: jest.fn((id: string) => `/client/${id}`),
  },
}))

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
  useAppSelector: jest.fn(() => ({})),
}))

jest.mock('Plugins/auth-server/redux/features/scopeSlice', () => ({
  setClientSelectedScopes: jest.fn((payload: Record<string, string | boolean | string[]>[]) => ({
    type: 'scope/setClientSelectedScopes',
    payload,
  })),
}))

jest.mock('Plugins/admin/helper/utils', () => ({
  adminUiFeatures: {
    oidc_clients_write: 'https://jans.io/oauth/config/openid/clients.write',
    oidc_clients_read: 'https://jans.io/oauth/config/openid/clients.readonly',
  },
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

// ---------------------------------------------------------------------------
// Redux store
// ---------------------------------------------------------------------------

const INIT_STATE = {
  permissions: [
    'https://jans.io/oauth/config/openid/clients.readonly',
    'https://jans.io/oauth/config/openid/clients.write',
  ],
  userinfo: { inum: 'test-user-inum' },
  hasSession: true,
  config: { clientId: 'test-client-id' },
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = INIT_STATE) => state,
    oidcReducer: (state = { viewOnly: false, currentItem: {} }) => state,
    scopeReducer: (state = { selectedClient: null }) => state,
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

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>
        <Provider store={store}>{children}</Provider>
      </AppTestWrapper>
    </QueryClientProvider>
  )
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

const mockClientData: ClientFormInitialData = {
  inum: '0008-0DB1',
  clientName: 'Test Web Client',
  redirectUris: ['https://example.com/callback'],
  grantTypes: ['authorization_code'],
  responseTypes: ['code'],
  applicationType: 'web',
  disabled: false,
  trustedClient: false,
  attributes: {},
}

const mockSetModifiedFields = jest.fn<void, [SetStateAction<ClientModifiedFields>]>()

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

it('Should render the client wizard form without crashing', () => {
  const { container } = render(
    <ClientWizardForm
      client_data={mockClientData}
      viewOnly={false}
      scripts={[]}
      oidcConfiguration={undefined}
      isEdit={false}
      modifiedFields={{}}
      setModifiedFields={mockSetModifiedFields}
      customOnSubmit={jest.fn()}
    />,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should render the basic panel stub on initial step', () => {
  const { getByTestId } = render(
    <ClientWizardForm
      client_data={mockClientData}
      viewOnly={false}
      scripts={[]}
      oidcConfiguration={undefined}
      isEdit={false}
      modifiedFields={{}}
      setModifiedFields={mockSetModifiedFields}
      customOnSubmit={jest.fn()}
    />,
    { wrapper: Wrapper },
  )
  expect(getByTestId('panel-basic')).toBeInTheDocument()
})

it('Should render in viewOnly mode without crashing', () => {
  const { container } = render(
    <ClientWizardForm
      client_data={mockClientData}
      viewOnly={true}
      scripts={[]}
      oidcConfiguration={undefined}
      isEdit={true}
      modifiedFields={{}}
      setModifiedFields={mockSetModifiedFields}
      customOnSubmit={jest.fn()}
    />,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should render for a new client (no inum)', () => {
  const newClientData: ClientFormInitialData = {
    clientName: '',
    redirectUris: [],
    attributes: {},
  }
  const { container } = render(
    <ClientWizardForm
      client_data={newClientData}
      viewOnly={false}
      scripts={[]}
      oidcConfiguration={undefined}
      isEdit={false}
      modifiedFields={{}}
      setModifiedFields={mockSetModifiedFields}
      customOnSubmit={jest.fn()}
    />,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

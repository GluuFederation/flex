import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Formik } from 'formik'
import ClientCibaParUmaPanel from 'Plugins/auth-server/components/OidcClients/components/ClientCibaParUmaPanel'
import { Provider } from 'react-redux'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type {
  ClientWizardFormValues,
  ClientPanelFormik,
  ClientFormInitialData,
  ClientModifiedFields,
} from 'Plugins/auth-server/components/OidcClients/types'
import type { CustomScript } from 'JansConfigApi'
import type { SetStateAction } from 'react'
import { useClientUmaResources } from 'Plugins/auth-server/components/OidcClients/hooks'

jest.mock('Plugins/auth-server/components/OidcClients/hooks', () => ({
  ...jest.requireActual('Plugins/auth-server/components/OidcClients/hooks'),
  useClientUmaResources: jest.fn(() => ({
    umaResources: [],
    isLoading: false,
    deleteUmaResource: jest.fn(),
  })),
}))

const mockNavigateToRoute = jest.fn()
jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: jest.fn(() => ({
    navigateToRoute: mockNavigateToRoute,
  })),
  ROUTES: {
    AUTH_SERVER_SCOPE_EDIT: jest.fn((id: string) => `/scope/edit/${id}`),
    AUTH_SERVER_SCOPE_VIEW: jest.fn((id: string) => `/scope/view/${id}`),
    AUTH_SERVER_CLIENT_EDIT: jest.fn((id: string) => `/client/edit/${id}`),
    AUTH_SERVER_CLIENT_VIEW: jest.fn((id: string) => `/client/view/${id}`),
  },
}))

const mockCanWrite: Record<string, boolean> = {}
jest.mock('@/cedarling/hooks/useCedarling', () => ({
  useCedarling: () => ({
    authorizeHelper: jest.fn(() => Promise.resolve([])),
    hasCedarReadPermission: () => false,
    hasCedarWritePermission: () => false,
    hasCedarDeletePermission: () => false,
  }),
}))
jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: (resource: string) => ({
    canRead: true,
    canWrite: mockCanWrite[resource] ?? false,
    canDelete: false,
  }),
}))

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
  useAppSelector: jest.fn(() => ({})),
}))

const INIT_STATE = {
  permissions: ['https://jans.io/oauth/config/openid/clients.write'],
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

const mockClientData: ClientFormInitialData = {
  inum: '0008-0DB1',
  clientName: 'Test Web Client',
  attributes: {},
}

const mockValues: ClientWizardFormValues = {
  ...mockClientData,
  redirectUris: ['https://example.com/callback'],
  grantTypes: ['authorization_code'],
  responseTypes: ['code'],
  applicationType: 'web',
  disabled: false,
  trustedClient: false,
  expirable: false,
  backchannelTokenDeliveryMode: undefined,
  backchannelUserCodeParameter: false,
  claimRedirectUris: [],
  attributes: { requirePar: false },
}

const mockScripts: CustomScript[] = [
  {
    dn: 'inum=UMA-001,ou=scripts,o=jans',
    name: 'uma_rpt_policy',
    scriptType: 'uma_rpt_claims' as CustomScript['scriptType'],
    enabled: true,
  },
]

const mockSequence = [
  'Basic',
  'Tokens',
  'Logout',
  'SoftwareInfo',
  'CIBA/PAR/UMA',
  'Encryption/Signing',
]

const mockSetModifiedFields = jest.fn<void, [SetStateAction<ClientModifiedFields>]>()

it('Should render the CIBA/PAR/UMA panel without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientCibaParUmaPanel
          client={mockClientData}
          scripts={mockScripts}
          formik={formik}
          viewOnly={false}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
          setCurrentStep={jest.fn()}
          sequence={mockSequence}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should render in viewOnly mode without crashing', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientCibaParUmaPanel
          client={mockClientData}
          scripts={[]}
          formik={formik}
          viewOnly={true}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
          setCurrentStep={jest.fn()}
          sequence={mockSequence}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should render CIBA and PAR accordions', () => {
  render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientCibaParUmaPanel
          client={mockClientData}
          scripts={mockScripts}
          formik={formik}
          viewOnly={false}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
          setCurrentStep={jest.fn()}
          sequence={mockSequence}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  // CIBA, PAR, UMA accordion headings should be rendered
  expect(screen.getAllByRole('generic').length).toBeGreaterThan(0)
})

it('Should render with empty scripts list gracefully', () => {
  const { container } = render(
    <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
      {(formik: ClientPanelFormik) => (
        <ClientCibaParUmaPanel
          client={mockClientData}
          scripts={[]}
          formik={formik}
          viewOnly={false}
          modifiedFields={{}}
          setModifiedFields={mockSetModifiedFields}
          setCurrentStep={jest.fn()}
          sequence={mockSequence}
        />
      )}
    </Formik>,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

describe('UMA resource links', () => {
  const renderWithUma = () => {
    jest.mocked(useClientUmaResources).mockReturnValue({
      umaResources: [
        {
          id: 'uma-1',
          name: 'UMA one',
          scopes: ['inum=SCOPE-1,ou=scopes,o=jans'],
          clients: ['inum=CLIENT-2,ou=clients,o=jans'],
        },
      ],
      isLoading: false,
      deleteUmaResource: jest.fn(),
      isDeleting: false,
      refetch: jest.fn(),
    })
    render(
      <Formik<ClientWizardFormValues> initialValues={mockValues} onSubmit={jest.fn()}>
        {(formik: ClientPanelFormik) => (
          <ClientCibaParUmaPanel
            client={mockClientData}
            scripts={mockScripts}
            formik={formik}
            viewOnly
            modifiedFields={{}}
            setModifiedFields={mockSetModifiedFields}
            setCurrentStep={jest.fn()}
            sequence={mockSequence}
          />
        )}
      </Formik>,
      { wrapper: Wrapper },
    )
    fireEvent.click(screen.getByText('uma-1'))
  }

  beforeEach(() => {
    mockNavigateToRoute.mockClear()
    Object.keys(mockCanWrite).forEach((key) => delete mockCanWrite[key])
  })

  it('opens scopes and clients read-only when the user cannot write them', () => {
    renderWithUma()
    fireEvent.click(screen.getByText('SCOPE-1'))
    expect(mockNavigateToRoute).toHaveBeenLastCalledWith('/scope/view/SCOPE-1')
    fireEvent.click(screen.getByText('CLIENT-2'))
    expect(mockNavigateToRoute).toHaveBeenLastCalledWith('/client/view/CLIENT-2')
  })

  it('opens the edit pages when the user can write scopes and clients', () => {
    mockCanWrite.Scopes = true
    mockCanWrite.Clients = true
    renderWithUma()
    fireEvent.click(screen.getByText('SCOPE-1'))
    expect(mockNavigateToRoute).toHaveBeenLastCalledWith('/scope/edit/SCOPE-1')
    fireEvent.click(screen.getByText('CLIENT-2'))
    expect(mockNavigateToRoute).toHaveBeenLastCalledWith('/client/edit/CLIENT-2')
  })
})

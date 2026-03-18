import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserClaimsEditPage from 'Plugins/user-claims/components/Person/UserClaimsEditPage'

const mockAttribute = {
  inum: 'test-inum-123',
  name: 'givenName',
  displayName: 'Given Name',
  description: 'First Name',
  status: 'active',
  dataType: 'string',
  editType: ['admin'],
  viewType: ['admin'],
  usageType: ['openid'],
  claimName: 'given_name',
  saml1Uri: 'urn:mace:dir:attribute-def:givenName',
  saml2Uri: 'urn:oid:2.5.4.42',
  jansHideOnDiscovery: false,
  oxMultiValuedAttribute: false,
  scimCustomAttr: false,
  attributeValidation: { maxLength: null, regexp: null, minLength: null },
}

jest.mock('Plugins/PluginReducersResolver', () => ({ __esModule: true, default: jest.fn() }))
jest.mock('Plugins/PluginSagasResolver', () => ({ __esModule: true, default: jest.fn(() => []) }))

jest.mock('@/cedarling', () => {
  const { ADMIN_UI_RESOURCES, CEDAR_RESOURCE_SCOPES } = jest.requireActual('../cedarTestHelpers')
  return {
    useCedarling: jest.fn(() => ({
      hasCedarReadPermission: jest.fn(() => true),
      hasCedarWritePermission: jest.fn(() => true),
      hasCedarDeletePermission: jest.fn(() => true),
      authorizeHelper: jest.fn(),
    })),
    ADMIN_UI_RESOURCES: ADMIN_UI_RESOURCES,
    CEDAR_RESOURCE_SCOPES: CEDAR_RESOURCE_SCOPES,
  }
})

jest.mock('@/cedarling/utility', () => {
  const { ADMIN_UI_RESOURCES } = jest.requireActual('../cedarTestHelpers')
  return { ADMIN_UI_RESOURCES: ADMIN_UI_RESOURCES }
})

jest.mock('@/cedarling/constants/resourceScopes', () => {
  const { CEDAR_RESOURCE_SCOPES } = jest.requireActual('../cedarTestHelpers')
  return { CEDAR_RESOURCE_SCOPES: CEDAR_RESOURCE_SCOPES }
})

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ gid: 'test-inum-123' })),
}))

const mockUseAttribute = jest.fn((_inum: string) => ({
  data: mockAttribute as typeof mockAttribute | null,
  isLoading: false,
  error: null as { message: string } | null,
}))

jest.mock('Plugins/user-claims/hooks', () => ({
  useAttribute: (inum: string) => mockUseAttribute(inum),
  useUpdateAttribute: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
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

describe('UserClaimsEditPage', () => {
  describe('when attribute data is loaded', () => {
    it('renders inum field with the correct attribute inum', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      const inumInput = await screen.findByTestId('inum')
      expect(inumInput).toHaveValue('test-inum-123')
    })

    it('populates Name input with attribute name', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      const nameInput = await screen.findByTestId('name')
      expect(nameInput).toHaveValue('givenName')
    })

    it('populates Display Name input with attribute display name', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      const displayNameInput = await screen.findByTestId('displayName')
      expect(displayNameInput).toHaveValue('Given Name')
    })

    it('populates Description input with attribute description', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      const descInput = await screen.findByTestId('description')
      expect(descInput).toHaveValue('First Name')
    })

    it('renders Status select with attribute value', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Status/)
      const statusSelect = screen.getByTestId('status') as HTMLSelectElement
      expect(statusSelect.value).toBe('active')
    })

    it('renders Data Type select with attribute value', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Data Type/)
      const dataTypeSelect = screen.getByTestId('dataType') as HTMLSelectElement
      expect(dataTypeSelect.value).toBe('string')
    })

    it('renders Edit Type and View Type fields', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/Edit Type/)).toBeInTheDocument()
      expect(screen.getByText(/View Type/)).toBeInTheDocument()
    })

    it('renders Usage Type field', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/Usage Type/)).toBeInTheDocument()
    })

    it('renders Saml1 URI and Saml2 URI fields', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/Saml1 URI/i)).toBeInTheDocument()
      expect(screen.getByText(/Saml2 URI/i)).toBeInTheDocument()
    })

    it('renders toggle fields', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/Multivalued/)).toBeInTheDocument()
      expect(screen.getByText(/Hide On Discovery/)).toBeInTheDocument()
      expect(screen.getByText(/Include In SCIM Extension/)).toBeInTheDocument()
      expect(screen.getByText(/Enable custom validation/i)).toBeInTheDocument()
    })

    it('renders footer with Back and Cancel buttons', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      await screen.findByTestId('name')
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
    })
  })

  describe('when attribute fetch fails', () => {
    beforeEach(() => {
      mockUseAttribute.mockReturnValue({
        data: null,
        isLoading: false,
        error: { message: 'Attribute not found' },
      })
    })

    afterEach(() => {
      mockUseAttribute.mockReturnValue({
        data: mockAttribute,
        isLoading: false,
        error: null,
      })
    })

    it('renders error alert with the error message', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      expect(await screen.findByText(/Error loading attribute/i)).toBeInTheDocument()
    })

    it('does not render the form fields', async () => {
      render(<UserClaimsEditPage />, { wrapper: Wrapper })
      await screen.findByText(/Error loading attribute/i)
      expect(screen.queryByTestId('name')).not.toBeInTheDocument()
    })
  })
})

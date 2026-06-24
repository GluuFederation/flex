import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { TrustRelationship } from 'Plugins/saml/components/hooks'

const mockCreateMutate = jest.fn()
const mockUpdateMutate = jest.fn()
const mockNavigateBack = jest.fn()

jest.mock('Plugins/saml/components/hooks', () => ({
  useCreateTrustRelationship: () => ({
    mutateAsync: mockCreateMutate,
    isPending: false,
    savedForm: false,
    resetSavedForm: jest.fn(),
  }),
  useUpdateTrustRelationship: () => ({
    mutateAsync: mockUpdateMutate,
    isPending: false,
    savedForm: false,
    resetSavedForm: jest.fn(),
  }),
  TrustRelationshipSpMetaDataSourceType: { FILE: 'FILE', URL: 'URL', MANUAL: 'MANUAL' },
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateBack: mockNavigateBack }),
  ROUTES: { SAML_SP_LIST: 'saml-sp-list' },
}))

jest.mock('JansConfigApi', () => ({
  useGetAttributes: () => ({
    data: {
      entries: [
        { dn: 'attr-dn-1', displayName: 'Email' },
        { dn: 'attr-dn-2', displayName: 'Username' },
      ],
    },
    error: null,
    isLoading: false,
  }),
}))

jest.mock('Routes/Apps/Gluu/GluuCommitDialog', () => ({
  __esModule: true,
  default: () => null,
}))

import WebsiteSsoServiceProviderForm from 'Plugins/saml/components/WebsiteSsoServiceProviderForm'

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { hasSession: true, permissions: [], config: {} }) => state,
    cedarPermissions: (state = { permissions: {}, initialized: true, isInitializing: false }) =>
      state,
    scopeReducer: (state = { selectedClientScopes: [] }) => state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

const mockConfigs: TrustRelationship = {
  inum: 'SP-123',
  name: 'my-sp',
  displayName: 'My Service Provider',
  description: 'A test service provider',
  enabled: true,
  spLogoutURL: 'https://sp.example.com/logout',
  spMetaDataSourceType: 'manual',
  releasedAttributes: ['attr-dn-1'],
  samlMetadata: {
    entityId: 'https://sp.example.com/entity',
    singleLogoutServiceUrl: 'https://sp.example.com/slo',
    nameIDPolicyFormat: '',
    jansAssertionConsumerServiceGetURL: '',
    jansAssertionConsumerServicePostURL: '',
  },
}

const renderForm = async (props?: { configs?: TrustRelationship | null; viewOnly?: boolean }) => {
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(<WebsiteSsoServiceProviderForm {...props} />, { wrapper: Wrapper })
  })
  await screen.findByTestId('name')
  return result!
}

describe('WebsiteSsoServiceProviderForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create mode (no configs)', () => {
    it('renders without crashing', async () => {
      await renderForm()
      expect(screen.getByTestId('name')).toBeInTheDocument()
    })

    it('renders an empty name field', async () => {
      await renderForm()
      expect(screen.getByTestId('name')).toHaveValue('')
    })

    it('renders an empty display name field', async () => {
      await renderForm()
      expect(screen.getByTestId('displayName')).toHaveValue('')
    })

    it('renders the metadata location select', async () => {
      await renderForm()
      expect(screen.getByTestId('spMetaDataSourceType')).toBeInTheDocument()
    })

    it('renders the footer with Apply and Cancel', async () => {
      await renderForm()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
    })

    it('does not render the manual metadata fields by default', async () => {
      await renderForm()
      expect(screen.queryByTestId('samlMetadata.entityId')).not.toBeInTheDocument()
    })
  })

  describe('edit mode (with configs)', () => {
    it('populates the name field', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('name')).toHaveValue('my-sp')
    })

    it('populates the display name field', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('displayName')).toHaveValue('My Service Provider')
    })

    it('populates the description field', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('description')).toHaveValue('A test service provider')
    })

    it('populates the sp logout url field', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('spLogoutURL')).toHaveValue('https://sp.example.com/logout')
    })

    it('renders the enabled toggle as checked', async () => {
      await renderForm({ configs: mockConfigs })
      const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
    })

    it('renders the manual metadata fields when source type is manual', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('samlMetadata.entityId')).toHaveValue(
        'https://sp.example.com/entity',
      )
    })
  })

  describe('view only mode', () => {
    it('disables the name field', async () => {
      await renderForm({ configs: mockConfigs, viewOnly: true })
      expect(screen.getByTestId('name')).toBeDisabled()
    })

    it('hides the Apply and Cancel buttons', async () => {
      await renderForm({ configs: mockConfigs, viewOnly: true })
      expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })

    it('still renders the Back button', async () => {
      await renderForm({ configs: mockConfigs, viewOnly: true })
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    it('allows typing in the name field', async () => {
      await renderForm()
      const nameInput = screen.getByTestId('name')
      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'new-sp-name' } })
      })
      expect(nameInput).toHaveValue('new-sp-name')
    })

    it('reveals the manual metadata fields when source type is changed to manual', async () => {
      await renderForm()
      const select = screen.getByTestId('spMetaDataSourceType') as HTMLSelectElement
      await act(async () => {
        fireEvent.change(select, { target: { value: 'manual' } })
      })
      expect(screen.getByTestId('samlMetadata.entityId')).toBeInTheDocument()
    })
  })
})

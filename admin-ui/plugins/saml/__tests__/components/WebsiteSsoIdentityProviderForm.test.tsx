import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { IdentityProvider } from 'Plugins/saml/components/hooks'

const mockCreateMutate = jest.fn()
const mockUpdateMutate = jest.fn()
const mockNavigateBack = jest.fn()

jest.mock('Plugins/saml/components/hooks', () => ({
  useCreateIdentityProvider: () => ({
    mutateAsync: mockCreateMutate,
    isPending: false,
    savedForm: false,
    resetSavedForm: jest.fn(),
  }),
  useUpdateIdentityProvider: () => ({
    mutateAsync: mockUpdateMutate,
    isPending: false,
    savedForm: false,
    resetSavedForm: jest.fn(),
  }),
}))

jest.mock('@/helpers/navigation', () => ({
  useAppNavigation: () => ({ navigateBack: mockNavigateBack }),
  ROUTES: { SAML_IDP_LIST: 'saml-idp-list' },
}))

jest.mock('Routes/Apps/Gluu/GluuCommitDialog', () => ({
  __esModule: true,
  default: () => null,
}))

import WebsiteSsoIdentityProviderForm from 'Plugins/saml/components/WebsiteSsoIdentityProviderForm'

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { hasSession: true, permissions: [], config: {} }) => state,
    cedarPermissions: (state = { permissions: {}, initialized: true, isInitializing: false }) =>
      state,
    noReducer: (state = {}) => state,
  }),
})

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

const mockConfigs: IdentityProvider = {
  inum: 'IDP-123',
  name: 'my-idp',
  displayName: 'My Identity Provider',
  description: 'A test identity provider',
  enabled: true,
  idpEntityId: 'https://idp.example.com/entity',
  singleSignOnServiceUrl: 'https://idp.example.com/sso',
  singleLogoutServiceUrl: 'https://idp.example.com/slo',
  nameIDPolicyFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',
}

const renderForm = async (props?: { configs?: IdentityProvider | null; viewOnly?: boolean }) => {
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(<WebsiteSsoIdentityProviderForm {...props} />, { wrapper: Wrapper })
  })
  await screen.findByTestId('name')
  return result!
}

describe('WebsiteSsoIdentityProviderForm', () => {
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

    it('renders the idp entity id field when not importing metadata', async () => {
      await renderForm()
      expect(screen.getByTestId('idpEntityId')).toHaveValue('')
    })

    it('renders the footer with Apply and Cancel', async () => {
      await renderForm()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
    })
  })

  describe('edit mode (with configs)', () => {
    it('populates the name field', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('name')).toHaveValue('my-idp')
    })

    it('populates the display name field', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('displayName')).toHaveValue('My Identity Provider')
    })

    it('populates the description field', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('description')).toHaveValue('A test identity provider')
    })

    it('populates the idp entity id field', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('idpEntityId')).toHaveValue('https://idp.example.com/entity')
    })

    it('populates the single sign on service url field', async () => {
      await renderForm({ configs: mockConfigs })
      expect(screen.getByTestId('singleSignOnServiceUrl')).toHaveValue(
        'https://idp.example.com/sso',
      )
    })

    it('renders the enabled toggle as checked', async () => {
      await renderForm({ configs: mockConfigs })
      const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
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
        fireEvent.change(nameInput, { target: { value: 'new-idp-name' } })
      })
      expect(nameInput).toHaveValue('new-idp-name')
    })

    it('allows typing in the display name field', async () => {
      await renderForm()
      const displayNameInput = screen.getByTestId('displayName')
      await act(async () => {
        fireEvent.change(displayNameInput, { target: { value: 'New Display Name' } })
      })
      expect(displayNameInput).toHaveValue('New Display Name')
    })
  })

  describe('metadata file upload', () => {
    const openUploadField = () => {
      const toggle = screen.getByTestId('metaDataFileImportedFlag')
      fireEvent.click(toggle)
      return document.querySelector('input[type="file"]') as HTMLInputElement
    }

    it('reports an unsupported metadata file instead of selecting it', async () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      await renderForm()

      const input = openUploadField()
      const file = new File(['x'], 'logo.png', { type: 'image/png' })

      fireEvent.change(input, { target: { files: [file] } })

      expect(screen.queryByText('logo.png')).not.toBeInTheDocument()
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'toast/updateToast',
          payload: expect.objectContaining({
            type: 'error',
            message: expect.stringContaining('.xml'),
          }),
        }),
      )
      dispatchSpy.mockRestore()
    })

    it('selects an xml metadata file', async () => {
      await renderForm()

      const input = openUploadField()
      const file = new File(['<xml/>'], 'metadata.xml', { type: 'text/xml' })

      fireEvent.change(input, { target: { files: [file] } })

      expect(await screen.findByText('metadata.xml')).toBeInTheDocument()
    })
  })
})

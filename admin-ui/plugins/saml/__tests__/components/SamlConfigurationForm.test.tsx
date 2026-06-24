import React, { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { SamlAppConfiguration } from 'Plugins/saml/components/hooks'

const mockState: { configuration: SamlAppConfiguration | undefined; canWrite: boolean } = {
  configuration: undefined,
  canWrite: true,
}

const mockUpdateMutate = jest.fn()

jest.mock('Plugins/saml/components/hooks', () => ({
  useSamlConfiguration: () => ({ data: mockState.configuration, isLoading: false }),
  useUpdateSamlConfiguration: () => ({
    mutateAsync: mockUpdateMutate,
    isPending: false,
  }),
}))

jest.mock('@/cedarling/hooks/usePermission', () => ({
  usePermission: () => ({ canRead: true, canWrite: mockState.canWrite, canDelete: true }),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { SAML: 'SAML' },
  CEDAR_RESOURCE_SCOPES: { SAML: ['read', 'write', 'delete'] },
}))

jest.mock('Routes/Apps/Gluu/GluuCommitDialog', () => ({
  __esModule: true,
  default: () => null,
}))

import SamlConfigurationForm from 'Plugins/saml/components/SamlConfigurationForm'

const store = configureStore({
  reducer: combineReducers({
    authReducer: (state = { hasSession: true, permissions: [], config: {} }) => state,
    cedarPermissions: (state = { permissions: {}, initialized: true, isInitializing: false }) =>
      state,
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

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>
    <Provider store={store}>{children}</Provider>
  </AppTestWrapper>
)

const renderForm = async () => {
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(<SamlConfigurationForm />, { wrapper: Wrapper })
  })
  await screen.findByTestId('selectedIdp')
  return result!
}

describe('SamlConfigurationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockState.configuration = undefined
    mockState.canWrite = true
  })

  describe('with empty configuration', () => {
    it('renders without crashing', async () => {
      await renderForm()
      expect(screen.getByTestId('selectedIdp')).toBeInTheDocument()
    })

    it('defaults the selected idp select to empty', async () => {
      await renderForm()
      const select = screen.getByTestId('selectedIdp') as HTMLSelectElement
      expect(select.value).toBe('')
    })

    it('renders the enable saml toggle as unchecked', async () => {
      await renderForm()
      const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(false)
    })

    it('renders the ignore validation toggle as unchecked', async () => {
      await renderForm()
      const toggle = document.querySelector(
        'input#ignoreValidation[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(false)
    })

    it('renders the Keycloak option in the idp select', async () => {
      await renderForm()
      expect(screen.getByText('Keycloak')).toBeInTheDocument()
    })
  })

  describe('with existing configuration (edit mode)', () => {
    beforeEach(() => {
      mockState.configuration = {
        enabled: true,
        selectedIdp: 'keycloak',
        ignoreValidation: true,
        applicationName: 'My SAML App',
      }
    })

    it('populates the selected idp from the configuration', async () => {
      await renderForm()
      const select = screen.getByTestId('selectedIdp') as HTMLSelectElement
      expect(select.value).toBe('keycloak')
    })

    it('renders the enable saml toggle as checked', async () => {
      await renderForm()
      const toggle = document.querySelector('input#enabled[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
    })

    it('renders the ignore validation toggle as checked', async () => {
      await renderForm()
      const toggle = document.querySelector(
        'input#ignoreValidation[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
    })
  })

  describe('write permission gating', () => {
    it('renders the footer when the user can write', async () => {
      await renderForm()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
    })

    it('hides the footer when the user cannot write', async () => {
      mockState.canWrite = false
      await renderForm()
      expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    it('updates the selected idp when changed', async () => {
      await renderForm()
      const select = screen.getByTestId('selectedIdp') as HTMLSelectElement
      await act(async () => {
        fireEvent.change(select, { target: { value: 'keycloak' } })
      })
      expect(select.value).toBe('keycloak')
    })
  })
})

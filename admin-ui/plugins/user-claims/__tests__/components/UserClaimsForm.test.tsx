import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import type { AttributeItem } from 'Plugins/user-claims/components/types/UserClaimsListPage.types'

const item: AttributeItem = {
  inum: 'B4B0',
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
  selected: false,
  custom: false,
  required: false,
  attributeValidation: { maxLength: null, regexp: null, minLength: null },
}

const emptyItem: AttributeItem = {
  name: '',
  displayName: '',
  description: '',
  status: '',
  dataType: '',
  editType: [],
  viewType: [],
  usageType: [],
  jansHideOnDiscovery: false,
  oxMultiValuedAttribute: false,
  scimCustomAttr: false,
  selected: false,
  custom: false,
  required: false,
  attributeValidation: { maxLength: null, regexp: null, minLength: null },
}

import UserClaimsForm from 'Plugins/user-claims/components/Person/UserClaimsForm'

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
  useNavigate: jest.fn(() => jest.fn()),
}))

jest.mock('JansConfigApi', () => ({
  usePostAttributes: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
  usePutAttributes: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
  getGetAttributesQueryKey: jest.fn(() => ['attributes']),
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isFetching: false, isFetched: true })),
  JansAttribute: {},
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

describe('UserClaimsForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with existing item (edit mode)', () => {
    it('renders inum field with correct value', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      const inumInput = await screen.findByTestId('inum')
      expect(inumInput).toHaveValue(item.inum)
    })

    it('populates Name input with item name', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      const nameInput = await screen.findByTestId('name')
      expect(nameInput).toHaveValue(item.name)
    })

    it('populates Display Name input with item display name', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      const displayNameInput = await screen.findByTestId('displayName')
      expect(displayNameInput).toHaveValue(item.displayName)
    })

    it('populates Description input with item description', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      const descInput = await screen.findByTestId('description')
      expect(descInput).toHaveValue(item.description)
    })

    it('renders Status select with item value', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Status/)
      const statusSelect = screen.getByTestId('status') as HTMLSelectElement
      expect(statusSelect.value).toBe(item.status)
    })

    it('renders Data Type select with item value', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Data Type/)
      const dataTypeSelect = screen.getByTestId('dataType') as HTMLSelectElement
      expect(dataTypeSelect.value).toBe(item.dataType)
    })

    it('renders Edit Type and View Type fields', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      expect(await screen.findByText(/Edit Type/)).toBeInTheDocument()
      expect(screen.getByText(/View Type/)).toBeInTheDocument()
    })

    it('renders Usage Type field', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      expect(await screen.findByText(/Usage Type/)).toBeInTheDocument()
    })

    it('renders SAML URI fields with item values', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      const saml1Input = await screen.findByTestId('saml1Uri')
      expect(saml1Input).toHaveValue(item.saml1Uri)
      const saml2Input = screen.getByTestId('saml2Uri')
      expect(saml2Input).toHaveValue(item.saml2Uri)
    })

    it('renders Multivalued toggle reflecting item state', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Multivalued/)
      const toggle = document.querySelector(
        'input#oxMultiValuedAttribute[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(item.oxMultiValuedAttribute)
    })

    it('renders Hide On Discovery toggle reflecting item state', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Hide On Discovery/)
      const toggle = document.querySelector(
        'input#jansHideOnDiscovery[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(item.jansHideOnDiscovery)
    })

    it('renders Include In SCIM Extension toggle reflecting item state', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByText(/Include In SCIM Extension/)
      const toggle = document.querySelector(
        'input#scimCustomAttr[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(item.scimCustomAttr)
    })

    it('renders Enable Custom Validation toggle', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      expect(await screen.findByText(/Enable custom validation/i)).toBeInTheDocument()
    })

    it('does not show validation fields when validation is disabled', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByTestId('name')
      expect(screen.queryByTestId('regexp')).not.toBeInTheDocument()
      expect(screen.queryByTestId('minLength')).not.toBeInTheDocument()
      expect(screen.queryByTestId('maxLength')).not.toBeInTheDocument()
    })

    it('renders footer with Back, Cancel, and Apply', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      await screen.findByTestId('name')
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })
  })

  describe('with empty item (add mode)', () => {
    it('does not render inum field', async () => {
      render(<UserClaimsForm item={emptyItem} customOnSubmit={handleSubmit} />, {
        wrapper: Wrapper,
      })
      await screen.findByTestId('name')
      expect(screen.queryByTestId('inum')).not.toBeInTheDocument()
    })

    it('renders empty Name and Description inputs', async () => {
      render(<UserClaimsForm item={emptyItem} customOnSubmit={handleSubmit} />, {
        wrapper: Wrapper,
      })
      const nameInput = await screen.findByTestId('name')
      expect(nameInput).toHaveValue('')
      const descInput = screen.getByTestId('description')
      expect(descInput).toHaveValue('')
    })

    it('renders Status select enabled', async () => {
      render(<UserClaimsForm item={emptyItem} customOnSubmit={handleSubmit} />, {
        wrapper: Wrapper,
      })
      await screen.findByText(/Status/)
      const statusSelect = screen.getByTestId('status')
      expect(statusSelect).not.toBeDisabled()
    })

    it('renders Data Type select enabled', async () => {
      render(<UserClaimsForm item={emptyItem} customOnSubmit={handleSubmit} />, {
        wrapper: Wrapper,
      })
      await screen.findByText(/Data Type/)
      const dataTypeSelect = screen.getByTestId('dataType')
      expect(dataTypeSelect).not.toBeDisabled()
    })

    it('defaults Multivalued toggle to unchecked', async () => {
      render(<UserClaimsForm item={emptyItem} customOnSubmit={handleSubmit} />, {
        wrapper: Wrapper,
      })
      await screen.findByText(/Multivalued/)
      const toggle = document.querySelector(
        'input#oxMultiValuedAttribute[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(false)
    })

    it('defaults Hide On Discovery toggle to unchecked', async () => {
      render(<UserClaimsForm item={emptyItem} customOnSubmit={handleSubmit} />, {
        wrapper: Wrapper,
      })
      await screen.findByText(/Hide On Discovery/)
      const toggle = document.querySelector(
        'input#jansHideOnDiscovery[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(false)
    })
  })

  describe('with viewOnly mode', () => {
    const hideButtons = { save: true }

    it('renders Back button and hides Cancel', async () => {
      render(
        <UserClaimsForm item={item} customOnSubmit={handleSubmit} hideButtons={hideButtons} />,
        { wrapper: Wrapper },
      )
      await screen.findByTestId('name')
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })

    it('disables the Name input', async () => {
      render(
        <UserClaimsForm item={item} customOnSubmit={handleSubmit} hideButtons={hideButtons} />,
        { wrapper: Wrapper },
      )
      const nameInput = await screen.findByTestId('name')
      expect(nameInput).toBeDisabled()
    })

    it('disables the Description input', async () => {
      render(
        <UserClaimsForm item={item} customOnSubmit={handleSubmit} hideButtons={hideButtons} />,
        { wrapper: Wrapper },
      )
      const descInput = await screen.findByTestId('description')
      expect(descInput).toBeDisabled()
    })

    it('disables the Status select', async () => {
      render(
        <UserClaimsForm item={item} customOnSubmit={handleSubmit} hideButtons={hideButtons} />,
        { wrapper: Wrapper },
      )
      await screen.findByText(/Status/)
      const statusSelect = screen.getByTestId('status')
      expect(statusSelect).toBeDisabled()
    })

    it('disables the Multivalued toggle', async () => {
      render(
        <UserClaimsForm item={item} customOnSubmit={handleSubmit} hideButtons={hideButtons} />,
        { wrapper: Wrapper },
      )
      await screen.findByText(/Multivalued/)
      const toggle = document.querySelector(
        'input#oxMultiValuedAttribute[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.disabled).toBe(true)
    })
  })

  describe('form interactions', () => {
    it('allows typing in the Name field', async () => {
      render(<UserClaimsForm item={emptyItem} customOnSubmit={handleSubmit} />, {
        wrapper: Wrapper,
      })
      const nameInput = await screen.findByTestId('name')
      fireEvent.change(nameInput, { target: { value: 'myAttribute' } })
      expect(nameInput).toHaveValue('myAttribute')
    })

    it('allows typing in the Description field', async () => {
      render(<UserClaimsForm item={emptyItem} customOnSubmit={handleSubmit} />, {
        wrapper: Wrapper,
      })
      const descInput = await screen.findByTestId('description')
      fireEvent.change(descInput, { target: { value: 'A new attribute description' } })
      expect(descInput).toHaveValue('A new attribute description')
    })

    it('triggers commit dialog flow when Apply is clicked on dirty form', async () => {
      render(<UserClaimsForm item={item} customOnSubmit={handleSubmit} />, { wrapper: Wrapper })
      const nameInput = await screen.findByTestId('name')
      fireEvent.change(nameInput, { target: { value: 'updatedName' } })

      const applyBtn = await screen.findByText(/Apply/i)
      expect(applyBtn).toBeInTheDocument()
      await waitFor(() => {
        expect(applyBtn.closest('button')).not.toBeDisabled()
      })
      fireEvent.click(applyBtn)

      const dialog = await screen.findByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    it('shows validation fields when Enable Custom Validation is toggled', async () => {
      render(<UserClaimsForm item={emptyItem} customOnSubmit={handleSubmit} />, {
        wrapper: Wrapper,
      })
      await screen.findByText(/Enable custom validation/i)
      const validationToggle = document.querySelector(
        'input#validation[type="checkbox"]',
      ) as HTMLInputElement
      expect(validationToggle).toBeTruthy()

      fireEvent.click(validationToggle)

      await waitFor(() => {
        expect(screen.getByText(/Regular expression/i)).toBeInTheDocument()
        expect(screen.getByText(/Minimum length/i)).toBeInTheDocument()
        expect(screen.getByText(/Maximum length/i)).toBeInTheDocument()
      })
    })
  })
})

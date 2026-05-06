import React, { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import StaticConfiguration from 'Plugins/fido/components/StaticConfiguration'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { FIDO: 'FIDO', Lock: 'Lock' },
  CEDAR_RESOURCE_SCOPES: { FIDO: [], Lock: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { FIDO: 'FIDO', Lock: 'Lock' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { FIDO: [], Lock: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isFetching: false, isFetched: true })),
}))

const mockFidoConfig = {
  fido2Configuration: {
    authenticatorCertsFolder: '/etc/certs/authenticator',
    mdsCertsFolder: '/etc/certs/mds',
    mdsTocsFolder: '/etc/certs/tocs',
    unfinishedRequestExpiration: 120,
    authenticationHistoryExpiration: 1296000,
    serverMetadataFolder: '/etc/fido2/server_metadata',
    userAutoEnrollment: true,
    rp: [{ id: 'example.com', origins: ['https://example.com'] }],
    enabledFidoAlgorithms: ['ES256', 'RS256'],
    metadataServers: [{ url: 'https://mds.example.com', rootCert: 'cert-data' }],
    disableMetadataService: false,
    hints: ['security-key'],
    enterpriseAttestation: false,
    attestationMode: 'direct',
  },
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (
      state = {
        hasSession: true,
        permissions: [],
        userinfo: { name: 'test-user' },
        config: { clientId: 'test-client' },
        location: { IPv4: '127.0.0.1' },
      },
    ) => state,
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

const defaultProps = {
  handleSubmit,
  fidoConfiguration: mockFidoConfig,
  isSubmitting: false,
  readOnly: false,
}

const renderAndWait = async (props = defaultProps) => {
  await act(async () => {
    render(<StaticConfiguration {...props} />, { wrapper: Wrapper })
  })
  await screen.findByTestId('authenticatorCertsFolder')
}

beforeEach(() => {
  jest.clearAllMocks()
})

const getToggleByLabel = (labelText: string): HTMLInputElement | null => {
  const label = screen.getByText(new RegExp(labelText, 'i'))
  const row =
    label.closest('.form-group') ||
    label.closest('[class*="row"]') ||
    label.parentElement?.parentElement
  return row?.querySelector('.react-toggle input[type="checkbox"]') as HTMLInputElement | null
}

describe('StaticConfiguration', () => {
  describe('with existing config', () => {
    it('populates authenticator certs folder', async () => {
      await renderAndWait()
      expect(screen.getByTestId('authenticatorCertsFolder')).toHaveValue('/etc/certs/authenticator')
    })

    it('populates MDS certs folder', async () => {
      await renderAndWait()
      expect(screen.getByTestId('mdsCertsFolder')).toHaveValue('/etc/certs/mds')
    })

    it('populates MDS TOCs folder', async () => {
      await renderAndWait()
      expect(screen.getByTestId('mdsTocsFolder')).toHaveValue('/etc/certs/tocs')
    })

    it('populates server metadata folder', async () => {
      await renderAndWait()
      expect(screen.getByTestId('serverMetadataFolder')).toHaveValue('/etc/fido2/server_metadata')
    })

    it('populates unfinished request expiration', async () => {
      await renderAndWait()
      expect(screen.getByTestId('unfinishedRequestExpiration')).toHaveValue(120)
    })

    it('populates authentication history expiration', async () => {
      await renderAndWait()
      expect(screen.getByTestId('authenticationHistoryExpiration')).toHaveValue(1296000)
    })

    it('populates attestation mode select', async () => {
      await renderAndWait()
      const selectEl = screen.getByTestId('attestationMode') as HTMLSelectElement
      expect(selectEl.value).toBe('direct')
    })

    it('renders user auto enrollment toggle as checked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('User Auto Enrollment')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(true)
    })

    it('renders disable metadata service toggle as unchecked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('Disable Metadata Service')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })

    it('renders enterprise attestation toggle as unchecked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('Enterprise Attestation')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })

    it('renders requested parties section with data', async () => {
      await renderAndWait()
      expect(screen.getByText(/Requested Parties Id/i)).toBeInTheDocument()
    })

    it('renders enabled FIDO algorithms section', async () => {
      await renderAndWait()
      expect(screen.getByText(/Enabled FIDO Algorithms/i)).toBeInTheDocument()
    })

    it('renders metadata servers section', async () => {
      await renderAndWait()
      expect(screen.getByText(/Metadata Servers/i)).toBeInTheDocument()
    })

    it('renders MUI delete icons for remove actions', async () => {
      await renderAndWait()
      expect(screen.getAllByTestId('DeleteIcon').length).toBeGreaterThan(0)
    })

    it('renders footer with Back, Cancel, and Apply', async () => {
      await renderAndWait()
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })
  })

  describe('with empty config', () => {
    const emptyProps = {
      ...defaultProps,
      fidoConfiguration: undefined,
    }

    it('renders empty folder fields', async () => {
      await act(async () => {
        render(<StaticConfiguration {...emptyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('authenticatorCertsFolder')
      expect(screen.getByTestId('authenticatorCertsFolder')).toHaveValue('')
      expect(screen.getByTestId('mdsCertsFolder')).toHaveValue('')
      expect(screen.getByTestId('mdsTocsFolder')).toHaveValue('')
      expect(screen.getByTestId('serverMetadataFolder')).toHaveValue('')
    })

    it('defaults user auto enrollment toggle to unchecked', async () => {
      await act(async () => {
        render(<StaticConfiguration {...emptyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('authenticatorCertsFolder')
      const toggle = getToggleByLabel('User Auto Enrollment')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })
  })

  describe('with readOnly mode', () => {
    const readOnlyProps = {
      ...defaultProps,
      readOnly: true,
    }

    it('hides Apply button in read-only mode', async () => {
      await act(async () => {
        render(<StaticConfiguration {...readOnlyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('authenticatorCertsFolder')
      expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
    })

    it('renders Back button', async () => {
      await act(async () => {
        render(<StaticConfiguration {...readOnlyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('authenticatorCertsFolder')
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    it('allows typing in the authenticator certs folder field', async () => {
      await renderAndWait()
      const input = screen.getByTestId('authenticatorCertsFolder')
      await act(async () => {
        fireEvent.change(input, { target: { value: '/new/certs/path' } })
      })
      expect(input).toHaveValue('/new/certs/path')
    })

    it('triggers commit dialog when Apply is clicked on dirty valid form', async () => {
      await renderAndWait()
      await act(async () => {
        fireEvent.change(screen.getByTestId('authenticatorCertsFolder'), {
          target: { value: '/updated/certs' },
        })
      })

      const applyBtn = screen.getByText(/Apply/i)
      await waitFor(() => {
        expect(applyBtn.closest('button')).not.toBeDisabled()
      })
      await act(async () => {
        fireEvent.click(applyBtn)
      })

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })
  })
})

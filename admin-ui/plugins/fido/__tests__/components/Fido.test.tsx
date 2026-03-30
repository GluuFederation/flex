import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import Fido from 'Plugins/fido/components/Fido'

const mockUseFidoConfig = jest.fn()
const mockMutate = jest.fn()

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

jest.mock('Plugins/fido/hooks', () => ({
  useFidoConfig: () => mockUseFidoConfig(),
  useUpdateFidoConfig: () => ({ mutate: mockMutate, isPending: false }),
}))

jest.mock('JansConfigApi', () => ({
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isFetching: false, isFetched: true })),
}))

jest.mock('Utils/SetTitle', () => jest.fn())

const mockFidoConfig = {
  issuer: 'https://example.com',
  baseEndpoint: 'https://example.com/fido2',
  cleanServiceInterval: 60,
  cleanServiceBatchChunkSize: 100,
  useLocalCache: false,
  disableJdkLogger: false,
  loggingLevel: 'INFO',
  loggingLayout: 'text',
  metricReporterEnabled: false,
  metricReporterInterval: 300,
  metricReporterKeepDataDays: 15,
  personCustomObjectClassList: [],
  fido2MetricsEnabled: false,
  fido2MetricsRetentionDays: 30,
  fido2DeviceInfoCollection: false,
  fido2ErrorCategorization: false,
  fido2PerformanceMetrics: false,
  fido2Configuration: {
    authenticatorCertsFolder: '/etc/certs/authenticator',
    mdsCertsFolder: '/etc/certs/mds',
    mdsTocsFolder: '/etc/certs/tocs',
    unfinishedRequestExpiration: 120,
    authenticationHistoryExpiration: 1296000,
    serverMetadataFolder: '/etc/fido2/server_metadata',
    userAutoEnrollment: false,
    rp: [{ id: 'example.com', origins: ['https://example.com'] }],
    enabledFidoAlgorithms: ['ES256'],
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

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Fido', () => {
  describe('when config is loaded', () => {
    beforeEach(() => {
      mockUseFidoConfig.mockReturnValue({
        data: mockFidoConfig,
        isLoading: false,
      })
    })

    it('renders tab headers for static and dynamic configuration', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByText('Static Configuration')).toBeInTheDocument()
      expect(screen.getByText('Dynamic Configuration')).toBeInTheDocument()
    })

    it('renders static configuration fields by default', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByText(/Authenticator Certificates Folder/i)).toBeInTheDocument()
      expect(screen.getByText(/MDS TOC Certificates Folder/i)).toBeInTheDocument()
      expect(screen.getByText(/MDS TOC Files Folder/i)).toBeInTheDocument()
      expect(screen.getByText(/Server Metadata Folder/i)).toBeInTheDocument()
    })

    it('renders static config input fields with correct values', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByTestId('authenticatorCertsFolder')).toHaveValue('/etc/certs/authenticator')
      expect(screen.getByTestId('mdsCertsFolder')).toHaveValue('/etc/certs/mds')
      expect(screen.getByTestId('mdsTocsFolder')).toHaveValue('/etc/certs/tocs')
      expect(screen.getByTestId('serverMetadataFolder')).toHaveValue('/etc/fido2/server_metadata')
    })

    it('renders numeric fields with correct values', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByTestId('unfinishedRequestExpiration')).toHaveValue(120)
      expect(screen.getByTestId('authenticationHistoryExpiration')).toHaveValue(1296000)
    })

    it('renders attestation mode select', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByText(/Attestation Mode/i)).toBeInTheDocument()
      const selectEl = screen.getByTestId('attestationMode') as HTMLSelectElement
      expect(selectEl.value).toBe('direct')
    })

    it('renders requested parties section', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByText(/Requested Parties Id/i)).toBeInTheDocument()
    })

    it('renders enabled fido algorithms section', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByText(/Enabled FIDO Algorithms/i)).toBeInTheDocument()
    })

    it('renders metadata servers section', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByText(/Metadata Servers/i)).toBeInTheDocument()
    })

    it('renders footer with Back, Cancel, and Apply buttons', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })
  })

  describe('when config is loading', () => {
    beforeEach(() => {
      mockUseFidoConfig.mockReturnValue({
        data: undefined,
        isLoading: true,
      })
    })

    it('renders tabs with empty fields while loading', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByText('Static Configuration')).toBeInTheDocument()
      expect(screen.getByTestId('authenticatorCertsFolder')).toHaveValue('')
    })
  })

  describe('when config is empty', () => {
    beforeEach(() => {
      mockUseFidoConfig.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
    })

    it('renders tabs even with no config', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByText('Static Configuration')).toBeInTheDocument()
      expect(screen.getByText('Dynamic Configuration')).toBeInTheDocument()
    })

    it('renders empty input fields', async () => {
      await act(async () => {
        render(<Fido />, { wrapper: Wrapper })
      })
      expect(screen.getByTestId('authenticatorCertsFolder')).toHaveValue('')
      expect(screen.getByTestId('mdsCertsFolder')).toHaveValue('')
      expect(screen.getByTestId('mdsTocsFolder')).toHaveValue('')
    })
  })
})

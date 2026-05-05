import React, { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import DynamicConfiguration from 'Plugins/fido/components/DynamicConfiguration'

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
  personCustomObjectClassList: ['gluuCustomPerson'],
  fido2MetricsEnabled: false,
  fido2MetricsRetentionDays: 30,
  fido2DeviceInfoCollection: false,
  fido2ErrorCategorization: false,
  fido2PerformanceMetrics: false,
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
    render(<DynamicConfiguration {...props} />, { wrapper: Wrapper })
  })
  await screen.findByTestId('issuer')
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

describe('DynamicConfiguration', () => {
  describe('with existing config', () => {
    it('populates issuer field', async () => {
      await renderAndWait()
      expect(screen.getByTestId('issuer')).toHaveValue('https://example.com')
    })

    it('populates base endpoint field', async () => {
      await renderAndWait()
      expect(screen.getByTestId('baseEndpoint')).toHaveValue('https://example.com/fido2')
    })

    it('populates clean service interval', async () => {
      await renderAndWait()
      expect(screen.getByTestId('cleanServiceInterval')).toHaveValue(60)
    })

    it('populates clean service batch chunk size', async () => {
      await renderAndWait()
      expect(screen.getByTestId('cleanServiceBatchChunkSize')).toHaveValue(100)
    })

    it('populates logging layout field', async () => {
      await renderAndWait()
      expect(screen.getByTestId('loggingLayout')).toHaveValue('text')
    })

    it('populates logging level select', async () => {
      await renderAndWait()
      const selectEl = screen.getByTestId('loggingLevel') as HTMLSelectElement
      expect(selectEl.value).toBe('INFO')
    })

    it('populates metric reporter interval', async () => {
      await renderAndWait()
      expect(screen.getByTestId('metricReporterInterval')).toHaveValue(300)
    })

    it('populates metric reporter keep data days', async () => {
      await renderAndWait()
      expect(screen.getByTestId('metricReporterKeepDataDays')).toHaveValue(15)
    })

    it('populates fido2 metrics retention days', async () => {
      await renderAndWait()
      expect(screen.getByTestId('fido2MetricsRetentionDays')).toHaveValue(30)
    })

    it('renders use local cache toggle as unchecked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('Use Local Cache')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })

    it('renders disable JDK logger toggle as unchecked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('Disable JDK Logger')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })

    it('renders metric reporter enabled toggle as unchecked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('Enable Metric Reporter')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })

    it('renders fido2 metrics enabled toggle as unchecked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('Fido2 Metrics Enabled')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })

    it('renders fido2 device info collection toggle as unchecked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('Fido2 Device Info Collection')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })

    it('renders fido2 error categorization toggle as unchecked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('Fido2 Error Categorization')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })

    it('renders fido2 performance metrics toggle as unchecked', async () => {
      await renderAndWait()
      const toggle = getToggleByLabel('Fido2 Performance Metrics')
      expect(toggle).toBeTruthy()
      expect(toggle!.checked).toBe(false)
    })

    it('renders person custom object classes section', async () => {
      await renderAndWait()
      expect(screen.getByText(/Person Custom Object Classes/i)).toBeInTheDocument()
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

    it('renders empty issuer field', async () => {
      await act(async () => {
        render(<DynamicConfiguration {...emptyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('issuer')
      expect(screen.getByTestId('issuer')).toHaveValue('')
    })

    it('renders empty base endpoint field', async () => {
      await act(async () => {
        render(<DynamicConfiguration {...emptyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('baseEndpoint')
      expect(screen.getByTestId('baseEndpoint')).toHaveValue('')
    })

    it('renders empty logging layout field', async () => {
      await act(async () => {
        render(<DynamicConfiguration {...emptyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('loggingLayout')
      expect(screen.getByTestId('loggingLayout')).toHaveValue('')
    })

    it('defaults use local cache toggle to unchecked', async () => {
      await act(async () => {
        render(<DynamicConfiguration {...emptyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('issuer')
      const toggle = getToggleByLabel('Use Local Cache')
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
        render(<DynamicConfiguration {...readOnlyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('issuer')
      expect(screen.queryByText(/Apply/i)).not.toBeInTheDocument()
    })

    it('renders Back button', async () => {
      await act(async () => {
        render(<DynamicConfiguration {...readOnlyProps} />, { wrapper: Wrapper })
      })
      await screen.findByTestId('issuer')
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    it('allows typing in the issuer field', async () => {
      await renderAndWait()
      const input = screen.getByTestId('issuer')
      await act(async () => {
        fireEvent.change(input, { target: { value: 'https://new-issuer.com' } })
      })
      expect(input).toHaveValue('https://new-issuer.com')
    })

    it('allows typing in the base endpoint field', async () => {
      await renderAndWait()
      const input = screen.getByTestId('baseEndpoint')
      await act(async () => {
        fireEvent.change(input, { target: { value: 'https://new.com/fido2' } })
      })
      expect(input).toHaveValue('https://new.com/fido2')
    })

    it('triggers commit dialog when Apply is clicked on dirty valid form', async () => {
      await renderAndWait()
      await act(async () => {
        fireEvent.change(screen.getByTestId('issuer'), {
          target: { value: 'https://updated.com' },
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

import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import SmtpEditPage from 'Plugins/smtp-management/components/SmtpManagement/SmtpEditPage'

const mockGetConfigSmtp = jest.fn()
const mockPutConfigSmtp = jest.fn()
const mockTestConfigSmtp = jest.fn()

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { SMTP: 'smtp' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { smtp: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetConfigSmtp: () => mockGetConfigSmtp(),
  usePutConfigSmtp: (opts: unknown) => mockPutConfigSmtp(opts),
  useTestConfigSmtp: (opts: unknown) => mockTestConfigSmtp(opts),
  getGetConfigSmtpQueryKey: jest.fn(() => ['configSmtp']),
}))

const mockSmtpConfig = {
  host: 'smtp.example.com',
  port: 587,
  connect_protection: 'StartTls',
  from_name: 'Gluu Admin',
  from_email_address: 'admin@example.com',
  requires_authentication: true,
  smtp_authentication_account_username: 'admin@example.com',
  smtp_authentication_account_password: 'secret',
  trust_host: false,
  key_store: '/etc/certs/smtp.jks',
  key_store_password: 'keystorepass',
  key_store_alias: 'smtp_sig_ec256',
  signing_algorithm: 'SHA256withECDSA',
}

const store = configureStore({
  reducer: combineReducers({
    authReducer: (
      state = { hasSession: true, permissions: [], config: { allowSmtpKeystoreEdit: true } },
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

const renderAndWait = async () => {
  await act(async () => {
    render(<SmtpEditPage />, { wrapper: Wrapper })
  })
  await screen.findByTestId('host')
}

beforeEach(() => {
  jest.clearAllMocks()
  mockPutConfigSmtp.mockReturnValue({ mutate: jest.fn(), isPending: false })
  mockTestConfigSmtp.mockReturnValue({ mutate: jest.fn(), isPending: false })
})

describe('SmtpEditPage', () => {
  describe('when SMTP config is loaded', () => {
    beforeEach(() => {
      mockGetConfigSmtp.mockReturnValue({
        data: mockSmtpConfig,
        isLoading: false,
      })
    })

    it('renders host field with correct value', async () => {
      await renderAndWait()
      expect(screen.getByTestId('host')).toHaveValue('smtp.example.com')
    })

    it('renders port field with correct value', async () => {
      await renderAndWait()
      expect(screen.getByTestId('port')).toHaveValue(587)
    })

    it('renders from name field with correct value', async () => {
      await renderAndWait()
      expect(screen.getByTestId('from_name')).toHaveValue('Gluu Admin')
    })

    it('renders from email field with correct value', async () => {
      await renderAndWait()
      expect(screen.getByTestId('from_email_address')).toHaveValue('admin@example.com')
    })

    it('renders SMTP username field with correct value', async () => {
      await renderAndWait()
      expect(screen.getByTestId('smtp_authentication_account_username')).toHaveValue(
        'admin@example.com',
      )
    })

    it('renders key store field with correct value', async () => {
      await renderAndWait()
      expect(screen.getByTestId('key_store')).toHaveValue('/etc/certs/smtp.jks')
    })

    it('renders key store alias field with correct value', async () => {
      await renderAndWait()
      expect(screen.getByTestId('key_store_alias')).toHaveValue('smtp_sig_ec256')
    })

    it('renders signing algorithm field with correct value', async () => {
      await renderAndWait()
      expect(screen.getByTestId('signing_algorithm')).toHaveValue('SHA256withECDSA')
    })

    it('renders trust host toggle', async () => {
      await renderAndWait()
      const toggle = document.querySelector('input#trust_host[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(false)
    })

    it('renders requires authentication toggle as checked', async () => {
      await renderAndWait()
      const toggle = document.querySelector(
        'input#requires_authentication[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
    })

    it('renders Test button when data is loaded', async () => {
      await renderAndWait()
      expect(screen.getByText(/Test/i)).toBeInTheDocument()
    })

    it('renders footer with Back and Cancel buttons', async () => {
      await renderAndWait()
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
    })

    it('renders Apply button in footer', async () => {
      await renderAndWait()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })
  })

  describe('when SMTP config is loading', () => {
    beforeEach(() => {
      mockGetConfigSmtp.mockReturnValue({
        data: undefined,
        isLoading: true,
      })
    })

    it('renders form with empty values while loading', async () => {
      await act(async () => {
        render(<SmtpEditPage />, { wrapper: Wrapper })
      })
      const hostInput = screen.queryByTestId('host')
      expect(hostInput).toBeInTheDocument()
      expect(hostInput).toHaveValue('')
    })
  })

  describe('when SMTP config is empty', () => {
    beforeEach(() => {
      mockGetConfigSmtp.mockReturnValue({
        data: undefined,
        isLoading: false,
      })
    })

    it('renders empty host field', async () => {
      await act(async () => {
        render(<SmtpEditPage />, { wrapper: Wrapper })
      })
      const hostInput = await screen.findByTestId('host')
      expect(hostInput).toHaveValue('')
    })

    it('renders empty from name field', async () => {
      await act(async () => {
        render(<SmtpEditPage />, { wrapper: Wrapper })
      })
      const fromNameInput = await screen.findByTestId('from_name')
      expect(fromNameInput).toHaveValue('')
    })

    it('disables Test button when no config data exists', async () => {
      await act(async () => {
        render(<SmtpEditPage />, { wrapper: Wrapper })
      })
      await screen.findByTestId('host')
      const testBtn = screen.getByText(/Test/i).closest('button')
      expect(testBtn).toBeDisabled()
    })
  })
})

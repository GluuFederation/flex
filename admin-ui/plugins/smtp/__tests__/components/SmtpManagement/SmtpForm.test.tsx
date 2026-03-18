import React, { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import SmtpForm from 'Plugins/smtp/components/SmtpManagement/SmtpForm'

jest.mock('@/cedarling', () => ({
  useCedarling: jest.fn(() => ({
    hasCedarReadPermission: jest.fn(() => true),
    hasCedarWritePermission: jest.fn(() => true),
    authorizeHelper: jest.fn(),
  })),
  ADMIN_UI_RESOURCES: { Lock: 'Lock', SMTP: 'SMTP', Webhooks: 'Webhooks' },
  CEDAR_RESOURCE_SCOPES: { Lock: ['read', 'write'], SMTP: [], Webhooks: [] },
}))

jest.mock('@/cedarling/utility', () => ({
  ADMIN_UI_RESOURCES: { SMTP: 'SMTP', Webhooks: 'Webhooks' },
}))

jest.mock('@/cedarling/constants/resourceScopes', () => ({
  CEDAR_RESOURCE_SCOPES: { SMTP: [], Webhooks: [] },
}))

jest.mock('JansConfigApi', () => ({
  useGetConfigSmtp: jest.fn(() => ({ data: undefined, isLoading: false })),
  usePutConfigSmtp: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
  useTestConfigSmtp: jest.fn(() => ({ mutate: jest.fn(), isPending: false })),
  getGetConfigSmtpQueryKey: jest.fn(() => ['configSmtp']),
  useGetWebhooksByFeatureId: jest.fn(() => ({ data: [], isFetching: false, isFetched: true })),
}))

const mockSmtpConfig = {
  host: 'smtp.example.com',
  port: 587,
  connect_protection: 'StartTls' as const,
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

const handleSubmit = jest.fn()
const onTestSmtp = jest.fn()
const formikRef = { current: null }

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    <AppTestWrapper>
      <Provider store={store}>{children}</Provider>
    </AppTestWrapper>
  </QueryClientProvider>
)

const defaultProps = {
  handleSubmit,
  allowSmtpKeystoreEdit: true,
  onTestSmtp,
  formikRef,
  readOnly: false,
  testButtonEnabled: true,
}

const renderAndWait = async (ui: React.ReactElement) => {
  let result: ReturnType<typeof render>
  await act(async () => {
    result = render(ui, { wrapper: Wrapper })
  })
  await screen.findByTestId('host')
  return result!
}

describe('SmtpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with existing config (edit mode)', () => {
    it('populates host field with config value', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByTestId('host')).toHaveValue('smtp.example.com')
    })

    it('populates port field with config value', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByTestId('port')).toHaveValue(587)
    })

    it('populates from name field with config value', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByTestId('from_name')).toHaveValue('Gluu Admin')
    })

    it('populates from email field with config value', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByTestId('from_email_address')).toHaveValue('admin@example.com')
    })

    it('populates SMTP username field with config value', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByTestId('smtp_authentication_account_username')).toHaveValue(
        'admin@example.com',
      )
    })

    it('populates key store field with config value', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByTestId('key_store')).toHaveValue('/etc/certs/smtp.jks')
    })

    it('populates key store alias field with config value', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByTestId('key_store_alias')).toHaveValue('smtp_sig_ec256')
    })

    it('populates signing algorithm field with config value', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByTestId('signing_algorithm')).toHaveValue('SHA256withECDSA')
    })

    it('renders trust host toggle as unchecked', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      const toggle = document.querySelector('input#trust_host[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(false)
    })

    it('renders requires authentication toggle as checked', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      const toggle = document.querySelector(
        'input#requires_authentication[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
    })

    it('renders Test button when testButtonEnabled is true', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByText(/Test/i)).toBeInTheDocument()
    })

    it('renders footer with Back, Cancel, and Apply', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.getByText(/Cancel/i)).toBeInTheDocument()
      expect(screen.getByText(/Apply/i)).toBeInTheDocument()
    })
  })

  describe('with empty config', () => {
    it('renders empty host field', async () => {
      await renderAndWait(<SmtpForm item={undefined} {...defaultProps} />)
      expect(screen.getByTestId('host')).toHaveValue('')
    })

    it('renders empty from name field', async () => {
      await renderAndWait(<SmtpForm item={undefined} {...defaultProps} />)
      expect(screen.getByTestId('from_name')).toHaveValue('')
    })

    it('renders empty from email field', async () => {
      await renderAndWait(<SmtpForm item={undefined} {...defaultProps} />)
      expect(screen.getByTestId('from_email_address')).toHaveValue('')
    })

    it('defaults connect protection to None', async () => {
      await renderAndWait(<SmtpForm item={undefined} {...defaultProps} />)
      const selectEl = screen.getByTestId('connect_protection') as HTMLSelectElement
      expect(selectEl.value).toBe('None')
    })

    it('defaults trust host toggle to unchecked', async () => {
      await renderAndWait(<SmtpForm item={undefined} {...defaultProps} />)
      const toggle = document.querySelector('input#trust_host[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(false)
    })

    it('defaults requires authentication to unchecked', async () => {
      await renderAndWait(<SmtpForm item={undefined} {...defaultProps} />)
      const toggle = document.querySelector(
        'input#requires_authentication[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(false)
    })
  })

  describe('with readOnly mode', () => {
    it('hides Test button in read-only mode', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} readOnly />)
      expect(screen.queryByText(/Test/i)).not.toBeInTheDocument()
    })

    it('renders Back button and hides Cancel', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} readOnly />)
      expect(screen.getByText(/Back/i)).toBeInTheDocument()
      expect(screen.queryByText(/Cancel/i)).not.toBeInTheDocument()
    })

    it('disables host input field', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} readOnly />)
      expect(screen.getByTestId('host')).toBeDisabled()
    })

    it('disables trust host toggle', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} readOnly />)
      const toggle = document.querySelector('input#trust_host[type="checkbox"]') as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.disabled).toBe(true)
    })
  })

  describe('test button behavior', () => {
    it('disables Test button when testButtonEnabled is false', async () => {
      await renderAndWait(
        <SmtpForm item={mockSmtpConfig} {...defaultProps} testButtonEnabled={false} />,
      )
      const testBtn = screen.getByText(/Test/i).closest('button')
      expect(testBtn).toBeDisabled()
    })

    it('enables Test button when form is not dirty and testButtonEnabled is true', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      const testBtn = screen.getByText(/Test/i).closest('button')
      expect(testBtn).not.toBeDisabled()
    })

    it('disables Test button when form becomes dirty', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      await act(async () => {
        fireEvent.change(screen.getByTestId('host'), { target: { value: 'new.smtp.host.com' } })
      })

      await waitFor(() => {
        const testBtn = screen.getByText(/Test/i).closest('button')
        expect(testBtn).toBeDisabled()
      })
    })
  })

  describe('keystore toggle behavior', () => {
    it('renders allow keystore edit toggle', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      const toggle = document.querySelector(
        'input#allowKeystoreEdit[type="checkbox"]',
      ) as HTMLInputElement
      expect(toggle).toBeTruthy()
      expect(toggle.checked).toBe(true)
    })

    it('disables keystore fields when allowSmtpKeystoreEdit is false', async () => {
      await renderAndWait(
        <SmtpForm item={mockSmtpConfig} {...defaultProps} allowSmtpKeystoreEdit={false} />,
      )
      expect(screen.getByTestId('key_store')).toBeDisabled()
      expect(screen.getByTestId('key_store_alias')).toBeDisabled()
      expect(screen.getByTestId('signing_algorithm')).toBeDisabled()
    })

    it('enables keystore fields when allowSmtpKeystoreEdit is true', async () => {
      await renderAndWait(
        <SmtpForm item={mockSmtpConfig} {...defaultProps} allowSmtpKeystoreEdit />,
      )
      expect(screen.getByTestId('key_store')).not.toBeDisabled()
      expect(screen.getByTestId('key_store_alias')).not.toBeDisabled()
      expect(screen.getByTestId('signing_algorithm')).not.toBeDisabled()
    })
  })

  describe('form interactions', () => {
    it('allows typing in the host field', async () => {
      await renderAndWait(<SmtpForm item={undefined} {...defaultProps} />)
      const hostInput = screen.getByTestId('host')
      await act(async () => {
        fireEvent.change(hostInput, { target: { value: 'mail.test.com' } })
      })
      expect(hostInput).toHaveValue('mail.test.com')
    })

    it('allows typing in the from name field', async () => {
      await renderAndWait(<SmtpForm item={undefined} {...defaultProps} />)
      const fromNameInput = screen.getByTestId('from_name')
      await act(async () => {
        fireEvent.change(fromNameInput, { target: { value: 'Test Sender' } })
      })
      expect(fromNameInput).toHaveValue('Test Sender')
    })

    it('allows typing in the from email field', async () => {
      await renderAndWait(<SmtpForm item={undefined} {...defaultProps} />)
      const emailInput = screen.getByTestId('from_email_address')
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      })
      expect(emailInput).toHaveValue('test@example.com')
    })

    it('triggers commit dialog flow when Apply is clicked on dirty valid form', async () => {
      await renderAndWait(<SmtpForm item={mockSmtpConfig} {...defaultProps} />)
      await act(async () => {
        fireEvent.change(screen.getByTestId('host'), { target: { value: 'updated.smtp.com' } })
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

import { ConnectProtection } from 'Plugins/smtp-management/components/SmtpManagement/types/SmtpForm.types'

// TypeScript definitions for SMTP Configuration API
export interface SmtpConfiguration {
  host?: string
  port?: number
  connect_protection?: ConnectProtection
  from_name?: string
  from_email_address?: string
  requires_authentication?: boolean
  smtp_authentication_account_username?: string
  smtp_authentication_account_password?: string
  trust_host?: boolean
  key_store?: string
  key_store_password?: string
  key_store_alias?: string
  signing_algorithm?: string
}

export interface SmtpTest {
  sign?: boolean
  subject?: string
  message?: string
}

export interface SmtpConfigurationOptions {
  smtpConfiguration?: SmtpConfiguration
}

export interface SmtpTestOptions {
  smtpTest?: SmtpTest
}

// API callback types
export type SmtpCallback<T> = (error: Error | null, data?: T, response?: unknown) => void

// API interface for ConfigurationSMTPApi
export interface IConfigurationSMTPApi {
  deleteConfigSmtp: (callback: SmtpCallback<void>) => void
  getConfigSmtp: (callback: SmtpCallback<SmtpConfiguration>) => void
  postConfigSmtp: (
    opts: SmtpConfigurationOptions,
    callback: SmtpCallback<SmtpConfiguration>,
  ) => void
  putConfigSmtp: (opts: SmtpConfigurationOptions, callback: SmtpCallback<SmtpConfiguration>) => void
  testConfigSmtp: (opts: SmtpTestOptions, callback: SmtpCallback<boolean>) => void
}

// Response types for the wrapper API
export interface SmtpApiResponse<T = unknown> {
  data?: T
  error?: Error
}

// Redux state types
export interface SmtpState {
  smtp: SmtpConfiguration
  loading: boolean
  testStatus: boolean | null
  openModal: boolean
}

// Redux action payload types
export interface SmtpResponsePayload {
  data?: SmtpConfiguration
}

export interface SmtpTestResponsePayload {
  data?: boolean
}

export interface SmtpTestPayload {
  payload: SmtpTestOptions
}

export interface SmtpUpdatePayload {
  smtpConfiguration: SmtpConfiguration
}

// Root state interface for selectors
export interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
    config?: {
      allowSmtpKeystoreEdit?: boolean
    }
  }
  smtpsReducer: SmtpState
}

// Saga error type
export interface SagaError {
  response?: {
    status: number
    data?: unknown
  }
  message?: string
}

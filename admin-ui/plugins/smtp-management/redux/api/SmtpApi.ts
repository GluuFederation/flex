import { handleResponse } from 'Utils/ApiUtils'

// Define SMTP configuration structure
interface SmtpConfiguration {
  host?: string
  port?: number
  connect_protection?: string
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

// Define test SMTP options structure
interface TestSmtpOptions {
  smtpTest: {
    sign: boolean
    subject: string
    message: string
  }
}

// Define the API client interface
interface SmtpApiClient {
  getConfigSmtp: (callback: (error: Error | null, data: unknown) => void) => void
  putConfigSmtp: (
    input: SmtpConfiguration,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
  testConfigSmtp: (
    input: TestSmtpOptions,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
}

export default class SmtpApi {
  private readonly api: SmtpApiClient

  constructor(api: SmtpApiClient) {
    this.api = api
  }

  // Get SMTP Config
  getSmtpConfig = (): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.getConfigSmtp((error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  // update SMTP Config
  updateSmtpConfig = (input: SmtpConfiguration): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.putConfigSmtp(input, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }

  // test SMTP Config
  testSmtpConfig = (input: TestSmtpOptions): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      this.api.testConfigSmtp(input, (error: Error | null, data: unknown) => {
        handleResponse(error, reject, resolve, data, null)
      })
    })
  }
}

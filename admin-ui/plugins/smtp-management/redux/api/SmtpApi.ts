import { handleResponse } from 'Utils/ApiUtils'
import {
  IConfigurationSMTPApi,
  SmtpConfiguration,
  SmtpConfigurationOptions,
  SmtpTestOptions,
} from '../types/SmtpApi.type'

export default class SmtpApi {
  private readonly api: IConfigurationSMTPApi

  constructor(api: IConfigurationSMTPApi) {
    this.api = api
  }

  // Get SMTP Config
  getSmtpConfig = (): Promise<SmtpConfiguration> => {
    return new Promise<SmtpConfiguration>((resolve, reject) => {
      this.api.getConfigSmtp((error: Error | null, data?: SmtpConfiguration) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  // Update SMTP Config
  updateSmtpConfig = (input: SmtpConfigurationOptions): Promise<SmtpConfiguration> => {
    return new Promise<SmtpConfiguration>((resolve, reject) => {
      this.api.putConfigSmtp(input, (error: Error | null, data?: SmtpConfiguration) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  // Test SMTP Config
  testSmtpConfig = (input: SmtpTestOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      this.api.testConfigSmtp(input, (error: Error | null, data?: boolean) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  // Add SMTP Config (optional method based on ConfigurationSMTPApi)
  addSmtpConfig = (input: SmtpConfigurationOptions): Promise<SmtpConfiguration> => {
    return new Promise<SmtpConfiguration>((resolve, reject) => {
      this.api.postConfigSmtp(input, (error: Error | null, data?: SmtpConfiguration) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, data)
      })
    })
  }

  // Delete SMTP Config (optional method based on ConfigurationSMTPApi)
  deleteSmtpConfig = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.api.deleteConfigSmtp((error: Error | null) => {
        handleResponse(error, reject, resolve as (data: unknown) => void, undefined)
      })
    })
  }
}

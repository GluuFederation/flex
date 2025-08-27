import { handleTypedResponse } from 'Utils/ApiUtils'
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
        handleTypedResponse<SmtpConfiguration>(error, reject, resolve, data)
      })
    })
  }

  // Update SMTP Config
  updateSmtpConfig = (input: SmtpConfigurationOptions): Promise<SmtpConfiguration> => {
    return new Promise<SmtpConfiguration>((resolve, reject) => {
      this.api.putConfigSmtp(input, (error: Error | null, data?: SmtpConfiguration) => {
        handleTypedResponse<SmtpConfiguration>(error, reject, resolve, data)
      })
    })
  }

  // Test SMTP Config
  testSmtpConfig = (input: SmtpTestOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      this.api.testConfigSmtp(input, (error: Error | null, data?: boolean) => {
        handleTypedResponse<boolean>(error, reject, resolve, data)
      })
    })
  }

  // Add SMTP Config (optional method based on ConfigurationSMTPApi)
  addSmtpConfig = (input: SmtpConfigurationOptions): Promise<SmtpConfiguration> => {
    return new Promise<SmtpConfiguration>((resolve, reject) => {
      this.api.postConfigSmtp(input, (error: Error | null, data?: SmtpConfiguration) => {
        handleTypedResponse<SmtpConfiguration>(error, reject, resolve, data)
      })
    })
  }

  // Delete SMTP Config (optional method based on ConfigurationSMTPApi)
  deleteSmtpConfig = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      this.api.deleteConfigSmtp((error: Error | null) => {
        handleTypedResponse<void>(error, reject, resolve, undefined)
      })
    })
  }
}

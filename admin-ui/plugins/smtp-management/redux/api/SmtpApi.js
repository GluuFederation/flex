import { handleResponse } from 'Utils/ApiUtils'

export default class SmtpApi {
  constructor(api) {
    this.api = api
  }
  // Get SMTP Config
  getSmtpConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigSmtp((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // update SMTP Config
  updateSmtpConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigSmtp(input, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // test SMTP Config
  testSmtpConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.testConfigSmtp(input, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

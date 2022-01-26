export default class SmtpApi {
  constructor(api) {
    this.api = api
  }

  // Get SMTP Config
  getSmtpConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigSmtp((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // update SMTP Config
  updateSmtpConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigSmtp(input, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Add SMTP Config
  addSmtpConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigSmtp(input, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // test SMTP Config
  testSmtpConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.testConfigSmtp((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  handleResponse(error, reject, resolve, data) {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  }
}

export default class SmtpApi {
  constructor(api) {
    this.api = api
  }

  // Get SMTP Config
  getSmtpConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigSmtp((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // update SMTP Config
  updateSmtpConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigSmtp(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Add SMTP Config
  addSmtpConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigSmtp(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // test SMTP Config
  testSmtpConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.testConfigSmtp(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}

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
  testSmtpConfig = () => {
	  console.log('Smtp Api testSmtpConfig  ')
    return new Promise((resolve, reject) => {
      this.api.testConfigSmtp((error, data, response) => {
        if (error) {
        	console.log('Smtp Api testSmtpConfig error ='+JSON.stringify(error))
          reject(error)
        } else {
        	console.log('Smtp Api testSmtpConfig response  ='+response)
        	console.log('Smtp Api testSmtpConfig  data ='+JSON.stringify(data))
        	resolve(data)
        }
      })
    })
  }
}

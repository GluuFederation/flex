import { getDefaultClient } from './base'
const JansConfigApi = require('jans_config_api')
const api = new JansConfigApi.ConfigurationSMTPApi(
  getDefaultClient(JansConfigApi),
)

// Get SMTP Config
export const getSmtpConfig = () => {
  return new Promise((resolve, reject) => {
    api.getConfigSmtp((error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

// update SMTP Config
export const updateSmtpConfig = (input) => {
  console.log('***********************' + input)
  return new Promise((resolve, reject) => {
    api.putConfigSmtp(input, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

// Add SMTP Config
export const addSmtpConfig = (input) => {
  return new Promise((resolve, reject) => {
    api.postConfigSmtp(input, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

// test SMTP Config
export const testSmtpConfig = (input) => {
  return new Promise((resolve, reject) => {
    api.testConfigSmtp(input, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

import { getDefaultClient } from './base'
const JansConfigApi = require('jans_config_api')
const api = new JansConfigApi.ConfigurationLoggingApi(
  getDefaultClient(JansConfigApi),
)

// get logging Config
export const getLoggingConfig = () => {
  return new Promise((resolve, reject) => {
    api.getConfigLogging((error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

// update logging Config
export const editLoggingConfig = (input) => {
  console.log('***********************' + input)
  return new Promise((resolve, reject) => {
    api.putConfigLogging(input, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

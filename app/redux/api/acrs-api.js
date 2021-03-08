import { getDefaultClient } from './base'
const JansConfigApi = require('jans_config_api')
const api = new JansConfigApi.DefaultAuthenticationMethodApi(
  getDefaultClient(JansConfigApi),
)
// Get Acrs Config
export const getAcrsConfig = () => {
  return new Promise((resolve, reject) => {
    api.getAcrs((error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

// update Acrs Config
export const updateAcrsConfig = (input) => {
  console.log('***********************' + input)
  return new Promise((resolve, reject) => {
    api.putAcrs(input, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

import { getDefaultClient } from './base'
const JansConfigApi = require('jans_config_api')
const api = new JansConfigApi.ConfigurationFido2Api(
  getDefaultClient(JansConfigApi),
)

// get fido Config
export const getFidoConfig = () => {
  return new Promise((resolve, reject) => {
    api.getPropertiesFido2((error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

// update fido Config
export const updateFidoConfig = (input) => {
  console.log('***********************' + input)
  return new Promise((resolve, reject) => {
    api.putPropertiesFido2(input, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

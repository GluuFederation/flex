import { getDefaultClient } from './base'
const JansConfigApi = require('jans_config_api')
const api = new JansConfigApi.AttributeApi(getDefaultClient(JansConfigApi))

// Get all attributes
export const getAllAttributes = () => {
  return new Promise((resolve, reject) => {
    api.getAttributes({}, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

export const addNewAttribute = (data) => {
  return new Promise((resolve, reject) => {
    api.postAttributes(data, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

export const editAnAttribute = (data) => {
  return new Promise((resolve, reject) => {
    api.putAttributes(data, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

export const deleteAnAttribute = async (inum) => {
  return new Promise((resolve, reject) => {
    api.deleteAttributesByInum(inum, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

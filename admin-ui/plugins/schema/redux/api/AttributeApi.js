import { handleResponse } from 'Utils/ApiUtils'

export default class AttributeApi {
  constructor(api) {
    this.api = api
  }

  // Get all attributes
  getAllAttributes = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(opts, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  // search attributes
  searchAttributes = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(opts, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  addNewAttribute = (data) => {
    return new Promise((resolve, reject) => {
      this.api.postAttributes(data, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  editAnAttribute = (data) => {
    return new Promise((resolve, reject) => {
      this.api.putAttributes(data, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  deleteAnAttribute = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteAttributesByInum(inum, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

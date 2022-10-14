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
}

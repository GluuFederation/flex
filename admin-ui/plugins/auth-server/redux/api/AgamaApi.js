import { handleResponse } from 'Utils/ApiUtils'

export default class AgamaApi {
  constructor(api) {
    this.api = api
  }

  // Get Agama
  getAgama = (payload) => {
    return new Promise((resolve, reject) => {
      this.api.getAgamaDevPrj(payload, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
  deleteAgama = ({payload}) => {
    return new Promise((resolve, reject) => {
      this.api.deleteAgamaDevStudioPrj(payload.name, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

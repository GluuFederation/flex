import { handleResponse } from 'Utils/ApiUtils'

export default class AuditApi {
  constructor(api) {
    this.api = api
  }

  getAuditLogs = () => {
    return new Promise((resolve, reject) => {
      this.api.getAuditData((error, data) => {
        debugger

        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

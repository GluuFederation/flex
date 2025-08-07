import { handleResponse } from 'Utils/ApiUtils'

export default class AuditApi {
  constructor(api) {
    this.api = api
  }

  getAuditLogs = (reqPayload) => {
    return new Promise((resolve, reject) => {
      this.api.getAuditData(reqPayload, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

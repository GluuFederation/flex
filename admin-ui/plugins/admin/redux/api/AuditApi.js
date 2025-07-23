import { handleResponse } from 'Utils/ApiUtils'

export default class AuditApi {
  constructor(api) {
    this.api = api
  }

  getAuditLogs = () => {
    console.log('Fetching audit logs...')
    return new Promise((resolve, reject) => {
      this.api.getAuditLogs((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

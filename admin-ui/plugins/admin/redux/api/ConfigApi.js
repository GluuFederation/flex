import { handleResponse } from 'Utils/ApiUtils'

export default class RoleApi {
  constructor(api) {
    this.api = api
  }
  getConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getAdminuiConf((error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  editConfig = (data) => {
    const options = {}
    options['appConfigResponse'] = data
    return new Promise((resolve, reject) => {
      this.api.editAdminuiConf({}, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

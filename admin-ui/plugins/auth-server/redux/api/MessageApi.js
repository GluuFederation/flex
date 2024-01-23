import { handleResponse } from 'Utils/ApiUtils'

export default class MessageApi {
  constructor(api) {
    this.api = api
  }

  getConfigMessage = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigMessage((error, data, response) => {
        if (response?.body) {
          handleResponse(error, reject, resolve, response.body)
        } else {
          handleResponse(error, reject, resolve, data)
        }
      })
    })
  }

  patchConfigMessage = (data) => {
    return new Promise((resolve, reject) => {
      this.api.patchConfigMessage(data, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  putConfigMessagePostgres = (opts) => {
    const data = {
      postgresMessageConfiguration: opts,
    }
    return new Promise((resolve, reject) => {
      this.api.putConfigMessagePostgres(data, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  putConfigMessageRedis = (opts) => {
    const data = {
      redisMessageConfiguration: opts,
    }
    return new Promise((resolve, reject) => {
      this.api.putConfigMessageRedis(data, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

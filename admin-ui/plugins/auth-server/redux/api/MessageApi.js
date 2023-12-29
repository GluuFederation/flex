import { handleResponse } from 'Utils/ApiUtils'
import axios from 'Redux/api/axios'

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

  patchConfigMessage = ({ data, token }) => {
    return new Promise((resolve, reject) => {
      axios
        .patch('/api/v1/config/message', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json-patch+json',
          },
        })
        .then((result) => handleResponse(undefined, reject, resolve, result))
        .catch((error) => handleResponse(error, reject, resolve, undefined))
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

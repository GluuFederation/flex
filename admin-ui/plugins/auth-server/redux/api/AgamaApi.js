import { handleResponse } from 'Utils/ApiUtils'
import axios from '../../../../app/redux/api/axios'
export default class AgamaApi {
  constructor(api) {
    this.api = api
  }

  // Get Agama
  getAgama = (payload) => {
    return new Promise((resolve, reject) => {
      this.api.getAgamaPrj(payload, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }

  addAgama = ({payload}) => {
    const {file, name, token} = payload
    return new Promise((resolve, reject) => {
        axios.post('/api/v1/agama-deployment/' + name, file, {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/zip',
          }
        })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  deleteAgama = ({payload}) => {
    return new Promise((resolve, reject) => {
      this.api.deleteAgamaPrj(payload.name, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

import { handleResponse } from 'Utils/ApiUtils'

export default class SsaApi {
  constructor(api) {
    this.api = api
  }

  getAllSsa = ({ payload, authServerHost }) => {
    const { token } = payload
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa`, {
        headers,
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          handleResponse(null, reject, resolve, data)
        })
        .catch((error) => {
          handleResponse(error, reject, resolve, null)
        })
    })
  }

  createSsa = ({ payload, token, authServerHost }) => {
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa`, {
        headers,
        method: 'POST',
        body: JSON.stringify(payload),
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          handleResponse(null, reject, resolve, data)
        })
        .catch((error) => {
          handleResponse(error, reject, resolve, null)
        })
    })
  }

  getSsaJwt = ({ jti, token, authServerHost }) => {
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa/jwt?jti=${encodeURIComponent(jti)}`, {
        headers,
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          handleResponse(null, reject, resolve, data)
        })
        .catch((error) => {
          handleResponse(error, reject, resolve, null)
        })
    })
  }

  removeSsa = ({ jti }) => {
    return new Promise((resolve, reject) => {
      this.api.revokeSsa({ jti }, (error, data) => {
        handleResponse(error, reject, resolve, data)
      })
    })
  }
}

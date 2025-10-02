import { handleResponse } from 'Utils/ApiUtils'

export default class SsaApi {
  constructor(api) {
    this.api = api
  }

  getAllSsa = ({ payload, authServerHost }) => {
    const { token } = payload
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa`, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'GET',
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
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa`, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
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
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa/jwt?jti=${encodeURIComponent(jti)}`, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'GET',
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

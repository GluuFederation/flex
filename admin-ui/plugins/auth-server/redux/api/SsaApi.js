export default class SsaApi {
  constructor(api) {
    this.api = api
  }

  getAllSsa = ({ payload, authServerHost }) => {
    const { token } = payload
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa`, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'GET'
      })
      .then((response) => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      }) 
    })
  }

  createSsa = ({ payload, token, authServerHost }) => {
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa`, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload)
      })
      .then((response) => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      }) 
    })
  }

  getSsaJwt = ({ jti, token, authServerHost }) => {
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa/jwt?jti=${encodeURIComponent(jti)}`, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json', 
        },
        method: 'GET'
      })
      .then((response) => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }
  
  deleteSsa = ({ jti, token, authServerHost }) => {
    return new Promise((resolve, reject) => {
      fetch(`${authServerHost}/jans-auth/restv1/ssa?jti=${jti}`, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      })
      .then((response) => response.json())
      .then((data) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      }) 
    })
  }
}

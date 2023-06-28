const API_BASE_URL = process.env.JANS_AUTH

export default class SsaApi {
  constructor(api) {
    this.api = api
  }

  getAllSsa = async ({ payload }) => {
    const { token } = payload
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/restv1/ssa`, {
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

  createSsa = async ({ payload, token }) => {
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/restv1/ssa`, {
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
  
  deleteSsa = async ({ jti, token }) => {
    return new Promise((resolve, reject) => {
      fetch(`${API_BASE_URL}/restv1/ssa?jti=${jti}`, {
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

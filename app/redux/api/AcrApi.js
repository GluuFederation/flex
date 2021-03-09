export default class AcrApi {
  constructor(api) {
    this.api = api
  }

  // Get Acrs Config
  getAcrsConfig = () => {
    return new Promise((resolve, reject) => {
      this.api.getAcrs((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // update Acrs Config
  updateAcrsConfig = (input) => {
    console.log('***********************' + input)
    return new Promise((resolve, reject) => {
      this.api.putAcrs(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}

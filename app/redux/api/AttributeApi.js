export default class AttributeApi {
  constructor(api) {
    this.api = api
  }

  // Get all attributes
  getAllAttributes = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(opts, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // search attributes
  searchAttributes = (opts) => {
    return new Promise((resolve, reject) => {
      this.api.getAttributes(opts, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  addNewAttribute = (data) => {
    return new Promise((resolve, reject) => {
      this.api.postAttributes(data, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  editAnAttribute = (data) => {
    return new Promise((resolve, reject) => {
      this.api.putAttributes(data, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  deleteAnAttribute = async (inum) => {
    return new Promise((resolve, reject) => {
      this.api.deleteAttributesByInum(inum, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}

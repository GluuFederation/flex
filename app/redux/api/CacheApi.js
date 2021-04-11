export default class CacheApi {
  constructor(api) {
    this.api = api
  }

  // Get Cache Config
  getConfigCache = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCache((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Get Memory Cache
  getConfigCacheInMemory = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCacheInMemory((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Get Mem Cache
  getConfigCacheMemcached = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCacheMemcached((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Get Native Cache
  getConfigCacheNativePersistence = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCacheNativePersistence((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Get Redis Cache
  getConfigCacheRedis = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCacheRedis((error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // update Cache Config

  updateCacheConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigCache(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  updateCacheMemoryConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigCacheInMemory(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  updateCacheMemConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigCacheMemcached(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  updateCacheNativeConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigCacheNativePersistence(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  updateCacheRedisConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigCacheRedis(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  // Add Cache Config
  addCacheConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigCache(input, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }
}

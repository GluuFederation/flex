export default class CacheApi {
  constructor(api) {
    this.api = api
  }

  // Get Cache Config
  getConfigCache = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCache((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Get Memory Cache
  getConfigCacheInMemory = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCacheInMemory((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Get Mem Cache
  getConfigCacheMemcached = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCacheMemcached((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Get Native Cache
  getConfigCacheNativePersistence = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCacheNativePersistence((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Get Redis Cache
  getConfigCacheRedis = () => {
    return new Promise((resolve, reject) => {
      this.api.getConfigCacheRedis((error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // update Cache Config
  updateCacheConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.patchConfigCache(input, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateCacheMemoryConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigCacheInMemory(input, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateCacheMemConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigCacheMemcached(input, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateCacheNativeConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigCacheNativePersistence(input, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  updateCacheRedisConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.putConfigCacheRedis(input, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  // Add Cache Config
  addCacheConfig = (input) => {
    return new Promise((resolve, reject) => {
      this.api.postConfigCache(input, (error, data) => {
        this.handleResponse(error, reject, resolve, data)
      })
    })
  }

  handleResponse(error, reject, resolve, data) {
    if (error) {
      reject(error)
    } else {
      resolve(data)
    }
  }
}

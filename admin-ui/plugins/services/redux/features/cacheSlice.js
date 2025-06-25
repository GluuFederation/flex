import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cache: {},
  cacheMemory: {},
  cacheMem: {},
  cacheNative: {},
  cacheRedis: {},
  loading: false,
}

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    getCacheConfig: (state) => {
      state.loading = true
    },
    getCacheResponse: (state, action) => {
      if (action.payload?.data) {
        state.cache = action.payload.data
        state.loading = false
      } else {
        state.loading = false
      }
    },
    getMemoryCacheConfig: (state) => {
      state.loading = true
    },
    getMemoryCacheResponse: (state, action) => {
      if (action.payload?.data) {
        state.cacheMemory = action.payload.data
        state.loading = false
      } else {
        state.loading = false
      }
    },
    getMemCacheConfig: (state) => {
      state.loading = true
    },
    getMemCacheResponse: (state, action) => {
      if (action.payload?.data) {
        state.cacheMem = action.payload.data
        state.loading = false
      } else {
        state.loading = false
      }
    },
    getNativeCacheConfig: (state) => {
      state.loading = true
    },
    getNativeCacheResponse: (state, action) => {
      if (action.payload?.data) {
        state.cacheNative = action.payload.data
        state.loading = false
      } else {
        state.loading = false
      }
    },
    getRedisCacheConfig: (state) => {
      state.loading = true
    },
    getRedisCacheResponse: (state, action) => {
      if (action.payload?.data) {
        state.cacheRedis = action.payload.data
        state.loading = false
      } else {
        state.loading = false
      }
    },
    addCache: (state) => {
      state.loading = true
    },
    addCacheResponse: (state, action) => {
      state.cache = action.payload?.data
      state.loading = false
    },
    editCache: (state) => {
      state.loading = true
    },
    editCacheResponse: (state, action) => {
      state.cache = action.payload?.data
      state.loading = false
    },
    editMemoryCache: (state) => {
      state.loading = true
    },
    editMemoryCacheResponse: (state, action) => {
      state.cacheMemory = action.payload?.data
      state.loading = false
    },
    editMemCache: (state) => {
      state.loading = true
    },
    editMemCacheResponse: (state, action) => {
      state.cacheMem = action.payload?.data
      state.loading = false
    },
    editNativeCache: (state) => {
      state.loading = true
    },
    editNativeCacheResponse: (state, action) => {
      state.cacheNative = action.payload?.data
      state.loading = false
    },
    editRedisCache: (state) => {
      state.loading = true
    },
    editRedisCacheResponse: (state, action) => {
      state.cacheRedis = action.payload?.data
      state.loading = false
    },
  },
})

export const {
  getCacheConfig,
  getCacheResponse,
  getMemoryCacheConfig,
  getMemoryCacheResponse,
  getMemCacheConfig,
  getMemCacheResponse,
  getNativeCacheConfig,
  getNativeCacheResponse,
  getRedisCacheConfig,
  getRedisCacheResponse,
  addCache,
  addCacheResponse,
  editCache,
  editCacheResponse,
  editMemoryCache,
  editMemoryCacheResponse,
  editMemCache,
  editMemCacheResponse,
  editNativeCache,
  editNativeCacheResponse,
  editRedisCache,
  editRedisCacheResponse,
} = cacheSlice.actions
export { initialState }
export const { actions, reducer } = cacheSlice

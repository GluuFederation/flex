import {
    GET_CACHE,
    GET_CACHE_RESPONSE,
    GET_MEMORY_CACHE,
    GET_MEMORY_CACHE_RESPONSE,
    GET_MEM_CACHE,
    GET_MEM_CACHE_RESPONSE,
    GET_NATIVE_CACHE,
    GET_NATIVE_CACHE_RESPONSE,
    GET_REDIS_CACHE,
    GET_REDIS_CACHE_RESPONSE,


    PUT_CACHE,
    PUT_CACHE_RESPONSE,
    PUT_MEMORY_CACHE,
    PUT_MEMORY_CACHE_RESPONSE,
    PUT_MEM_CACHE,
    PUT_MEM_CACHE_RESPONSE,
    PUT_NATIVE_CACHE,
    PUT_NATIVE_CACHE_RESPONSE,
    PUT_REDIS_CACHE,
    PUT_REDIS_CACHE_RESPONSE,

    SET_CACHE,
    SET_CACHE_RESPONSE,
    
  } from './types'
  
  export const getCacheConfig = () => ({
    type: GET_CACHE,
  })
  
  export const getCacheResponse = (data) => ({
    type: GET_CACHE_RESPONSE,
    payload: { data },
  })

  export const getMemoryCacheConfig = () => ({
    type: GET_MEMORY_CACHE,
  })
  
  export const getMemoryCacheResponse = (data) => ({
    type: GET_MEMORY_CACHE_RESPONSE,
    payload: { data },
  })

  export const getMemCacheConfig = () => ({
    type: GET_MEM_CACHE,
  })
  
  export const getMemCacheResponse = (data) => ({
    type: GET_MEM_CACHE_RESPONSE,
    payload: { data },
  })

  export const getNativeCacheConfig = () => ({
    type: GET_NATIVE_CACHE,
  })
  
  export const getNativeCacheResponse = (data) => ({
    type: GET_NATIVE_CACHE_RESPONSE,
    payload: { data },
  })

  export const getRedisCacheConfig = () => ({
    type: GET_REDIS_CACHE,
  })
  
  export const getRedisCacheResponse = (data) => ({
    type: GET_REDIS_CACHE_RESPONSE,
    payload: { data },
  })


  export const addCache = (data) => ({
    type: SET_CACHE,
    payload: { data },
  })
  export const addCacheResponse = (data) => ({
    type: SET_CACHE_RESPONSE,
    payload: { data },
  })



  // Cache Editing
  
  export const editCache = (data) => ({
    type: PUT_CACHE,
    payload: { data },
  })
  export const editCacheResponse = (data) => ({
    type: PUT_CACHE_RESPONSE,
    payload: { data },
  })

  export const editMemoryCache = (data) => ({
    type: PUT_MEMORY_CACHE,
    payload: { data },
  })
  export const editMemoryCacheResponse = (data) => ({
    type: PUT_MEMORY_CACHE_RESPONSE,
    payload: { data },
  })

  export const editMemCache = (data) => ({
    type: PUT_MEM_CACHE,
    payload: { data },
  })
  export const editMemCacheResponse = (data) => ({
    type: PUT_MEM_CACHE_RESPONSE,
    payload: { data },
  })

  export const editNativeCache = (data) => ({
    type: PUT_NATIVE_CACHE,
    payload: { data },
  })
  export const editNativeCacheResponse = (data) => ({
    type: PUT_NATIVE_CACHE_RESPONSE,
    payload: { data },
  })

  export const editRedisCache = (data) => ({
    type: PUT_REDIS_CACHE,
    payload: { data },
  })
  export const editRedisCacheResponse = (data) => ({
    type: PUT_REDIS_CACHE_RESPONSE,
    payload: { data },
  })

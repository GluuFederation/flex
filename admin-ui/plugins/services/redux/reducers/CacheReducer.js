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
  SET_CACHE,
  SET_CACHE_RESPONSE,
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
  RESET,
} from '../actions/types'

const INIT_STATE = {
  cache: {},
  cacheMemory: {},
  cacheMem: {},
  cacheNative: {},
  cacheRedis: {},
  loading: false,
  isSuccess: false,
  isError: false,
}

const reducerName = 'cacheReducer'

export default function cacheReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case GET_CACHE:
      return {
        ...state,
        loading: true,
      }
    case GET_CACHE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          cache: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case GET_MEMORY_CACHE:
      return {
        ...state,
        loading: true,
      }
    case GET_MEMORY_CACHE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          cacheMemory: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case GET_MEM_CACHE:
      return {
        ...state,
        loading: true,
      }
    case GET_MEM_CACHE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          cacheMem: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case GET_NATIVE_CACHE:
      return {
        ...state,
        loading: true,
      }
    case GET_NATIVE_CACHE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          cacheNative: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case GET_REDIS_CACHE:
      return {
        ...state,
        loading: true,
      }
    case GET_REDIS_CACHE_RESPONSE:
      if (action.payload.data) {
        return {
          ...state,
          cacheRedis: action.payload.data,
          loading: false,
        }
      } else {
        return {
          ...state,
          loading: false,
        }
      }

    case SET_CACHE:
      return {
        ...state,
        loading: true,
      }
    case SET_CACHE_RESPONSE:
      return {
        ...state,
        cache: action.payload.data,
        loading: false,
      }

    case PUT_CACHE:
      return {
        ...state,
        loading: true,
        isSuccess: false,
        isError: false,
      }
    case PUT_CACHE_RESPONSE:
      return {
        ...state,
        cache: action.payload.data,
        loading: false,
        isSuccess: true,
        isError: false,
      }

    case PUT_MEMORY_CACHE:
      return {
        ...state,
        loading: true,
        isSuccess: false,
        isError: false,
      }
    case PUT_MEMORY_CACHE_RESPONSE:
      return {
        ...state,
        cacheMemory: action.payload.data,
        loading: false,
        isSuccess: true,
        isError: false,
      }

    case PUT_MEM_CACHE:
      return {
        ...state,
        loading: true,
        isSuccess: false,
        isError: false,
      }
    case PUT_MEM_CACHE_RESPONSE:
      return {
        ...state,
        cacheMem: action.payload.data,
        loading: false,
        isSuccess: true,
        isError: false,
      }

    case PUT_NATIVE_CACHE:
      return {
        ...state,
        loading: true,
        isSuccess: false,
        isError: false,
      }
    case PUT_NATIVE_CACHE_RESPONSE:
      return {
        ...state,
        cacheNative: action.payload.data,
        loading: false,
        isSuccess: true,
        isError: false,
      }

    case PUT_REDIS_CACHE:
      return {
        ...state,
        loading: true,
        isSuccess: false,
        isError: false,
      }
    case PUT_REDIS_CACHE_RESPONSE:
      return {
        ...state,
        cacheRedis: action.payload.data,
        loading: false,
        isSuccess: true,
        isError: false,
      }
    case RESET:
      return {
        ...state,
        cache: INIT_STATE.cache,
        loading: INIT_STATE.loading,
      }
    default:
      return {
        ...state,
      }
  }
}

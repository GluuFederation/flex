import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from '../../utils/TokenController'
import {
  getCacheResponse,
  getMemoryCacheResponse,
  getMemCacheResponse,
  getNativeCacheResponse,
  getRedisCacheResponse,
  addCacheResponse,
  editCacheResponse,
  editMemCacheResponse,
  editMemoryCacheResponse,
  editNativeCacheResponse,
  editRedisCacheResponse,
} from '../actions/CacheActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import {
  GET_CACHE,
  GET_MEMORY_CACHE,
  GET_MEM_CACHE,
  GET_NATIVE_CACHE,
  GET_REDIS_CACHE,
  PUT_CACHE,
  PUT_MEMORY_CACHE,
  PUT_MEM_CACHE,
  PUT_NATIVE_CACHE,
  PUT_REDIS_CACHE,
  SET_CACHE,
} from '../actions/types'
import CacheApi from '../api/CacheApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')

export function* getCache() {
  try {
    const api = yield* newFunctionForCacheConfig()
    const data = yield call(api.getCacheConfig)
    console.log('real data: ', data)
    yield put(getCacheResponse(data))
  } catch (e) {
    yield put(getCacheResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getMemoryCache() {
  try {
    const api = yield* newFunctionForMemoryCache()
    const data = yield call(api.getConfigCacheInMemory)
    yield put(getMemoryCacheResponse(data))
  } catch (e) {
    yield put(getMemoryCacheResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getMemCache() {
  try {
    const api = yield* newFunctionForMemCache()
    const data = yield call(api.getConfigCacheMemcached)
    yield put(getMemCacheResponse(data))
  } catch (e) {
    yield put(getMemCacheResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getNativeCache() {
  try {
    const api = yield* newFunctionForNativeCache()
    const data = yield call(api.getConfigCacheNativePersistence)
    yield put(getNativeCacheResponse(data))
  } catch (e) {
    yield put(getNativeCacheResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getRedisCache() {
  try {
    const api = yield* newFunctionForRedisCache()
    const data = yield call(api.getConfigCacheRedis)
    yield put(getRedisCacheResponse(data))
  } catch (e) {
    yield put(getRedisCacheResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

// Getting end here .............

export function* addCache({ payload }) {
  try {
    const api = yield* newFunction()
    const data = yield call(api.addCacheConfig, payload.data)
    yield put(addCacheResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

// Editing Cache Saga

export function* editCache({ payload }) {
  try {
    const api = yield* newFunctionForCacheConfig()
    const data = yield call(api.updateCacheConfig, payload.data)
    yield put(editCacheResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

export function* editMemoryCache({ payload }) {
  try {
    const api = yield* newFunctionForMemoryCache()
    const data = yield call(api.updateCacheMemoryConfig, payload.data)
    yield put(editMemoryCacheResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

export function* editMemCache({ payload }) {
  try {
    const api = yield* newFunctionForMemCache()
    const data = yield call(api.updateCacheMemConfig, payload.data)
    yield put(editMemCacheResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

export function* editNativeCache({ payload }) {
  try {
    const api = yield* newFunctionForNativeCache()
    const data = yield call(api.updateCacheNativeConfig, payload.data)
    yield put(editNativeCacheResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

export function* editRedisCache({ payload }) {
  try {
    const api = yield* newFunctionForRedisCache()
    const data = yield call(api.updateCacheRedisConfig, payload.data)
    yield put(editRedisCacheResponse(data))
  } catch (e) {
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
  }
}

// Editing Ends Here ......

function* newFunctionForCacheConfig() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CacheConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new CacheApi(api)
}

function* newFunctionForMemoryCache() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CacheConfigurationInMemoryApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new CacheApi(api)
}

function* newFunctionForMemCache() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CacheConfigurationMemcachedApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new CacheApi(api)
}

function* newFunctionForNativeCache() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CacheConfigurationNativePersistenceApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new CacheApi(api)
}

function* newFunctionForRedisCache() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CacheConfigurationRedisApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new CacheApi(api)
}

export function* watchGetCacheConfig() {
  yield takeLatest(GET_CACHE, getCache)
}

export function* watchGetMemoryCache() {
  yield takeLatest(GET_MEMORY_CACHE, getMemoryCache)
}

export function* watchGetMemCache() {
  yield takeLatest(GET_MEM_CACHE, getMemCache)
}

export function* watchGetNativeCache() {
  yield takeLatest(GET_NATIVE_CACHE, getNativeCache)
}

export function* watchGetRedisCache() {
  yield takeLatest(GET_REDIS_CACHE, getRedisCache)
}

export function* watchAddCacheConfig() {
  yield takeLatest(SET_CACHE, addCache)
}

export function* watchPutCacheConfig() {
  yield takeLatest(PUT_CACHE, editCache)
}

export function* watchPutMemoryCacheConfig() {
  yield takeLatest(PUT_MEMORY_CACHE, editMemoryCache)
}

export function* watchPutMemCacheConfig() {
  yield takeLatest(PUT_MEM_CACHE, editMemCache)
}

export function* watchPutNativeCacheConfig() {
  yield takeLatest(PUT_NATIVE_CACHE, editNativeCache)
}

export function* watchPutRedisCacheConfig() {
  yield takeLatest(PUT_REDIS_CACHE, editRedisCache)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetCacheConfig),
    fork(watchGetMemoryCache),
    fork(watchGetMemCache),
    fork(watchGetNativeCache),
    fork(watchGetRedisCache),
    fork(watchPutCacheConfig),
    fork(watchPutMemoryCacheConfig),
    fork(watchPutMemCacheConfig),
    fork(watchPutNativeCacheConfig),
    fork(watchPutRedisCacheConfig),
  ])
}

import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, hasApiToken } from 'Utils/TokenController'
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
} from '../features/cacheSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import CacheApi from '../api/CacheApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')

function* newFunctionForRedisCache() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CacheConfigurationRedisApi(getClient(JansConfigApi, token, issuer))
  return new CacheApi(api)
}

function* newFunctionForCacheConfig() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.CacheConfigurationApi(getClient(JansConfigApi, token, issuer))
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

export function* getCache() {
  try {
    const api = yield* newFunctionForCacheConfig()
    const data = yield call(api.getConfigCache)
    yield put(getCacheResponse({ data }))
    return data
  } catch (e) {
    yield put(getCacheResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getMemoryCache() {
  try {
    const api = yield* newFunctionForMemoryCache()
    const data = yield call(api.getConfigCacheInMemory)
    yield put(getMemoryCacheResponse({ data }))
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
    yield put(getMemCacheResponse({ data }))
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
    yield put(getNativeCacheResponse({ data }))
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
    yield put(getRedisCacheResponse({ data }))
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
    const api = yield* newFunctionForCacheConfig()
    const data = yield call(api.addCacheConfig, payload.data)
    yield put(addCacheResponse({ data }))
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
    yield put(updateToast(true, 'success'))
    yield put(editCacheResponse({ data }))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
    return e
  }
}

export function* editMemoryCache({ payload }) {
  try {
    const api = yield* newFunctionForMemoryCache()
    const data = yield call(api.updateCacheMemoryConfig, payload.data)
    yield put(updateToast(true, 'success'))
    yield put(editMemoryCacheResponse({ data }))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
    return e
  }
}

export function* editMemCache({ payload }) {
  console.log('the payload mem caced', payload)
  try {
    const api = yield* newFunctionForMemCache()
    const data = yield call(api.updateCacheMemConfig, payload.data)
    yield put(editMemCacheResponse({ data }))
    yield put(updateToast(true, 'success'))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
    return e
  }
}

export function* editNativeCache({ payload }) {
  try {
    const api = yield* newFunctionForNativeCache()
    const data = yield call(api.updateCacheNativeConfig, payload.data)
    yield put(editNativeCacheResponse({ data }))
    yield put(updateToast(true, 'success'))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
    return e
  }
}

export function* editRedisCache({ payload }) {
  try {
    const api = yield* newFunctionForRedisCache()
    const data = yield call(api.updateCacheRedisConfig, payload.data)
    yield put(updateToast(true, 'success'))
    yield put(editRedisCacheResponse({ data }))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e) && !hasApiToken()) {
      yield put(getAPIAccessToken())
    }
    return e
  }
}

// Editing Ends Here ......

export function* watchGetCacheConfig() {
  yield takeLatest('cache/getCacheConfig', getCache)
}

export function* watchGetMemoryCache() {
  yield takeLatest('cache/getMemoryCacheConfig', getMemoryCache)
}

export function* watchGetMemCache() {
  yield takeLatest('cache/getMemCacheConfig', getMemCache)
}

export function* watchGetNativeCache() {
  yield takeLatest('cache/getNativeCacheConfig', getNativeCache)
}

export function* watchGetRedisCache() {
  yield takeLatest('cache/getRedisCacheConfig', getRedisCache)
}

export function* watchAddCacheConfig() {
  yield takeLatest('cache/addCache', addCache)
}

export function* watchPutCacheConfig() {
  yield takeLatest('cache/editCache', editCache)
}

export function* watchPutMemoryCacheConfig() {
  yield takeLatest('cache/editMemoryCache', editMemoryCache)
}

export function* watchPutMemCacheConfig() {
  yield takeLatest('cache/editMemCache', editMemCache)
}

export function* watchPutNativeCacheConfig() {
  yield takeLatest('cache/editNativeCache', editNativeCache)
}

export function* watchPutRedisCacheConfig() {
  yield takeLatest('cache/editRedisCache', editRedisCache)
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

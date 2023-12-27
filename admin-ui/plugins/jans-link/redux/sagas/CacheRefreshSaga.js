import { initAudit } from 'Redux/sagas/SagaUtils'
import { getClient } from 'Redux/api/base'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
} from 'redux-saga/effects'
import { postUserAction } from 'Redux/api/backend-api'
import { updateToast } from 'Redux/features/toastSlice'
import CacheRefreshApi from '../api/CacheRefreshApi'
import {
  getCacheRefreshConfiguration,
  getCacheRefreshConfigurationResponse,
  toggleSavedFormFlag,
} from '../features/CacheRefreshSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { UPDATE } from '../../../../app/audit/UserActionType'

const JansConfigApi = require('jans_config_api')

export const JANS_LINK = 'jans-link'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.JansLinkConfigurationApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new CacheRefreshApi(api)
}

export function* getCacheRefreshSaga() {
  const audit = yield* initAudit()
  try {
    const cacheRefreshApi = yield* newFunction()
    const data = yield call(cacheRefreshApi.getPropertiesCacheRefresh)
    yield put(getCacheRefreshConfigurationResponse(data))
    yield call(postUserAction, audit)
    yield put(toggleSavedFormFlag(false))
    return data
  } catch (e) {
    yield put(getCacheRefreshConfigurationResponse(null))
    yield put(toggleSavedFormFlag(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editCacheConfig({ payload }) {
  const audit = yield* initAudit()
  addAdditionalData(audit, UPDATE, JANS_LINK, payload)
  try {
    const cacheRefreshApi = yield* newFunction()
    const data = yield call(
      cacheRefreshApi.updateCacheRefreshConfig,
      payload.action.action_data,
    )
    yield put(updateToast(true, 'success'))
    yield put(getCacheRefreshConfiguration())
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(toggleSavedFormFlag(false))
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetCacheRefresh() {
  yield takeEvery(
    'cacheRefresh/getCacheRefreshConfiguration',
    getCacheRefreshSaga,
  )
}

export function* watchPutCacheRefreshConfig() {
  yield takeLatest('cacheRefresh/putCacheRefreshConfiguration', editCacheConfig)
}

export default function* rootSaga() {
  yield all([fork(watchGetCacheRefresh), fork(watchPutCacheRefreshConfig)])
}

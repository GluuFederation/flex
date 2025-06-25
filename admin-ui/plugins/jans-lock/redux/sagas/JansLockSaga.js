import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects'
import { getClient } from 'Redux/api/base'
import JansLockApi from '../api/JansLockApi'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { getJansLockConfigurationResponse } from '../features/JansLockSlice'
import { postUserAction } from 'Redux/api/backend-api'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { FETCH, PATCH } from '../../../../app/audit/UserActionType'

const JansConfigApi = require('jans_config_api')

export const JANS_LOCK = 'jans-link'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.LockConfigurationApi(getClient(JansConfigApi, token, issuer))
  return new JansLockApi(api)
}

export function* getJansLockConfigs() {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, JANS_LOCK, {})
    const jansKcApi = yield* newFunction()
    const data = yield call(jansKcApi.getLockProperties)
    yield put(getJansLockConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getJansLockConfigurationResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* putJansLockConfigs({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, PATCH, JANS_LOCK, payload)
    const jansKcApi = yield* newFunction()
    const data = yield call(jansKcApi.updateKcLinkConfig, payload.action.action_data)
    yield put(getJansLockConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getJansLockConfigurationResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetJansLockConfig() {
  yield takeLatest('jansLock/getJansLockConfiguration', getJansLockConfigs)
}

export function* watchPutJansLockConfig() {
  yield takeLatest('jansLock/putJansLockConfiguration', putJansLockConfigs)
}

export default function* rootSaga() {
  yield all([fork(watchGetJansLockConfig), fork(watchPutJansLockConfig)])
}

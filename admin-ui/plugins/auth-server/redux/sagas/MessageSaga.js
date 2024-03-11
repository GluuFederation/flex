import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import {
  getMessageResponse,
  editMessageConfigResponse,
  toggleSaveConfigLoader,
  toggleMessageConfigLoader,
} from '../features/MessageSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import MessageApi from '../api/MessageApi'
import { getClient } from 'Redux/api/base'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { postUserAction } from 'Redux/api/backend-api'
import { UPDATE, FETCH } from '../../../../app/audit/UserActionType'
import { updateToast } from 'Redux/features/toastSlice'
const JansConfigApi = require('jans_config_api')

const LOCK = 'message'
const POSTGRES = 'postgres'
const REDIS = 'redis'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.MessageConfigurationApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new MessageApi(api)
}

function* newPostgresFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.MessageConfigurationPostgresApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new MessageApi(api)
}

function* newRedisFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.MessageConfigurationRedisApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new MessageApi(api)
}

export function* getConfigMessage() {
  try {
    const audit = yield* initAudit()
    addAdditionalData(audit, FETCH, LOCK, {})
    yield put(toggleMessageConfigLoader(true))
    const api = yield* newFunction()
    const data = yield call(api.getConfigMessage)
    yield put(getMessageResponse({ data }))
    yield put(toggleMessageConfigLoader(false))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(getMessageResponse(null))
    yield put(toggleMessageConfigLoader(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* editMessageConfig({ payload }) {
  try {
    const audit = yield* initAudit()
    addAdditionalData(audit, UPDATE, LOCK, payload)
    yield put(toggleMessageConfigLoader(true))
    const api = yield* newFunction()
    const data = yield call(api.patchConfigMessage, payload.action_data)
    yield put(editMessageConfigResponse({ data }))
    yield put(toggleMessageConfigLoader(false))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(editMessageConfigResponse(null))
    yield put(toggleMessageConfigLoader(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* putConfigMessagePostgres({ payload }) {
  try {
    const audit = yield* initAudit()
    addAdditionalData(audit, UPDATE, `${LOCK}-${POSTGRES}`, payload)
    yield toggleSaveConfigLoader(true)
    const api = yield* newPostgresFunction()
    yield call(api.putConfigMessagePostgres, payload.action_data)
    yield* getConfigMessage()
    yield put(toggleSaveConfigLoader(false))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(toggleSaveConfigLoader(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* putConfigMessageRedis({ payload }) {
  try {
    const audit = yield* initAudit()
    addAdditionalData(audit, UPDATE, `${LOCK}-${REDIS}`, payload)
    yield toggleSaveConfigLoader(true)
    const api = yield* newRedisFunction()
    yield call(api.putConfigMessageRedis, payload.action_data)
    yield* getConfigMessage()
    yield put(toggleSaveConfigLoader(false))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(
      updateToast(
        true,
        'error',
        e?.response?.body?.responseMessage || e.message
      )
    )
    yield put(toggleSaveConfigLoader(false))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetMessage() {
  yield takeLatest('message/getConfigMessage', getConfigMessage)
}

export function* watchPatchMessage() {
  yield takeLatest('message/editMessageConfig', editMessageConfig)
}

export function* watchputConfigMessagePostgres() {
  yield takeLatest('message/putConfigMessagePostgres', putConfigMessagePostgres)
}

export function* watchputConfigMessageRedis() {
  yield takeLatest('message/putConfigMessageRedis', putConfigMessageRedis)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetMessage),
    fork(watchPatchMessage),
    fork(watchputConfigMessagePostgres),
    fork(watchputConfigMessageRedis),
  ])
}

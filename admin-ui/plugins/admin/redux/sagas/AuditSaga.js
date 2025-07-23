import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { getAuditLogsResponse } from '../features/auditSlice'
import { FETCH, DELETION } from '../../../../app/audit/UserActionType'
import AuditApi from '../api/AuditApi'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { toggleLoader } from '../../../auth-server/redux/features/sessionSlice'

function* newAuditApi() {
  const wholeToken = yield select((state) => state.authReducer.token)
  let token = null
  if (wholeToken) {
    token = yield select((state) => state.authReducer.token.access_token)
  }
  const issuer = yield select((state) => state.authReducer.issuer)
  // If AuditApi needs a different config, adjust here
  return new AuditApi(token, issuer)
}

export function* getAuditLogs({ payload }) {
  console.log('in the  getAuditLogs saga')
  const audit = yield* initAudit()
  console.log('audit', audit)
  try {
    payload = payload ? payload : {}
    addAdditionalData(audit, FETCH, 'AUDIT', payload)
    const auditApi = yield* newAuditApi()
    console.log('audit api', auditApi)
    const data = yield call([auditApi, auditApi.getAuditLogs], payload)
    console.log('data in saga', data)
    yield put(getAuditLogsResponse({ data: data.entries }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getAuditLogsResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* searchAuditLogs({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, 'AUDIT', payload)
    const auditApi = yield* newAuditApi()
    const data = yield call([auditApi, auditApi.searchAuditLogs], payload)
    yield put(handleUpdateAuditLogsResponse({ data: data?.entries }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(handleUpdateAuditLogsResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteAuditLog({ payload }) {
  const audit = yield* initAudit()
  try {
    yield put(toggleLoader(true))
    addAdditionalData(audit, DELETION, 'AUDIT', payload)
    const auditApi = yield* newAuditApi()
    yield call([auditApi, auditApi.deleteAuditLog], payload.id)
    yield put(handleUpdateAuditLogsResponse({ data: payload.id }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(handleUpdateAuditLogsResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  } finally {
    yield put(toggleLoader(false))
  }
}

export function* getAuditLogsWatcher() {
  yield takeLatest('audit/getAuditLogs', getAuditLogs)
}

export function* searchAuditLogsWatcher() {
  yield takeLatest('audit/searchAuditLogs', searchAuditLogs)
}

export function* deleteAuditLogWatcher() {
  yield takeLatest('audit/deleteAuditLog', deleteAuditLog)
}

export default function* rootSaga() {
  yield all([fork(getAuditLogsWatcher), fork(searchAuditLogsWatcher), fork(deleteAuditLogWatcher)])
}

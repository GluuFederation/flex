import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { SESSION } from '../audit/Resources'
import { FETCH, DELETION } from '../../../../app/audit/UserActionType'
import SessionApi from '../api/SessionApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
import {
  handleRevokeSession,
  handleDeleteSession,
  handleUpdateSessionsResponse,
  toggleLoader,
} from '../features/sessionSlice'

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AuthSessionManagementApi(getClient(JansConfigApi, null, issuer))
  return new SessionApi(api)
}

export function* getSessions({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : {}
    addAdditionalData(audit, FETCH, SESSION, payload)
    const sessionApi = yield* newFunction()
    const data = yield call(sessionApi.getAllSessions, payload)
    console.log('SessionSaga: API response data:', data)
    yield put(handleUpdateSessionsResponse({ data: data.entries || [] }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    console.error('SessionSaga: Error fetching sessions:', e)
    yield put(handleUpdateSessionsResponse({ data: [] }))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* searchSessions({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SESSION, payload)
    const sessionApi = yield* newFunction()
    const data = yield call(sessionApi.searchSession, payload)
    yield put(handleUpdateSessionsResponse({ data: data?.entries }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(handleUpdateSessionsResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* revokeSessionByUserDn({ payload }) {
  const audit = yield* initAudit()
  try {
    yield put(toggleLoader(true))
    addAdditionalData(audit, DELETION, SESSION, payload)
    const sessionApi = yield* newFunction()
    yield call(sessionApi.revokeSession, payload.userDn)
    yield put(handleRevokeSession({ data: payload.userDn }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(handleRevokeSession({ data: null }))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
  } finally {
    yield put(toggleLoader(false))
  }
}

export function* deleteSessionById({ payload }) {
  const audit = yield* initAudit()
  try {
    yield put(toggleLoader(true))
    addAdditionalData(audit, DELETION, SESSION, payload)
    const sessionApi = yield* newFunction()
    yield call(sessionApi.deleteSession, payload.sessionId)
    yield put(handleDeleteSession({ data: payload.sessionId }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(handleDeleteSession({ data: null }))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
  } finally {
    yield put(toggleLoader(false))
  }
}

export function* getSessionsWatcher() {
  yield takeLatest('session/getSessions', getSessions)
}

export function* searchSessionsWatcher() {
  yield takeLatest('session/searchSessions', searchSessions)
}

export function* deleteSessionByUserDnWatcher() {
  yield takeLatest('session/revokeSession', revokeSessionByUserDn)
}

export function* deleteSessionByIdWatcher() {
  yield takeLatest('session/deleteSession', deleteSessionById)
}

export default function* rootSaga() {
  yield all([
    fork(getSessionsWatcher),
    fork(deleteSessionByUserDnWatcher),
    fork(deleteSessionByIdWatcher),
    fork(searchSessionsWatcher),
  ])
}

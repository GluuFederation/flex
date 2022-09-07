import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  isFourZeroOneError,
  addAdditionalData,
} from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { getSessionsResponse, revokeSessionsResponse } from '../actions/SessionActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { SESSION } from '../audit/Resources'
import { FETCH, DELETION } from '../../../../app/audit/UserActionType'
import { GET_SESSIONS, REVOKE_SESSION } from '../actions/types'
import SessionApi from '../api/SessionApi'
import { getClient } from 'Redux/api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const wholeToken = yield select((state) => state.authReducer.token)
  let token = null
  if (wholeToken) {
    token = yield select((state) => state.authReducer.token.access_token)
  }

  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AuthSessionManagementApi(
    getClient(JansConfigApi, token, issuer),
  )

  return new SessionApi(api)
}

export function* getSessions({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : { action: {} }
    addAdditionalData(audit, FETCH, SESSION, payload)
    const sessionApi = yield* newFunction()
    const data = yield call(
      sessionApi.getAllSessions,
    )
    yield put(getSessionsResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    yield put(getSessionsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* revokeSessionByUserDn({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, SESSION, payload)
    const sessionApi = yield* newFunction()
    yield call(sessionApi.revokeSession, payload.action.userDn)
    yield put(revokeSessionsResponse(payload.action.userDn))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(revokeSessionsResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* getSessionsWatcher() {
  yield takeLatest(GET_SESSIONS, getSessions)
}

export function* deleteSessionByUserDnWatcher() {
  yield takeLatest(REVOKE_SESSION, revokeSessionByUserDn)
}

export default function* rootSaga() {
  yield all([
    fork(getSessionsWatcher),
    fork(deleteSessionByUserDnWatcher),
  ])
}

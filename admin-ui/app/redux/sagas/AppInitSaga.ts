import { all, fork, put, select, takeLatest } from 'redux-saga/effects'

let appInitCompleted = false

type AuthReducerShape = {
  hasSession?: boolean
  jwtToken?: string | null
  idToken?: string | null
  userinfo_jwt?: string | null
}

function* runAppInitIfReady(): Generator {
  if (appInitCompleted) return

  const auth = (yield select(
    (state: { authReducer: AuthReducerShape }) => state.authReducer,
  )) as AuthReducerShape
  const hasSession = auth?.hasSession
  const idToken = auth?.idToken
  const userinfoJwt = auth?.userinfo_jwt

  if (!hasSession || !idToken || !userinfoJwt) {
    return
  }

  appInitCompleted = true

  yield put({
    type: 'health/getHealthServerStatus',
    payload: { action: { action_data: { service: 'all' } } },
  })
}

function* watchAuthTokens(): Generator {
  yield takeLatest('auth/getUserInfoResponse', runAppInitIfReady)
  yield takeLatest('auth/getAPIAccessTokenResponse', runAppInitIfReady)
  yield takeLatest('auth/createAdminUiSessionResponse', runAppInitIfReady)
}

export default function* appInitSaga(): Generator {
  yield all([fork(runAppInitIfReady), fork(watchAuthTokens)])
}

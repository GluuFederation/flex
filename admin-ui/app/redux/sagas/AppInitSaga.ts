import { all, fork, select, takeLatest } from 'redux-saga/effects'
import type { AuthReducerShape } from './types'

let appInitCompleted = false

function* runAppInitIfReady(): Generator {
  if (appInitCompleted) return

  const auth = (yield select(
    (state: { authReducer: AuthReducerShape }) => state.authReducer,
  )) as AuthReducerShape

  if (!auth?.hasSession || !auth?.idToken || !auth?.userinfo_jwt) {
    return
  }

  appInitCompleted = true
}

function* watchAuthTokens(): Generator {
  yield takeLatest('auth/getUserInfoResponse', runAppInitIfReady)
  yield takeLatest('auth/getAPIAccessTokenResponse', runAppInitIfReady)
  yield takeLatest('auth/createAdminUiSessionResponse', runAppInitIfReady)
}

export default function* appInitSaga(): Generator {
  yield all([fork(runAppInitIfReady), fork(watchAuthTokens)])
}

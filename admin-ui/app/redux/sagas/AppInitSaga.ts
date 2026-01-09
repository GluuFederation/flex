import { all, fork, put, select, takeLatest } from 'redux-saga/effects'

let appInitCompleted = false

type AuthReducerShape = {
  hasSession?: boolean
  JwtToken?: string | null
  idToken?: string | null
  userinfo_jwt?: string | null
}

function formatYearMonth(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const mm = month > 9 ? String(month) : `0${month}`
  return `${year}${mm}`
}

function* runAppInitIfReady(): Generator<unknown, void, unknown> {
  if (appInitCompleted) return

  const auth: AuthReducerShape = (yield select(
    (state: { authReducer: AuthReducerShape }) => state.authReducer,
  )) as AuthReducerShape
  const hasSession = auth?.hasSession
  const idToken = auth?.idToken
  const userinfoJwt = auth?.userinfo_jwt

  // Wait until session is established and tokens are available
  if (!hasSession || !idToken || !userinfoJwt) {
    return
  }

  appInitCompleted = true

  // Health summary
  yield put({
    type: 'health/getHealthStatus',
    payload: { action: { action_data: {} } },
  })

  // Detailed service health
  yield put({
    type: 'health/getHealthServerStatus',
    payload: { action: { action_data: { service: 'all' } } },
  })

  // Jans Lock MAU stats (last 12 months)
  const months: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), 1)
    d.setMonth(d.getMonth() - i)
    months.push(formatYearMonth(d))
  }
  const startMonth = months[months.length - 1]
  const endMonth = months[0]
  yield put({
    type: 'lock/getLockStatus',
    payload: { startMonth, endMonth },
  })
}

function* watchAuthTokens(): Generator<unknown, void, unknown> {
  yield takeLatest('auth/getUserInfoResponse', runAppInitIfReady)
  yield takeLatest('auth/getAPIAccessTokenResponse', runAppInitIfReady)
  yield takeLatest('auth/createAdminUiSessionResponse', runAppInitIfReady)
}

export default function* appInitSaga(): Generator<unknown, void, unknown> {
  yield all([fork(runAppInitIfReady), fork(watchAuthTokens)])
}

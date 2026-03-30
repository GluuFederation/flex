import { all, delay, fork, put, race, select, take, takeLatest } from 'redux-saga/effects'
import type { AuthReducerShape, HealthReducerShape, HealthRaceResult } from '../types'

let appInitCompleted = false

function formatYearMonth(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const mm = month > 9 ? String(month) : `0${month}`
  return `${year}${mm}`
}

function* runAppInitIfReady(): Generator {
  if (appInitCompleted) return

  const auth = (yield select(
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

  let lockStatus: string | undefined
  const { timeout } = (yield race({
    response: take('health/getHealthServerStatusResponse'),
    timeout: delay(10000),
  })) as HealthRaceResult

  if (!timeout) {
    const healthState = (yield select(
      (state: { healthReducer: HealthReducerShape }) => state.healthReducer?.health,
    )) as Record<string, string> | undefined

    lockStatus = healthState?.['jans-lock']
  }

  if (lockStatus && lockStatus.toLowerCase() === 'running') {
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
}

function* watchAuthTokens(): Generator {
  yield takeLatest('auth/getUserInfoResponse', runAppInitIfReady)
  yield takeLatest('auth/getAPIAccessTokenResponse', runAppInitIfReady)
  yield takeLatest('auth/createAdminUiSessionResponse', runAppInitIfReady)
}

export default function* appInitSaga(): Generator {
  yield all([fork(runAppInitIfReady), fork(watchAuthTokens)])
}

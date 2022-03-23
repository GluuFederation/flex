import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../utils/TokenController'
import { getHealthStatusResponse } from '../actions/HealthAction'
import { getAPIAccessToken } from '../actions/AuthActions'
import { postUserAction} from '../api/backend-api'
import { GET_HEALTH } from '../actions/types'
import HealthApi from '../api/HealthApi'
import { getClient } from '../api/base'
import { initAudit } from '../sagas/SagaUtils'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AuthServerHealthCheckApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new HealthApi(api)
}

export function* getHealthStatus({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : { action: {} }
    addAdditionalData(audit, 'FETCH', 'Health', payload)
    const healthApi = yield* newFunction()
    const data = yield call(healthApi.getHealthStatus, payload.action.action_data)
    yield put(getHealthStatusResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {

    yield put(getHealthStatusResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetHealthStatus() {
  yield takeLatest(GET_HEALTH, getHealthStatus)
}

export default function* rootSaga() {
  yield all([fork(watchGetHealthStatus)])
}

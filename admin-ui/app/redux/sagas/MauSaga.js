import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { getMauResponse } from '../actions/MauActions'
import { getAPIAccessToken } from '../actions/AuthActions'
import { postUserAction } from '../api/backend-api'
import { GET_MAU } from '../actions/types'
import MauApi from '../api/MauApi'
import { getClient } from '../api/base'
import { initAudit } from '../sagas/SagaUtils'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.StatisticsUserApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new MauApi(api)
}

export function* getMau({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : { action: {} }
    addAdditionalData(audit, 'FETCH', 'MAU', payload)
    const mauApi = yield* newFunction()
    console.log('HRE1')
    const data = yield call(mauApi.getMau, payload.action.action_data)
    console.log('HRE1', data)
    yield put(getMauResponse(buildData(data)))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getMauResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetMau() {
  yield takeLatest(GET_MAU, getMau)
}

export default function* rootSaga() {
  yield all([fork(watchGetMau)])
}

function buildData(stat) {
  const result = stat.map((entry) => buildEntry(entry))
  result.push({
    month: 202111,
    mau: 5,
    client_credentials_access_token_count: 68,
    authz_code_access_token_count: 785,
    authz_code_idtoken_count: 567,
  })
  result.push({
    month: 202112,
    mau: 3,
    client_credentials_access_token_count: 28,
    authz_code_access_token_count: 75,
    authz_code_idtoken_count: 257,
  })
  return result
}
function buildEntry(el) {
  const entry = new Object()
  entry['month'] = el.month
  entry['mau'] = el.monthly_active_users
  entry['client_credentials_access_token_count'] =
    el.token_count_per_granttype.client_credentials.access_token
  entry['authz_code_access_token_count'] =
    el.token_count_per_granttype.authorization_code.access_token
  entry['authz_code_idtoken_count'] =
    el.token_count_per_granttype.authorization_code.id_token
  return entry
}

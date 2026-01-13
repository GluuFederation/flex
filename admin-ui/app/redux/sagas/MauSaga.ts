// @ts-nocheck
import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { getMauResponse } from 'Plugins/admin/redux/features/mauSlice'
import { postUserAction } from '../api/backend-api'
import MauApi from '../api/MauApi'
import { getClient } from '../api/base'
import { initAudit, redirectToLogout } from '../sagas/SagaUtils'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.StatisticsUserApi(getClient(JansConfigApi, null, issuer))
  return new MauApi(api)
}

export function* getMau({ payload }) {
  const audit = yield* initAudit()
  try {
    payload = payload ? payload : { action: {} }
    addAdditionalData(audit, 'FETCH', 'MAU', payload)
    const mauApi = yield* newFunction()
    const data = yield call(mauApi.getMau, payload.action.action_data)
    yield put(getMauResponse({ data: buildData(data) }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getMauResponse(null))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* watchGetMau() {
  yield takeLatest('mau/getMau', getMau)
}

export default function* rootSaga() {
  yield all([fork(watchGetMau)])
}

function buildData(stat) {
  const result = stat.map((entry) => buildEntry(entry))
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
  entry['authz_code_idtoken_count'] = el.token_count_per_granttype.authorization_code.id_token
  return entry
}

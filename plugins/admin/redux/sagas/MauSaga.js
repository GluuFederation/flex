import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import { getMauResponse } from '../actions/MauActions'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import { postUserAction} from '../../../../app/redux/api/backend-api'
import { GET_MAU } from '../actions/types'
import MauApi from '../api/MauApi'
import { getClient } from '../../../../app/redux/api/base'
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'
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
    const data = yield call(mauApi.getMau, payload.action.action_data)
    yield put(getMauResponse(data))
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

import { call, all, put, fork, select, takeEvery } from 'redux-saga/effects'
import { FETCH } from '../../audit/UserActionType'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../utils/TokenController'
import { GET_STAT } from '../actions/types'
import StatApi from '../api/StatApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from './SagaUtils'
import { getStatResponse } from '../actions/StatActions'
import { postUserAction } from '../api/backend-api'
import { getAPIAccessToken } from '../actions'
const API_USERS = 'api-users'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ServerStatsApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new StatApi(api)
}

export function* getStatSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const statApi = yield* newFunction()
    const data = yield call(statApi.getStat, payload.action)
    yield put(getStatResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUsers() {
  yield takeEvery(GET_STAT, getStatSaga)
}

export default function* rootSaga() {
  yield all([fork(watchGetUsers)])
}

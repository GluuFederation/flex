import { call, all, put, fork, select, takeEvery } from 'redux-saga/effects'
import { FETCH } from '../../audit/UserActionType'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../utils/TokenController'
import { GET_USERS } from '../actions/types'
import UserApi from '../api/UserApi'
import { getClient } from '../api/base'
const JansConfigApi = require('jans_config_api')
import { initAudit } from './SagaUtils'
import { getUserResponse } from '../actions/UserActions'
import { postUserAction } from '../api/backend-api'
import { getAPIAccessToken } from '../actions'
const API_USERS = 'api-users'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.ConfigurationUserManagementApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new UserApi(api)
}

export function* getUsersSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    const data = yield call(userApi.getUsers, payload.action)
    yield put(getUserResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUsers() {
  yield takeEvery(GET_USERS, getUsersSaga)
}

export default function* rootSaga() {
  yield all([fork(watchGetUsers)])
}

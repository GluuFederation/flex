import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  takeEvery,
} from 'redux-saga/effects'
import {
  getMappingResponse,
  updatePermissionsServerResponse,
  updatePermissionsLoading,
  getMapping,
} from '../actions/MappingActions'
import { API_USERS } from '../audit/Resources'
import { FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import { UM_GET_USERS } from '../actions/types'
import UserApi from '../api/UserApi'
import { getClient } from '../../../../app/redux/api/base'
import { postUserAction } from '../../../../app/redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.SCIMUserManagementApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new UserApi(api)
}

export function* getUsersSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_USERS, payload)
    const userApi = yield* newFunction()
    const data = yield call(userApi.getUsers)
    console.log(data)
    // yield put(getMappingResponse(data))
    // yield call(postUserAction, audit)
  } catch (e) {
    console.log(e)
    // yield put(getMappingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetUsers() {
  yield takeLatest(UM_GET_USERS, getUsersSaga)
}

export default function* rootSaga() {
  yield all([fork(watchGetUsers)])
}

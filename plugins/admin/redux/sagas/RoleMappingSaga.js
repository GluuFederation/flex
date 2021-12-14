import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { getMappingResponse } from '../actions/ApiRoleMappingActions'
import { API_MAPPING } from '../audit/Resources'
import { FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import { GET_MAPPING } from '../actions/types'
import RoleMappingApi from '../api/RoleMappingApi'
import { getClient } from '../../../../app/redux/api/base'
import { postUserAction } from '../../../../app/redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIRolePermissionsMappingApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new RoleMappingApi(api)
}

export function* getMapping({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_MAPPING, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.getRoles)
    yield put(getMappingResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getMappingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetMapping() {
  console.log("=========called")
  yield takeLatest(GET_MAPPING, getMapping)
}

export default function* rootSaga() {
  yield all([fork(watchGetMapping)])
}

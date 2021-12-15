import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { getMappingResponse } from '../actions/MappingActions'
import { API_MAPPING } from '../audit/Resources'
import { FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import { GET_MAPPING } from '../actions/types'
import MappingApi from '../api/MappingApi'
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
  return new MappingApi(api)
}

export function* fetchMapping({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_MAPPING, payload)
    const mappingApi = yield* newFunction()
    const data = yield call(mappingApi.getMappings)
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
  yield takeLatest(GET_MAPPING, fetchMapping)
}

export default function* rootSaga() {
  yield all([fork(watchGetMapping)])
}

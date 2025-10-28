import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { API_CONFIG } from '../audit/Resources'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import RoleApi from '../api/RoleApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'
import { getConfigResponse } from '../features/apiConfigSlice'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIRoleApi(getClient(JansConfigApi, token, issuer))
  return new RoleApi(api)
}

export function* getConfig({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_CONFIG, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.getRoles)
    yield put(getConfigResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getConfigResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editRole({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, API_CONFIG, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.editRole, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getConfig({}))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(getConfig(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetRoles() {
  yield takeLatest('apiConfig/getConfig', getConfig)
}

export function* watchEditRole() {
  yield takeLatest('apiRole/editRole', editRole)
}

export default function* rootSaga() {
  yield all([fork(watchGetRoles), fork(watchEditRole)])
}

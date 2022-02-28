import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  getRoles as getRolesAction,
  getRolesResponse,
  addRoleResponse,
  editRoleResponse,
  deleteRoleResponse,
} from '../actions/ApiRoleActions'
import { API_ROLE } from '../audit/Resources'
import {
  CREATE,
  UPDATE,
  DELETION,
  FETCH,
} from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from '../../../../app/redux/actions/AuthActions'
import {
  isFourZeroOneError,
  addAdditionalData,
} from '../../../../app/utils/TokenController'
import {
  GET_ROLES,
  GET_ROLE,
  ADD_ROLE,
  EDIT_ROLE,
  DELETE_ROLE,
} from '../actions/types'
import RoleApi from '../api/RoleApi'
import { getClient } from '../../../../app/redux/api/base'
import { postUserAction } from '../../../../app/redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIRoleApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new RoleApi(api)
}

export function* getRoles({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_ROLE, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.getRoles)
    yield put(getRolesResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getRolesResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* getRole({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_ROLE, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.getRole, payload.action.action_data)
    yield put(getRoleResponse(data))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getRoleResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* addRole({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, API_ROLE, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.addRole, payload.action.action_data)
    yield put(getRolesAction({}))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(addRoleResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}
export function* editRole({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, API_ROLE, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.editRole, payload.action.action_data)
    yield put(getRolesAction({}))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(editRoleResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* deleteRole({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, API_ROLE, payload)
    const roleApi = yield* newFunction()
    yield call(roleApi.deleteRole, payload.action.action_data)
    yield put(getRolesAction({}))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(deleteRoleResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* watchGetRoles() {
  yield takeLatest(GET_ROLES, getRoles)
}

export function* watchAddRole() {
  yield takeLatest(ADD_ROLE, addRole)
}

export function* watchEditRole() {
  yield takeLatest(EDIT_ROLE, editRole)
}
export function* watchDeleteRole() {
  yield takeLatest(DELETE_ROLE, deleteRole)
}
export function* watchGetRole() {
  yield takeLatest(GET_ROLE, getRole)
}
export default function* rootSaga() {
  yield all([
    fork(watchGetRoles),
    fork(watchAddRole),
    fork(watchEditRole),
    fork(watchGetRole),
    fork(watchDeleteRole),
  ])
}

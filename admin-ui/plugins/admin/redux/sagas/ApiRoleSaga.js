import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import {
  getRoles as getRolesAction,
  getRolesResponse,
  addRoleResponse,
  editRoleResponse,
  deleteRoleResponse,
} from 'Plugins/admin/redux/features/apiRoleSlice'
import { API_ROLE } from '../audit/Resources'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroSixError, addAdditionalData } from 'Utils/TokenController'
import RoleApi from '../api/RoleApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  // Use null for token - HttpOnly session cookie handles auth
  const api = new JansConfigApi.AdminUIRoleApi(getClient(JansConfigApi, null, issuer))
  return new RoleApi(api)
}

export function* getRoles({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_ROLE, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.getRoles)
    yield put(getRolesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getRolesResponse(null))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}
export function* getRole({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_ROLE, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.getRole, payload.action.action_data)
    yield put(getRoleResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getRoleResponse(null))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
  }
}
export function* addRole({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, API_ROLE, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.addRole, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getRolesAction({}))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(addRoleResponse(null))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}
export function* editRole({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, API_ROLE, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.editRole, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getRolesAction({}))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(editRoleResponse(null))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* deleteRole({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, API_ROLE, payload)
    const roleApi = yield* newFunction()
    const data = yield call(roleApi.deleteRole, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getRolesAction({}))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(deleteRoleResponse(null))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* watchGetRoles() {
  yield takeLatest('apiRole/getRoles', getRoles)
}

export function* watchAddRole() {
  yield takeLatest('apiRole/addRole', addRole)
}

export function* watchEditRole() {
  yield takeLatest('apiRole/editRole', editRole)
}
export function* watchDeleteRole() {
  yield takeLatest('apiRole/deleteRole', deleteRole)
}
export function* watchGetRole() {
  yield takeLatest('apiRole/getRole', getRole)
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

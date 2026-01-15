import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { API_PERMISSION } from '../audit/Resources'
import PermissionApi from '../api/PermissionApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
import {
  getPermissionResponse,
  addPermissionResponse,
  editPermissionResponse,
  deletePermissionResponse,
} from 'Plugins/admin/redux/features/apiPermissionSlice'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import { isFourZeroSixError, addAdditionalData } from 'Utils/TokenController'
import { updateToast } from 'Redux/features/toastSlice'

const JansConfigApi = require('jans_config_api')
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
import { buildPermissionDeleteErrorMessage } from 'Utils/PermissionMappingUtils'

function* newFunction() {
  const issuer = yield select((state) => state.authReducer.issuer)
  // Use null for token - HttpOnly session cookie handles auth
  const api = new JansConfigApi.AdminUIPermissionApi(getClient(JansConfigApi, null, issuer))
  return new PermissionApi(api)
}

export function* getPermissions({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.getPermissions)
    yield put(getPermissionResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getPermissionResponse(null))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
      return
    }
    return e
  }
}
export function* getPermission({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.getPermission, payload.action.action_data)
    yield put(getPermissionResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e) {
    yield put(getPermissionResponse(null))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
    }
  }
}
export function* addPermission({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.addPermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield call(postUserAction, audit)
    yield* getPermissions({
      payload: { action: { action_data: [], action_message: 'PERMISSIONS' } },
    })
    yield put(addPermissionResponse({ data }))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(addPermissionResponse({ data: null }))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
    }
    return e
  }
}
export function* editPermission({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const editPayload = { ...payload?.action?.action_data }
    if (editPayload?.tableData) {
      delete editPayload.tableData
    }
    const data = yield call(permApi.editPermission, editPayload)
    yield put(updateToast(true, 'success'))
    yield put(editPermissionResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    const errorMessage = e?.response?.body?.responseMessage || e.message
    yield put(updateToast(true, 'error', errorMessage))
    yield put(editPermissionResponse({ data: null }))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
    }
    return e
  }
}

export function* deletePermission({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, API_PERMISSION, payload)
    const permApi = yield* newFunction()
    const data = yield call(permApi.deletePermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(deletePermissionResponse({ inum: payload.action.action_data }))
    yield call(postUserAction, audit)
    yield getPermissions({
      payload: { action: { action_data: [], action_message: 'PERMISSIONS' } },
    })
    return data
  } catch (e) {
    const actionData = payload?.action?.action_data
    const apiPermissions = yield select((state) => state.apiPermissionReducer.items || [])
    const rolePermissionMapping = yield select((state) => state.mappingReducer.items || [])
    let finalMessage
    try {
      finalMessage = buildPermissionDeleteErrorMessage(
        actionData,
        apiPermissions,
        rolePermissionMapping,
      )
    } catch (msgError) {
      console.error('Error building permission delete message:', msgError)
      finalMessage =
        e?.response?.body?.responseMessage || e.message || 'Failed to delete permission'
    }
    yield put(updateToast(true, 'error', finalMessage))
    yield put(deletePermissionResponse({ inum: null }))
    if (isFourZeroSixError(e)) {
      // Session expired - redirect to login
      yield* redirectToLogout()
    }
    return e
  }
}

export function* watchGetPermissions() {
  yield takeLatest('apiPermission/getPermissions', getPermissions)
}

export function* watchAddPermission() {
  yield takeLatest('apiPermission/addPermission', addPermission)
}

export function* watchEditPermission() {
  yield takeLatest('apiPermission/editPermission', editPermission)
}
export function* watchDeletePermission() {
  yield takeLatest('apiPermission/deletePermission', deletePermission)
}
export function* watchGetPermission() {
  yield takeLatest('apiPermission/getPermission', getPermission)
}
export default function* rootSaga() {
  yield all([
    fork(watchGetPermissions),
    fork(watchAddPermission),
    fork(watchEditPermission),
    fork(watchGetPermission),
    fork(watchDeletePermission),
  ])
}

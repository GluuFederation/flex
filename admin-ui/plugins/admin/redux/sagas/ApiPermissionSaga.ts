import { call, all, put, fork, takeLatest, select, CallEffect, PutEffect, SelectEffect, ForkEffect } from 'redux-saga/effects'
import { getAPIAccessToken } from 'Redux/features/authSlice'
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
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { updateToast } from 'Redux/features/toastSlice'

const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

// Define interfaces
interface PermissionItem {
  inum: string
  permission: string
  tag?: string
  description?: string
  defaultPermissionInToken?: boolean
  enabled?: boolean
  [key: string]: any
}

interface AdminPermission {
  permission?: string
  [key: string]: unknown
}

interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
  apiPermissionReducer: {
    items: PermissionItem[]
    loading: boolean
  }
}

interface UserAction {
  action_message?: string
  action_data?: any
  [key: string]: any
}

interface ActionPayload {
  action: UserAction
}

interface AuditLog {
  headers: Record<string, string>
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: {
    user_inum: string
    userId: string
  }
}

function* newFunction(): Generator<SelectEffect, PermissionApi, any> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIPermissionApi(getClient(JansConfigApi, token, issuer))
  return new PermissionApi(api)
}

export function* getPermissions({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, API_PERMISSION, payload)
    const permApi: PermissionApi = yield call(newFunction)
    const data: PermissionItem[] = yield call(permApi.getPermissions)
    yield put(getPermissionResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: any) {
    yield put(getPermissionResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getPermission({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, API_PERMISSION, payload)
    const permApi: PermissionApi = yield call(newFunction)
    const data: PermissionItem[] = yield call(permApi.getPermissions)
    yield put(getPermissionResponse({ data }))
    yield call(postUserAction, audit)
  } catch (e: any) {
    yield put(getPermissionResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addPermission({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, CREATE, API_PERMISSION, payload)
    const permApi: PermissionApi = yield call(newFunction)
    const data: PermissionItem = yield call(permApi.addPermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield call(postUserAction, audit)
    yield call(getPermissions, {
      payload: { action: { action_data: [], action_message: 'PERMISSIONS' } },
    })
    yield put(addPermissionResponse({ data }))
    return data
  } catch (e: any) {
    yield put(updateToast(true, 'error'))
    yield put(addPermissionResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editPermission({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, UPDATE, API_PERMISSION, payload)
    const permApi: PermissionApi = yield call(newFunction)
    const editPayload: AdminPermission = { ...payload?.action?.action_data }
    if (editPayload?.tableData) {
      delete editPayload.tableData
    }
    const data: PermissionItem[] = yield call(permApi.editPermission, editPayload)
    yield put(updateToast(true, 'success'))
    yield put(editPermissionResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: any) {
    const errorMessage = e?.response?.body?.responseMessage || e.message
    yield put(updateToast(true, 'error', errorMessage))
    yield put(editPermissionResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deletePermission({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, DELETION, API_PERMISSION, payload)
    const permApi: PermissionApi = yield call(newFunction)
    const data: any = yield call(permApi.deletePermission, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(deletePermissionResponse({ inum: payload.action.action_data }))
    yield call(postUserAction, audit)
    yield call(getPermissions, {
      payload: { action: { action_data: [], action_message: 'PERMISSIONS' } },
    })
    return data
  } catch (e: any) {
    yield put(updateToast(true, 'error'))
    yield put(deletePermissionResponse({ inum: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetPermissions(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiPermission/getPermissions' as any, getPermissions)
}

export function* watchAddPermission(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiPermission/addPermission' as any, addPermission)
}

export function* watchEditPermission(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiPermission/editPermission' as any, editPermission)
}

export function* watchDeletePermission(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiPermission/deletePermission' as any, deletePermission)
}

export function* watchGetPermission(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiPermission/getPermission' as any, getPermission)
}

export default function* rootSaga(): Generator<any, void, unknown> {
  yield all([
    fork(watchGetPermissions),
    fork(watchAddPermission),
    fork(watchEditPermission),
    fork(watchGetPermission),
    fork(watchDeletePermission),
  ])
}

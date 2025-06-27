import { call, all, put, fork, takeLatest, select, CallEffect, PutEffect, SelectEffect, ForkEffect, AllEffect } from 'redux-saga/effects'
import {
  getRoles as getRolesAction,
  getRolesResponse,
  addRoleResponse,
  editRoleResponse,
  deleteRoleResponse,
  getRoleResponse,
} from 'Plugins/admin/redux/features/apiRoleSlice'
import { API_ROLE } from '../audit/Resources'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import RoleApi from '../api/RoleApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

// Define interfaces
interface ApiRole {
  inum: string
  [key: string]: any
}

interface ApiRoleResponse {
  data: ApiRole
}

interface DeleteRoleResponse {
  inum: string
}

interface UserAction {
  action_data: any
  action_message?: string
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
  action?: string
  resource?: string
  message?: string
  modifiedFields?: any
  performedOn?: any
  payload?: any
  date?: Date
}

interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
  apiRoleReducer: {
    items: ApiRole[]
    loading: boolean
  }
}

function* newFunction(): Generator<SelectEffect, RoleApi, any> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIRoleApi(getClient(JansConfigApi, token, issuer))
  return new RoleApi(api)
}

export function* getRoles({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, API_ROLE, payload)
    const roleApi: RoleApi = yield call(newFunction)
    const data: ApiRole[] = yield call(roleApi.getRoles)
    yield put(getRolesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: any) {
    yield put(getRolesResponse({ data: [] }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getRole({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, API_ROLE, payload)
    const roleApi: RoleApi = yield call(newFunction)
    const data: ApiRole[] = yield call(roleApi.getRoles)
    // Since getRoles returns an array, we'll take the first item for getRole
    const singleRole: ApiRole = data[0]
    yield put(getRoleResponse({ data: singleRole }))
    yield call(postUserAction, audit)
  } catch (e: any) {
    yield put(getRoleResponse({ data: {} as ApiRole }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
  }
}

export function* addRole({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, CREATE, API_ROLE, payload)
    const roleApi: RoleApi = yield call(newFunction)
    const data: ApiRole = yield call(roleApi.addRole, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getRolesAction({}))
    yield call(postUserAction, audit)
    return data
  } catch (e: any) {
    yield put(updateToast(true, 'error'))
    yield put(addRoleResponse({ data: {} as ApiRole }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* editRole({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, UPDATE, API_ROLE, payload)
    const roleApi: RoleApi = yield call(newFunction)
    const data: ApiRole = yield call(roleApi.editRole, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getRolesAction({}))
    yield call(postUserAction, audit)
    return data
  } catch (e: any) {
    yield put(updateToast(true, 'error'))
    yield put(editRoleResponse({ data: {} as ApiRole }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteRole({ payload }: { payload: ActionPayload }): Generator<any, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, DELETION, API_ROLE, payload)
    const roleApi: RoleApi = yield call(newFunction)
    const data: any = yield call(roleApi.deleteRole, payload.action.action_data)
    yield put(updateToast(true, 'success'))
    yield put(getRolesAction({}))
    yield call(postUserAction, audit)
    return data
  } catch (e: any) {
    yield put(updateToast(true, 'error'))
    yield put(deleteRoleResponse({ inum: '' }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetRoles(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiRole/getRoles' as any, getRoles)
}

export function* watchAddRole(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiRole/addRole' as any, addRole)
}

export function* watchEditRole(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiRole/editRole' as any, editRole)
}

export function* watchDeleteRole(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiRole/deleteRole' as any, deleteRole)
}

export function* watchGetRole(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('apiRole/getRole' as any, getRole)
}

export default function* rootSaga(): Generator<AllEffect<ForkEffect<void>>, void, unknown> {
  yield all([
    fork(watchGetRoles),
    fork(watchAddRole),
    fork(watchEditRole),
    fork(watchGetRole),
    fork(watchDeleteRole),
  ])
}

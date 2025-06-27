import { call, all, put, fork, takeLatest, select, takeEvery, SelectEffect, CallEffect, PutEffect, ForkEffect, AllEffect } from 'redux-saga/effects'
import {
  getMappingResponse,
  updatePermissionsServerResponse,
  updatePermissionsLoading,
  getMapping,
  MappingItem,
} from 'Plugins/admin/redux/features/mappingSlice'
import { API_MAPPING } from '../audit/Resources'
import { FETCH } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import MappingApi from '../api/MappingApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

// Define interfaces for the saga
interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
  mappingReducer: {
    items: MappingItem[]
    loading: boolean
  }
}

interface PayloadAction {
  payload: {
    data?: any
  }
}

interface AuditData {
  headers: Record<string, any>
  [key: string]: any
}

function* newFunction(): Generator<SelectEffect, MappingApi, any> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.AdminUIRolePermissionsMappingApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new MappingApi(api)
}

export function* fetchMapping({ payload }: PayloadAction): Generator<CallEffect | PutEffect<any> | SelectEffect, any, any> {
  const audit: AuditData = yield call(initAudit)
  try {
    addAdditionalData(audit, FETCH, API_MAPPING, payload)
    const mappingApi: MappingApi = yield call(newFunction)
    const data: MappingItem[] = yield call(mappingApi.getMappings)
    yield put(getMappingResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getMappingResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* updateMapping({ payload }: PayloadAction): Generator<CallEffect | PutEffect<any> | SelectEffect, any, any> {
  yield put(updatePermissionsLoading({ data: true }))
  try {
    const mappingApi: MappingApi = yield call(newFunction)
    const data: MappingItem = yield call(mappingApi.updateMapping, payload.data)
    yield put(updateToast(true, 'success'))
    yield put(updatePermissionsServerResponse({ data }))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(updatePermissionsLoading({ data: false }))
    yield put(getMappingResponse({ data: undefined }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* addMapping({ payload }: PayloadAction): Generator<CallEffect | PutEffect<any> | SelectEffect, any, any> {
  yield put(updatePermissionsLoading({ data: true }))
  try {
    const mappingApi: MappingApi = yield call(newFunction)
    const data: MappingItem = yield call(mappingApi.addMapping, payload.data)
    yield put(updateToast(true, 'success'))
    yield put(getMapping())
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(updatePermissionsLoading({ data: false }))
    // yield put(getMappingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteMapping({ payload }: PayloadAction): Generator<CallEffect | PutEffect<any> | SelectEffect, any, any> {
  yield put(updatePermissionsLoading({ data: true }))
  try {
    const mappingApi: MappingApi = yield call(newFunction)
    const data: MappingItem = yield call(mappingApi.deleteMapping, payload.data)
    yield put(updateToast(true, 'success'))
    yield put(getMapping())
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(updatePermissionsLoading({ data: false }))
    // yield put(getMappingResponse(null))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* watchGetMapping(): Generator<ForkEffect<never>, void, any> {
  yield takeLatest('mapping/getMapping' as any, fetchMapping)
  yield takeEvery('mapping/updatePermissionsToServer' as any, updateMapping)
  yield takeEvery('mapping/addNewRolePermissions' as any, addMapping)
  yield takeEvery('mapping/deleteMapping' as any, deleteMapping)
}

export default function* rootSaga(): Generator<AllEffect<ForkEffect<void>>, void, any> {
  yield all([fork(watchGetMapping)])
}

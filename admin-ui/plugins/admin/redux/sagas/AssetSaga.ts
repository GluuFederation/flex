import {
  call,
  all,
  put,
  fork,
  takeLatest,
  select,
  CallEffect,
  PutEffect,
  SelectEffect,
  ForkEffect,
  AllEffect,
} from 'redux-saga/effects'
import {
  fetchJansAssets,
  getJansAssetResponse,
  getAssetServicesResponse,
  getAssetTypesResponse,
  createJansAssetResponse,
  deleteJansAssetResponse,
  updateJansAssetResponse,
} from 'Plugins/admin/redux/features/AssetSlice'
import { CREATE, FETCH, DELETION, UPDATE } from '../../../../app/audit/UserActionType'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import AssetApi from '../api/AssetApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')
import { initAudit } from 'Redux/sagas/SagaUtils'

// Define interfaces
interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
}

interface AssetActionPayload {
  action?: {
    action_data?: any
    [key: string]: any
  }
  [key: string]: any
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
}

interface ApiError {
  response?: {
    body?: {
      responseMessage?: string
    }
  }
  message?: string
}

function* newFunction(): Generator<SelectEffect, AssetApi, any> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.JansAssetsApi(getClient(JansConfigApi, token, issuer))
  return new AssetApi(api)
}

export function* getAllJansAssets({
  payload,
}: {
  payload: AssetActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'asset', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.getAllJansAssets, payload.action || {})
    yield put(getJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(getJansAssetResponse({ data: undefined }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* getAssetServices({
  payload,
}: {
  payload: AssetActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'assetServices', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.getAssetServices)
    yield put(getAssetServicesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(getAssetServicesResponse({ data: undefined }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* getAssetTypes({
  payload,
}: {
  payload: AssetActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'assetTypes', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.getAssetTypes)
    yield put(getAssetTypesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(getAssetTypesResponse({ data: undefined }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* createJansAsset({
  payload,
}: {
  payload: AssetActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
    addAdditionalData(audit, CREATE, 'asset', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.createJansAsset, payload.action?.action_data, token)
    yield put(createJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(createJansAssetResponse({ data: undefined }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* deleteJansAsset({
  payload,
}: {
  payload: AssetActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, DELETION, 'asset', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.deleteJansAssetByInum, payload.action?.action_data?.inum)
    yield put(deleteJansAssetResponse())
    yield call(postUserAction, audit)
    yield put(fetchJansAssets({ action: {} }))
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(deleteJansAssetResponse())
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* updateJansAsset({
  payload,
}: {
  payload: AssetActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, UPDATE, 'asset', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.updateJansAsset, payload.action?.action_data, token)
    yield put(updateJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    yield put(fetchJansAssets({ action: {} }))
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(
      updateToast(
        true,
        'error',
        error?.response?.body?.responseMessage || error.message || 'Unknown error',
      ),
    )
    yield put(updateJansAssetResponse({ data: undefined }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* watchFetchJansAssets(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('asset/fetchJansAssets' as any, getAllJansAssets)
}

export function* watchGetAssetTypes(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('asset/getAssetTypes' as any, getAssetTypes)
}

export function* watchGetAssetServices(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('asset/getAssetServices' as any, getAssetServices)
}

export function* watchCreateJansAsset(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('asset/createJansAsset' as any, createJansAsset)
}

export function* watchDeleteJansAsset(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('asset/deleteJansAsset' as any, deleteJansAsset)
}

export function* watchUpdateJansAsset(): Generator<ForkEffect<never>, void, unknown> {
  yield takeLatest('asset/updateJansAsset' as any, updateJansAsset)
}

export default function* rootSaga(): Generator<AllEffect<ForkEffect<void>>, void, unknown> {
  yield all([
    fork(watchGetAssetServices),
    fork(watchGetAssetTypes),
    fork(watchFetchJansAssets),
    fork(watchCreateJansAsset),
    fork(watchDeleteJansAsset),
    fork(watchUpdateJansAsset),
  ])
}

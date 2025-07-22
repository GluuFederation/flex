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
import { RootState, AuditLog, AssetActionPayload, ApiError } from './types'
import { Asset } from '../../components/Assets/types/Asset'
import { AssetData } from '../features/types/asset'
import * as JansConfigApi from 'jans_config_api'
import { initAudit } from 'Redux/sagas/SagaUtils'

function* createAssetApiClient(): Generator<SelectEffect, AssetApi, string> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.JansAssetsApi(getClient(JansConfigApi, token, issuer))
  return new AssetApi(api)
}

export function* getAllJansAssets({
  payload,
}: {
  payload: AssetActionPayload
}): Generator<CallEffect | PutEffect | SelectEffect, AssetData | ApiError, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    payload = payload || { action: {} }
    const safePayload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'asset', safePayload)
    const assetApi: AssetApi = yield call(createAssetApiClient)
    const data = yield call(assetApi.getAllJansAssets, safePayload.action || {})
    yield put(getJansAssetResponse({ data: data as AssetData }))
    yield call(postUserAction, audit)
    return data as AssetData
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

export function* getAssetServices({ payload }: { payload: AssetActionPayload }): any {
  const audit: AuditLog = yield call(initAudit)
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'assetServices', payload)
    const assetApi: AssetApi = yield call(createAssetApiClient)
    const data = yield call(assetApi.getAssetServices)
    yield put(getAssetServicesResponse({ data: data as string[] }))
    yield call(postUserAction, audit)
    return data as string[]
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
}): Generator<CallEffect | PutEffect | SelectEffect, string[] | ApiError, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'assetTypes', payload)
    const assetApi: AssetApi = yield call(createAssetApiClient)
    const data = yield call(assetApi.getAssetTypes)
    yield put(getAssetTypesResponse({ data: data as string[] }))
    yield call(postUserAction, audit)
    return data as string[]
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
}): Generator<CallEffect | PutEffect | SelectEffect, Asset | ApiError, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
    addAdditionalData(audit, CREATE, 'asset', payload)
    const assetApi: AssetApi = yield call(createAssetApiClient)
    const data = yield call(
      assetApi.createJansAsset.bind(assetApi),
      payload.action?.action_data,
      token,
    )
    yield put(createJansAssetResponse({ data: data as Asset }))
    yield call(postUserAction, audit)
    return data as Asset
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
}): Generator<CallEffect | PutEffect | SelectEffect, void | ApiError, any> {
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, DELETION, 'asset', payload)
    const assetApi: AssetApi = yield call(createAssetApiClient)
    yield call(assetApi.deleteJansAssetByInum.bind(assetApi), payload.action?.action_data?.inum)
    yield put(deleteJansAssetResponse())
    yield call(postUserAction, audit)
    yield put(fetchJansAssets())
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
}): Generator<CallEffect | PutEffect | SelectEffect, Asset | ApiError, any> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const audit: AuditLog = yield call(initAudit)
  try {
    addAdditionalData(audit, UPDATE, 'asset', payload)
    const assetApi: AssetApi = yield call(createAssetApiClient)
    const data = yield call(
      assetApi.updateJansAsset.bind(assetApi),
      payload.action?.action_data,
      token,
    )
    yield put(updateJansAssetResponse({ data: data as Asset }))
    yield call(postUserAction, audit)
    yield put(fetchJansAssets())
    return data as Asset
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

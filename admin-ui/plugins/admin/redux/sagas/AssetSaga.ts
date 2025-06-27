import { call, all, put, fork, takeLatest, select, CallEffect, PutEffect, SelectEffect, ForkEffect, AllEffect } from 'redux-saga/effects'
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
interface AssetOptions {
  limit?: number
  pattern?: string | null
  startIndex?: number
  [key: string]: any
}

interface AssetBody {
  fileName: string
  description: string
  document: File | ArrayBuffer
  service?: string
  enabled: boolean
  inum?: string
  dn?: string
  baseDn?: string
}

interface AssetActionPayload {
  action: {
    action_data?: AssetBody
    inum?: string
    [key: string]: any
  }
  [key: string]: any
}

interface RootState {
  authReducer: {
    token: {
      access_token: string
    }
    issuer: string
    userinfo_jwt: string
  }
  assetReducer: {
    assets: any[]
    services: any[]
    fileTypes: any[]
    loading: boolean
    saveOperationFlag: boolean
    errorInSaveOperationFlag: boolean
    totalItems: number
    entriesCount: number
    selectedAsset: any
    loadingAssets: boolean
    assetModal: boolean
    showErrorModal: boolean
  }
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

export function* getAllJansAssets({ payload }: { payload: AssetActionPayload }): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: any = yield call(initAudit)
  try {
    payload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'asset', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.getAllJansAssets, payload.action)
    yield put(getJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(updateToast(true, 'error', error?.response?.body?.responseMessage || error.message || 'Unknown error'))
    yield put(getJansAssetResponse({ data: null }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* getAssetServices({ payload }: { payload: AssetActionPayload }): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: any = yield call(initAudit)
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
    yield put(updateToast(true, 'error', error?.response?.body?.responseMessage || error.message || 'Unknown error'))
    yield put(getAssetServicesResponse({ data: null }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* getAssetTypes({ payload }: { payload: AssetActionPayload }): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: any = yield call(initAudit)
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
    yield put(updateToast(true, 'error', error?.response?.body?.responseMessage || error.message || 'Unknown error'))
    yield put(getAssetTypesResponse({ data: null }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* createJansAsset({ payload }: { payload: AssetActionPayload }): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: any = yield call(initAudit)
  try {
    const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
    addAdditionalData(audit, CREATE, 'asset', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.createJansAsset, payload.action.action_data!, token)
    yield put(createJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(updateToast(true, 'error', error?.response?.body?.responseMessage || error.message || 'Unknown error'))
    yield put(createJansAssetResponse({ data: null }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* deleteJansAsset({ payload }: { payload: AssetActionPayload }): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const audit: any = yield call(initAudit)
  try {
    addAdditionalData(audit, DELETION, 'asset', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.deleteJansAssetByInum, payload.action.action_data!.inum!)
    yield put(deleteJansAssetResponse())
    yield call(postUserAction, audit)
    yield put(fetchJansAssets({}))
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(updateToast(true, 'error', error?.response?.body?.responseMessage || error.message || 'Unknown error'))
    yield put(deleteJansAssetResponse())
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* updateJansAsset({ payload }: { payload: AssetActionPayload }): Generator<CallEffect | PutEffect | SelectEffect, any, any> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const audit: any = yield call(initAudit)
  try {
    addAdditionalData(audit, UPDATE, 'asset', payload)
    const assetApi: AssetApi = yield call(newFunction)
    const data: any = yield call(assetApi.updateJansAsset, payload.action.action_data!, token)
    yield put(updateJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    yield put(fetchJansAssets({}))
    return data
  } catch (e: unknown) {
    const error = e as ApiError
    yield put(updateToast(true, 'error', error?.response?.body?.responseMessage || error.message || 'Unknown error'))
    yield put(updateJansAssetResponse({ data: null }))
    if (isFourZeroOneError(error)) {
      const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* watchFetchJansAssets() {
  yield takeLatest('asset/fetchJansAssets' as any, getAllJansAssets)
}

export function* watchGetAssetTypes() {
  yield takeLatest('asset/getAssetTypes' as any, getAssetTypes)
}

export function* watchGetAssetServices() {
  yield takeLatest('asset/getAssetServices' as any, getAssetServices)
}

export function* watchCreateJansAsset() {
  yield takeLatest('asset/createJansAsset' as any, createJansAsset)
}

export function* watchDeleteJansAsset() {
  yield takeLatest('asset/deleteJansAsset' as any, deleteJansAsset)
}

export function* watchUpdateJansAsset() {
  yield takeLatest('asset/updateJansAsset' as any, updateJansAsset)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetAssetServices),
    fork(watchGetAssetTypes),
    fork(watchFetchJansAssets),
    fork(watchCreateJansAsset),
    fork(watchDeleteJansAsset),
    fork(watchUpdateJansAsset),
  ])
}

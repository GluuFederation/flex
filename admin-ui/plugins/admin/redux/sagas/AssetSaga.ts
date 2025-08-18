import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import type { PutEffect, SelectEffect } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
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
import {
  CreateAssetSagaPayload,
  UpdateAssetSagaPayload,
  DeleteAssetSagaPayload,
  GetAssetsSagaPayload,
} from '../features/types/asset'
import { DocumentPagedResult, Document } from '../../components/Assets/types/AssetApiTypes'
import { AssetRootState, getErrorMessage } from './types/asset'

import * as JansConfigApi from 'jans_config_api'
import { initAudit } from 'Redux/sagas/SagaUtils'

// Helper function to create AssetApi instance
function* newFunction(): Generator<SelectEffect, AssetApi, string> {
  const token: string = yield select(
    (state: AssetRootState) => state.authReducer.token.access_token,
  )
  const issuer: string = yield select((state: AssetRootState) => state.authReducer.issuer)
  const api = new JansConfigApi.JansAssetsApi(getClient(JansConfigApi, token, issuer))
  return new AssetApi(api)
}

export function* getAllJansAssets({
  payload,
}: PayloadAction<GetAssetsSagaPayload['payload']>): SagaIterator<DocumentPagedResult | unknown> {
  const audit = yield* initAudit()
  try {
    const finalPayload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'asset', finalPayload)
    const assetApi: AssetApi = yield* newFunction()
    const data: DocumentPagedResult = yield call(assetApi.getAllJansAssets, finalPayload.action)
    yield put(getJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(getJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: AssetRootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getAssetServices({
  payload,
}: PayloadAction<GetAssetsSagaPayload['payload']>): SagaIterator<string[] | unknown> {
  const audit = yield* initAudit()
  try {
    const finalPayload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'assetServices', finalPayload)
    const assetApi: AssetApi = yield* newFunction()
    const data: string[] = yield call(assetApi.getAssetServices)
    yield put(getAssetServicesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(getAssetServicesResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: AssetRootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getAssetTypes({
  payload,
}: PayloadAction<GetAssetsSagaPayload['payload']>): SagaIterator<string[] | unknown> {
  const audit = yield* initAudit()
  try {
    const finalPayload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'assetTypes', finalPayload)
    const assetApi: AssetApi = yield* newFunction()
    const data: string[] = yield call(assetApi.getAssetTypes)
    yield put(getAssetTypesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(getAssetTypesResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: AssetRootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* createJansAsset({
  payload,
}: PayloadAction<CreateAssetSagaPayload['payload']>): SagaIterator<Document | unknown> {
  const audit = yield* initAudit()
  try {
    const token: string = yield select(
      (state: AssetRootState) => state.authReducer.token.access_token,
    )
    addAdditionalData(audit, CREATE, 'asset', payload)
    const assetApi: AssetApi = yield* newFunction()
    const data: Document = yield call(assetApi.createJansAsset, payload.action.action_data, token)
    yield put(createJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(createJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: AssetRootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* deleteJansAsset({
  payload,
}: PayloadAction<DeleteAssetSagaPayload>): SagaIterator<void | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, 'asset', payload)
    const assetApi: AssetApi = yield* newFunction()
    yield call(assetApi.deleteJansAssetByInum, payload.action.action_data.inum)
    yield put(deleteJansAssetResponse())
    yield call(postUserAction, audit)
    yield put(fetchJansAssets({}))
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(deleteJansAssetResponse())
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: AssetRootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* updateJansAsset({
  payload,
}: PayloadAction<UpdateAssetSagaPayload['payload']>): SagaIterator<Document | unknown> {
  const audit = yield* initAudit()
  try {
    const token: string = yield select(
      (state: AssetRootState) => state.authReducer.token.access_token,
    )
    addAdditionalData(audit, UPDATE, 'asset', payload)
    const assetApi: AssetApi = yield* newFunction()
    const data: Document = yield call(assetApi.updateJansAsset, payload.action.action_data, token)
    yield put(updateJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    yield put(fetchJansAssets({}))
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(updateJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      const jwt: string = yield select((state: AssetRootState) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

// Helper function to show error toast
function* errorToast(errMsg: string): Generator<PutEffect, void, void> {
  yield put(updateToast(true, 'error', errMsg))
}

export function* watchFetchJansAssets(): SagaIterator<void> {
  yield takeLatest('asset/fetchJansAssets', getAllJansAssets)
}

export function* watchGetAssetTypes(): SagaIterator<void> {
  yield takeLatest('asset/getAssetTypes', getAssetTypes)
}

export function* watchGetAssetServices(): SagaIterator<void> {
  yield takeLatest('asset/getAssetServices', getAssetServices)
}

export function* watchCreateJansAsset(): SagaIterator<void> {
  yield takeLatest('asset/createJansAsset', createJansAsset)
}

export function* watchDeleteJansAsset(): SagaIterator<void> {
  yield takeLatest('asset/deleteJansAsset', deleteJansAsset)
}

export function* watchUpdateJansAsset(): SagaIterator<void> {
  yield takeLatest('asset/updateJansAsset', updateJansAsset)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([
    fork(watchGetAssetServices),
    fork(watchGetAssetTypes),
    fork(watchFetchJansAssets),
    fork(watchCreateJansAsset),
    fork(watchDeleteJansAsset),
    fork(watchUpdateJansAsset),
  ])
}

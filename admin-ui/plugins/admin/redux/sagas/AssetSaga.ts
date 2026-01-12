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
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import AssetApi from '../api/AssetApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
import { redirectToLogout } from 'Redux/sagas/SagaUtils'
import {
  CreateAssetSagaPayload,
  UpdateAssetSagaPayload,
  DeleteAssetSagaPayload,
  GetAssetsSagaPayload,
} from '../features/types/asset'
import {
  DocumentPagedResult,
  Document,
  AssetFormData,
} from '../../components/Assets/types/AssetApiTypes'
import { AssetRootState } from './types/asset'
import { getErrorMessage } from './types/common'

import * as JansConfigApi from 'jans_config_api'
import { initAudit } from 'Redux/sagas/SagaUtils'

function* createAssetApi(): Generator<SelectEffect, AssetApi, string> {
  const issuer: string = yield select((state: AssetRootState) => state.authReducer.issuer)
  const api = new JansConfigApi.JansAssetsApi(getClient(JansConfigApi, null, issuer))
  return new AssetApi(api)
}

export function* getAllJansAssets({
  payload,
}: PayloadAction<GetAssetsSagaPayload['payload']>): SagaIterator<DocumentPagedResult | unknown> {
  const audit = yield* initAudit()
  try {
    const finalPayload = payload || { action: {} }
    addAdditionalData(audit, FETCH, 'asset', finalPayload)
    const assetApi: AssetApi = yield* createAssetApi()
    const data: DocumentPagedResult = yield call(assetApi.getAllJansAssets, finalPayload.action)
    yield put(getJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(getJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
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
    const assetApi: AssetApi = yield* createAssetApi()
    const data: string[] = yield call(assetApi.getAssetServices)
    yield put(getAssetServicesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(getAssetServicesResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
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
    const assetApi: AssetApi = yield* createAssetApi()
    const data: string[] = yield call(assetApi.getAssetTypes)
    yield put(getAssetTypesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(getAssetTypesResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* createJansAsset({
  payload,
}: PayloadAction<CreateAssetSagaPayload['payload']>): SagaIterator<Document | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, 'asset', payload)
    const assetApi: AssetApi = yield* createAssetApi()
    const data: Document = yield call(
      { context: assetApi, fn: assetApi.createJansAsset },
      payload.action.action_data as AssetFormData,
    )
    yield put(createJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(createJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
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
    const assetApi: AssetApi = yield* createAssetApi()
    yield call(assetApi.deleteJansAssetByInum, payload.action.action_data.inum)
    yield put(deleteJansAssetResponse())
    yield call(postUserAction, audit)
    yield put(fetchJansAssets({}))
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(deleteJansAssetResponse())
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* updateJansAsset({
  payload,
}: PayloadAction<UpdateAssetSagaPayload['payload']>): SagaIterator<Document | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'asset', payload)
    const assetApi: AssetApi = yield* createAssetApi()
    const data: Document = yield call(
      { context: assetApi, fn: assetApi.updateJansAsset },
      payload.action.action_data as AssetFormData,
    )
    yield put(updateJansAssetResponse({ data }))
    yield call(postUserAction, audit)
    yield put(fetchJansAssets({}))
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(updateJansAssetResponse({ data: null }))
    if (isFourZeroOneError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

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

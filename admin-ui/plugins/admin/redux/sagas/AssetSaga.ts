import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import type { PutEffect, SelectEffect } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  createJansAssetResponse,
  updateJansAssetResponse,
} from 'Plugins/admin/redux/features/AssetSlice'
import { CREATE, UPDATE } from '../../../../app/audit/UserActionType'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import AssetApi from '../api/AssetApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/backend-api'
import { redirectToLogout } from 'Redux/sagas/SagaUtils'
import {
  CreateAssetSagaPayload,
  UpdateAssetSagaPayload,
  type AssetAuditPayload,
} from '../features/types/asset'
import { Document, AssetFormData } from '../../components/Assets/types/AssetApiTypes'
import { AssetRootState } from './types/asset'
import {
  getErrorMessage,
  isHttpLikeError,
  type AuditRecord,
  type HttpErrorLike,
  type SagaErrorShape,
} from './types/common'

import * as JansConfigApi from 'jans_config_api'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { devLogger } from '@/utils/devLogger'

function* createAssetApi(): Generator<SelectEffect, AssetApi, string> {
  const issuer: string = yield select((state: AssetRootState) => state.authReducer.issuer)
  const api = new JansConfigApi.JansAssetsApi(getClient(JansConfigApi, null, issuer))
  return new AssetApi(api)
}

export function* createJansAsset({
  payload,
}: PayloadAction<CreateAssetSagaPayload['payload']>): SagaIterator<Document | Error | undefined> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit as AuditRecord, CREATE, 'asset', {
      action: { action_data: payload.action.action_data },
    } as AssetAuditPayload)
    const assetApi: AssetApi = yield* createAssetApi()
    const data: Document = yield call(
      [assetApi, assetApi.createJansAsset],
      payload.action.action_data as AssetFormData,
    )
    yield put(createJansAssetResponse({ data }))
    try {
      yield call(postUserAction, audit as UserActionPayload)
    } catch (auditError) {
      devLogger.error('Asset audit postUserAction failed', auditError)
    }
    return data
  } catch (e) {
    const errMsg = getErrorMessage(e as Error | SagaErrorShape)
    yield* errorToast(errMsg)
    yield put(createJansAssetResponse({ data: null }))
    if (isHttpLikeError(e as Error | SagaErrorShape) && isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return undefined
    }
    return e as Error
  }
}

export function* updateJansAsset({
  payload,
}: PayloadAction<UpdateAssetSagaPayload['payload']>): SagaIterator<Document | Error | undefined> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit as AuditRecord, UPDATE, 'asset', {
      action: { action_data: payload.action.action_data },
    } as AssetAuditPayload)
    const assetApi: AssetApi = yield* createAssetApi()
    const data: Document = yield call(
      [assetApi, assetApi.updateJansAsset],
      payload.action.action_data as AssetFormData,
    )
    yield put(updateJansAssetResponse({ data }))
    try {
      yield call(postUserAction, audit as UserActionPayload)
    } catch (auditError) {
      devLogger.error('Asset audit postUserAction failed', auditError)
    }
    return data
  } catch (e) {
    const errMsg = getErrorMessage(e as Error | SagaErrorShape)
    yield* errorToast(errMsg)
    yield put(updateJansAssetResponse({ data: null }))
    if (isHttpLikeError(e as Error | SagaErrorShape) && isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return undefined
    }
    return e as Error
  }
}

function* errorToast(errMsg: string): Generator<PutEffect, void, void> {
  yield put(updateToast(true, 'error', errMsg))
}

export function* watchCreateJansAsset(): SagaIterator<void> {
  yield takeLatest('asset/createJansAsset', createJansAsset)
}

export function* watchUpdateJansAsset(): SagaIterator<void> {
  yield takeLatest('asset/updateJansAsset', updateJansAsset)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([fork(watchCreateJansAsset), fork(watchUpdateJansAsset)])
}

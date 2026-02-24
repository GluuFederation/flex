import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import type { SelectEffect } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { isFourZeroThreeError, addAdditionalData } from 'Utils/TokenController'
import type { AuditRecord, HttpErrorLike } from './types/audit'
import {
  getAttributesResponseRoot,
  getAttributesRoot as getAttributesRootAction,
  toggleInitAttributeLoader,
} from '../features/attributesSlice'
import { postUserAction } from 'Redux/api/backend-api'
import type { UserActionPayload } from 'Redux/api/types/BackendApi'
import { FETCH } from '../../audit/UserActionType'
import AttributeApi from '../api/AttributeApi'
import type { AttributeOptions } from '../api/types/AttributeApi'
import { getClient } from 'Redux/api/base'
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
import * as JansConfigApi from 'jans_config_api'

const PERSON_SCHEMA = 'person schema'

interface GetAttributesRootPayload {
  init?: boolean
  options?: AttributeOptions
}

function* newFunction(): Generator<SelectEffect, AttributeApi, string> {
  const issuer = (yield select(
    (state: { authReducer: { issuer: string } }) => state.authReducer.issuer,
  )) as string
  const api = new JansConfigApi.AttributeApi(getClient(JansConfigApi, null, issuer))
  return new AttributeApi(api)
}

export function* getAttributesRoot(action: {
  type: string
  payload?: GetAttributesRootPayload
}): SagaIterator {
  const payload = action.payload ?? {}
  const audit = yield* initAudit()
  if (payload.init) {
    yield put(toggleInitAttributeLoader(true))
  }
  try {
    addAdditionalData(audit as AuditRecord, FETCH, PERSON_SCHEMA, payload as AuditRecord)
    const attributeApi = (yield* newFunction()) as AttributeApi
    const data = yield call(attributeApi.getAllAttributes, payload.options ?? {})
    yield put(getAttributesResponseRoot({ data }))
    yield call(postUserAction, audit as UserActionPayload)
  } catch (e) {
    yield put(getAttributesResponseRoot({ data: [] }))
    if (isFourZeroThreeError(e as HttpErrorLike)) {
      yield* redirectToLogout()
      return
    }
  } finally {
    yield put(toggleInitAttributeLoader(false))
  }
}

export function* watchGetAttributesRoot(): SagaIterator {
  yield takeLatest(getAttributesRootAction, getAttributesRoot)
}

export default function* rootSaga() {
  yield all([fork(watchGetAttributesRoot)])
}

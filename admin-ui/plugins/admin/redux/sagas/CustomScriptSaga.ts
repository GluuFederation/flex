import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import type { PutEffect, SelectEffect } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import {
  getCustomScriptsResponse,
  addCustomScriptResponse,
  editCustomScriptResponse,
  deleteCustomScriptResponse,
  setScriptTypes,
  setIsScriptTypesLoading,
} from 'Plugins/admin/redux/features/customScriptSlice'
import { SCRIPT } from '../audit/Resources'
import { CREATE, UPDATE, DELETION, FETCH } from '../../../../app/audit/UserActionType'
import { updateToast } from 'Redux/features/toastSlice'
import { isFourZeroSixError, addAdditionalData } from 'Utils/TokenController'
import ScriptApi from '../api/ScriptApi'
import { getClient } from 'Redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
import {
  CustomScriptItem,
  ScriptType,
  CustomScriptListResponse,
} from '../features/types/customScript'
import {
  CustomScriptRootState,
  CreateCustomScriptSagaPayload,
  UpdateCustomScriptSagaPayload,
  DeleteCustomScriptSagaPayload,
  GetCustomScriptsSagaPayload,
  GetCustomScriptsByTypeSagaPayload,
} from './types/customScript'
import { getErrorMessage } from './types/common'

import * as JansConfigApi from 'jans_config_api'
import { initAudit, redirectToLogout } from 'Redux/sagas/SagaUtils'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'

function* createScriptApi(): Generator<SelectEffect, ScriptApi, string> {
  const issuer: string = yield select((state: CustomScriptRootState) => state.authReducer.issuer)
  const api = new JansConfigApi.CustomScriptsApi(getClient(JansConfigApi, null, issuer))
  return new ScriptApi(api)
}

export function* getCustomScripts({
  payload,
}: PayloadAction<GetCustomScriptsSagaPayload['payload']>): SagaIterator<
  CustomScriptListResponse | unknown
> {
  const audit = yield* initAudit()
  try {
    const finalPayload = payload || { action: {} }
    addAdditionalData(audit, FETCH, SCRIPT, finalPayload)
    const scriptApi: ScriptApi = yield* createScriptApi()
    const data: CustomScriptListResponse = yield call(
      scriptApi.getAllCustomScript,
      finalPayload.action,
    )
    yield put(getCustomScriptsResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(getCustomScriptsResponse({}))
    if (isFourZeroSixError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* getScriptsByType({
  payload,
}: PayloadAction<GetCustomScriptsByTypeSagaPayload['payload']>): SagaIterator<
  CustomScriptListResponse | unknown
> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, FETCH, SCRIPT, payload)
    const scriptApi: ScriptApi = yield* createScriptApi()
    const data: CustomScriptListResponse = yield call(scriptApi.getScriptsByType, payload.action)
    yield put(getCustomScriptsResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(getCustomScriptsResponse({}))
    if (isFourZeroSixError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* addScript({
  payload,
}: PayloadAction<CreateCustomScriptSagaPayload['payload']>): SagaIterator<
  CustomScriptItem | unknown
> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, SCRIPT, payload)
    const scriptApi: ScriptApi = yield* createScriptApi()
    const data: CustomScriptItem = yield call(
      { context: scriptApi, fn: scriptApi.addCustomScript },
      payload.action.action_data as Record<string, unknown>,
    )
    yield call(triggerWebhook, { payload: { createdFeatureValue: data } })
    yield put(addCustomScriptResponse({ data }))
    yield call(postUserAction, audit)
    yield* successToast()
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(addCustomScriptResponse({}))
    if (isFourZeroSixError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* editScript({
  payload,
}: PayloadAction<UpdateCustomScriptSagaPayload['payload']>): SagaIterator<
  CustomScriptItem | unknown
> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, SCRIPT, payload)
    const scriptApi: ScriptApi = yield* createScriptApi()
    const data: CustomScriptItem = yield call(
      { context: scriptApi, fn: scriptApi.editCustomScript },
      payload.action.action_data as Record<string, unknown>,
    )
    yield put(editCustomScriptResponse({ data }))
    yield call(postUserAction, audit)
    yield* successToast()
    yield call(triggerWebhook, { payload: { createdFeatureValue: data } })
    return data
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(editCustomScriptResponse({}))
    if (isFourZeroSixError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* deleteScript({
  payload,
}: PayloadAction<DeleteCustomScriptSagaPayload>): SagaIterator<void | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, SCRIPT, payload)
    const scriptApi: ScriptApi = yield* createScriptApi()
    yield call({ context: scriptApi, fn: scriptApi.deleteCustomScript }, payload.action.action_data)
    yield* successToast()
    yield put(deleteCustomScriptResponse({ inum: payload.action.action_data }))
    yield call(triggerWebhook, {
      payload: { createdFeatureValue: { inum: payload.action.action_data } },
    })
    yield call(postUserAction, audit)
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    yield* errorToast(errMsg)
    yield put(deleteCustomScriptResponse({}))
    if (isFourZeroSixError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  }
}

export function* getScriptTypes(): SagaIterator<ScriptType[] | unknown> {
  yield put(setIsScriptTypesLoading(true))
  try {
    const scriptApi: ScriptApi = yield* createScriptApi()
    const data: string[] = yield call(scriptApi.getCustomScriptTypes)

    const types: ScriptType[] = data.map((type: string) => {
      if (type?.includes('_')) {
        const splitFormat: string[] = type?.split('_')
        const formattedTypes: string[] = splitFormat?.map(
          (formattedType: string) =>
            formattedType?.charAt(0)?.toUpperCase() + formattedType?.slice(1),
        )
        return { value: type, name: formattedTypes?.join(' ') }
      }

      return { value: type, name: type?.charAt(0)?.toUpperCase() + type?.slice(1) }
    })
    yield put(setScriptTypes(types || []))
    return types
  } catch (e: unknown) {
    const errMsg = getErrorMessage(e)
    console.log('error in getting script-types: ', errMsg)
    yield put(setScriptTypes([]))
    if (isFourZeroSixError(e)) {
      yield* redirectToLogout()
      return
    }
    return e
  } finally {
    yield put(setIsScriptTypesLoading(false))
  }
}

function* successToast(): Generator<PutEffect, void, void> {
  yield put(updateToast(true, 'success'))
}

function* errorToast(errMsg: string): Generator<PutEffect, void, void> {
  yield put(updateToast(true, 'error', errMsg))
}

export function* watchGetAllCustomScripts(): SagaIterator<void> {
  yield takeLatest('customScript/getCustomScripts', getCustomScripts)
}

export function* watchAddScript(): SagaIterator<void> {
  yield takeLatest('customScript/addCustomScript', addScript)
}

export function* watchEditScript(): SagaIterator<void> {
  yield takeLatest('customScript/editCustomScript', editScript)
}

export function* watchDeleteScript(): SagaIterator<void> {
  yield takeLatest('customScript/deleteCustomScript', deleteScript)
}

export function* watchScriptsByType(): SagaIterator<void> {
  yield takeLatest('customScript/getCustomScriptByType', getScriptsByType)
}

export function* watchGetScriptTypes(): SagaIterator<void> {
  yield takeLatest('customScript/getScriptTypes', getScriptTypes)
}

export default function* rootSaga(): SagaIterator<void> {
  yield all([
    fork(watchGetAllCustomScripts),
    fork(watchAddScript),
    fork(watchEditScript),
    fork(watchDeleteScript),
    fork(watchScriptsByType),
    fork(watchGetScriptTypes),
  ])
}

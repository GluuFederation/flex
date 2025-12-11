import { call, all, put, fork, select, takeEvery } from 'redux-saga/effects'
import type { SelectEffect, PutEffect } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { initAudit } from 'Redux/sagas/SagaUtils'
import { getClient } from 'Redux/api/base'
import {
  isFourZeroOneError,
  addAdditionalData,
  type AdditionalPayload,
} from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import SamlApi from '../api/SamlApi'
import {
  getSamlConfigurationResponse,
  toggleSavedFormFlag,
  getSamlIdentitiesResponse,
  putSamlPropertiesResponse,
  samlIdentityResponse,
  deleteSamlIdentityResponse,
  updateSamlIdentityResponse,
  getSamlIdentities,
  getWebsiteSsoServiceProviderResponse,
  deleteWebsiteSsoServiceProviderResponse,
  createWebsiteSsoServiceProviderResponse,
  updateWebsiteSsoServiceProviderResponse,
} from '../features/SamlSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { CREATE, DELETION, UPDATE } from '../../../../app/audit/UserActionType'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'
import { AUDIT_RESOURCE_NAMES } from '../../helper/constants'
import type {
  SamlRootState,
  PutSamlPropertiesSagaPayload,
  CreateSamlIdentitySagaPayload,
  UpdateSamlIdentitySagaPayload,
  DeleteSamlIdentitySagaPayload,
  CreateWebsiteSsoServiceProviderSagaPayload,
  UpdateWebsiteSsoServiceProviderSagaPayload,
  DeleteWebsiteSsoServiceProviderSagaPayload,
} from '../../types/saga'
import type {
  SamlConfiguration,
  WebsiteSsoServiceProviderListResponse,
  GetSamlIdentityProviderPayload,
} from '../../types/redux'
import type {
  SamlApiResponse,
  SamlIdentityCreateResponse,
  SamlIdentityProviderResponse,
} from '../../types/api'

import * as JansConfigApi from 'jans_config_api'

type PayloadForAudit =
  | PutSamlPropertiesSagaPayload
  | CreateSamlIdentitySagaPayload
  | UpdateSamlIdentitySagaPayload
  | DeleteSamlIdentitySagaPayload
  | CreateWebsiteSsoServiceProviderSagaPayload
  | UpdateWebsiteSsoServiceProviderSagaPayload
  | DeleteWebsiteSsoServiceProviderSagaPayload

const toAdditionalPayload = (payload: PayloadForAudit): AdditionalPayload => {
  const actionData = payload.action.action_data
  const compatibleActionData: Record<string, string | number | boolean | object | null | FormData> =
    typeof actionData === 'string'
      ? { value: actionData }
      : actionData instanceof FormData
        ? { formData: actionData }
        : { ...actionData }

  return {
    action: {
      action_message: payload.action.action_message,
      action_data: compatibleActionData,
    },
  } as AdditionalPayload
}

function* newSamlConfigFunction(): Generator<SelectEffect, SamlApi, string> {
  const token: string = yield select((state: SamlRootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: SamlRootState) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLConfigurationApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

function* newSamlIdentityFunction(): Generator<SelectEffect, SamlApi, string> {
  const token: string = yield select((state: SamlRootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: SamlRootState) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLIdentityBrokerApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

function* newWebsiteSsoServiceProviderFunction(): Generator<SelectEffect, SamlApi, string> {
  const token: string = yield select((state: SamlRootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: SamlRootState) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLTrustRelationshipApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

export function* getSamlConfigSaga(): SagaIterator<SamlConfiguration | Error> {
  const audit = yield* initAudit()
  try {
    const api: SamlApi = yield* newSamlConfigFunction()
    const data: SamlConfiguration = yield call(api.getSamlProperties)
    yield put(getSamlConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getSamlConfigurationResponse(null))
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  }
}

export function* getSamlIdentityProvider({
  payload,
}: PayloadAction<GetSamlIdentityProviderPayload>): SagaIterator<
  SamlIdentityProviderResponse | Error
> {
  const audit = yield* initAudit()
  try {
    const api: SamlApi = yield* newSamlIdentityFunction()
    const data: SamlIdentityProviderResponse = yield call(api.getSamlIdentityProvider, payload)
    yield put(getSamlIdentitiesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getSamlIdentitiesResponse(null))
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  }
}

export function* putSamlProperties({
  payload,
}: PayloadAction<PutSamlPropertiesSagaPayload>): SagaIterator<SamlConfiguration | Error | void> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, AUDIT_RESOURCE_NAMES.SAML, toAdditionalPayload(payload))
    const api: SamlApi = yield* newSamlConfigFunction()
    const data: SamlConfiguration = yield call(api.putSamlProperties, {
      samlAppConfiguration: payload.action.action_data,
    })
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(putSamlPropertiesResponse(data))
    yield call(postUserAction, audit)
    yield put(updateToast(true, 'success', 'Data updated successfully'))
    return data
  } catch (e) {
    yield put(putSamlPropertiesResponse(null))
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  }
}

export function* getWebsiteSsoServiceProvidersSaga(): SagaIterator<
  WebsiteSsoServiceProviderListResponse | Error
> {
  const audit = yield* initAudit()
  try {
    const api: SamlApi = yield* newWebsiteSsoServiceProviderFunction()
    const data: WebsiteSsoServiceProviderListResponse = yield call(api.getWebsiteSsoServiceProvider)
    yield put(getWebsiteSsoServiceProviderResponse({ data: data?.body || [] }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getWebsiteSsoServiceProviderResponse(null))
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  }
}

export function* postWebsiteSsoServiceProvider({
  payload,
}: PayloadAction<CreateWebsiteSsoServiceProviderSagaPayload>): SagaIterator<
  SamlApiResponse | Error | void
> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(
      audit,
      CREATE,
      AUDIT_RESOURCE_NAMES.TRUST_RELATIONSHIP,
      toAdditionalPayload(payload),
    )
    const token: string = yield select(
      (state: SamlRootState) => state.authReducer.token.access_token,
    )
    const api: SamlApi = yield* newWebsiteSsoServiceProviderFunction()
    const data: SamlApiResponse = yield call(api.postWebsiteSsoServiceProvider, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(updateToast(true, 'success', 'Data created successfully'))
    return data
  } catch (e) {
    console.log('Error: ', e)
    yield put(toggleSavedFormFlag(false))
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  } finally {
    yield put(createWebsiteSsoServiceProviderResponse())
  }
}

export function* updateWebsiteSsoServiceProvider({
  payload,
}: PayloadAction<UpdateWebsiteSsoServiceProviderSagaPayload>): SagaIterator<
  SamlApiResponse | Error | void
> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(
      audit,
      UPDATE,
      AUDIT_RESOURCE_NAMES.TRUST_RELATIONSHIP,
      toAdditionalPayload(payload),
    )
    const token: string = yield select(
      (state: SamlRootState) => state.authReducer.token.access_token,
    )
    const api: SamlApi = yield* newWebsiteSsoServiceProviderFunction()
    const data: SamlApiResponse = yield call(api.updateWebsiteSsoServiceProvider, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(updateToast(true, 'success', 'Data updated successfully'))
    return data
  } catch (e) {
    console.log('Error: ', e)
    yield put(toggleSavedFormFlag(false))
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  } finally {
    yield put(updateWebsiteSsoServiceProviderResponse())
  }
}

export function* deleteWebsiteSsoServiceProvider({
  payload,
}: PayloadAction<DeleteWebsiteSsoServiceProviderSagaPayload>): SagaIterator<
  SamlApiResponse | Error | void
> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(
      audit,
      DELETION,
      AUDIT_RESOURCE_NAMES.TRUST_RELATIONSHIP,
      toAdditionalPayload(payload),
    )
    const api: SamlApi = yield* newWebsiteSsoServiceProviderFunction()
    yield call(api.deleteWebsiteSsoServiceProvider, payload.action.action_data)
    yield put(deleteWebsiteSsoServiceProviderResponse())
    yield call(getWebsiteSsoServiceProvidersSaga)
    yield call(postUserAction, audit)
    yield* triggerWebhook({
      payload: { createdFeatureValue: payload.action.action_data },
    })
    yield put(updateToast(true, 'success', 'Data deleted successfully'))
    return { success: true } as SamlApiResponse
  } catch (e) {
    yield put(deleteWebsiteSsoServiceProviderResponse())
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  }
}

export function* postSamlIdentity({
  payload,
}: PayloadAction<CreateSamlIdentitySagaPayload>): SagaIterator<SamlIdentityCreateResponse | Error> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(
      audit,
      CREATE,
      AUDIT_RESOURCE_NAMES.IDENTITY_BROKERING,
      toAdditionalPayload(payload),
    )
    const token: string = yield select(
      (state: SamlRootState) => state.authReducer.token.access_token,
    )
    const api: SamlApi = yield* newSamlIdentityFunction()
    const data: SamlIdentityCreateResponse = yield call(api.postSamlIdentityProvider, {
      formdata: payload.action.action_data,
      token,
    })
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield put(updateToast(true, 'success', 'Data created successfully'))
    return data
  } catch (e) {
    console.log('Error: ', e)
    yield put(toggleSavedFormFlag(false))
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  } finally {
    yield put(samlIdentityResponse())
  }
}

export function* updateSamlIdentity({
  payload,
}: PayloadAction<UpdateSamlIdentitySagaPayload>): SagaIterator<
  SamlIdentityCreateResponse | Error | void
> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(
      audit,
      UPDATE,
      AUDIT_RESOURCE_NAMES.IDENTITY_BROKERING,
      toAdditionalPayload(payload),
    )
    const token: string = yield select(
      (state: SamlRootState) => state.authReducer.token.access_token,
    )
    const api: SamlApi = yield* newSamlIdentityFunction()
    const data: SamlIdentityCreateResponse = yield call(api.updateSamlIdentityProvider, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield call(postUserAction, audit)
    yield put(updateToast(true, 'success', 'Data updated successfully'))
    return data
  } catch (e) {
    console.log('Error: ', e)
    yield put(toggleSavedFormFlag(false))
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  } finally {
    yield put(updateSamlIdentityResponse())
  }
}

export function* deleteSamlIdentity({
  payload,
}: PayloadAction<DeleteSamlIdentitySagaPayload>): SagaIterator<SamlApiResponse | Error> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(
      audit,
      DELETION,
      AUDIT_RESOURCE_NAMES.IDENTITY_BROKERING,
      toAdditionalPayload(payload),
    )
    const api: SamlApi = yield* newSamlIdentityFunction()
    const inum = payload.action.action_data
    const data: SamlApiResponse = yield call(api.deleteSamlIdentityProvider, inum)
    yield put(deleteSamlIdentityResponse())
    yield put(getSamlIdentities({} as GetSamlIdentityProviderPayload))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(updateToast(true, 'success', 'Data deleted successfully'))
    return data
  } catch (e) {
    yield put(deleteSamlIdentityResponse())
    const error = e instanceof Error ? e : new Error(String(e))
    yield* handleFourZeroOneError(error)
    yield* errorToast({ error })
    return error
  }
}

function* errorToast({ error }: { error: Error }): Generator<PutEffect, void, void> {
  const errorMessage =
    (error as { response?: { data?: { description?: string; message?: string } } })?.response?.data
      ?.description ||
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    error.message
  yield put(updateToast(true, 'error', errorMessage))
}

function* handleFourZeroOneError(
  error: Error | { status?: number } | null,
): Generator<SelectEffect | PutEffect, void, string> {
  const errorWithStatus =
    error && typeof error === 'object' && 'status' in error
      ? { status: (error as { status?: number }).status }
      : null
  if (isFourZeroOneError(errorWithStatus)) {
    const jwt: string = yield select((state: SamlRootState) => state.authReducer.userinfo_jwt)
    yield put(getAPIAccessToken(jwt))
  }
}

export function* watchGetSamlConfig(): Generator {
  yield takeEvery('idpSaml/getSamlConfiguration', getSamlConfigSaga)
}

export function* watchGetSamlIdentityProvider(): Generator {
  yield takeEvery('idpSaml/getSamlIdentities', getSamlIdentityProvider)
}

export function* watchGetWebsiteSsoServiceProvidersSaga(): Generator {
  yield takeEvery('idpSaml/getWebsiteSsoServiceProvider', getWebsiteSsoServiceProvidersSaga)
}

export function* watchPutSamlProperties(): Generator {
  yield takeEvery('idpSaml/putSamlProperties', putSamlProperties)
}

export function* watchCreateSamlIdentity(): Generator {
  yield takeEvery('idpSaml/createSamlIdentity', postSamlIdentity)
}

export function* watchCreateWebsiteSsoServiceProvider(): Generator {
  yield takeEvery('idpSaml/createWebsiteSsoServiceProvider', postWebsiteSsoServiceProvider)
}

export function* watchDeleteSamlIdentityProvider(): Generator {
  yield takeEvery('idpSaml/deleteSamlIdentity', deleteSamlIdentity)
}

export function* watchUpdateSamlIdentity(): Generator {
  yield takeEvery('idpSaml/updateSamlIdentity', updateSamlIdentity)
}

export function* watchDeleteWebsiteSsoServiceProvider(): Generator {
  yield takeEvery('idpSaml/deleteWebsiteSsoServiceProvider', deleteWebsiteSsoServiceProvider)
}

export function* watchUpdateWebsiteSsoServiceProvider(): Generator {
  yield takeEvery('idpSaml/updateWebsiteSsoServiceProvider', updateWebsiteSsoServiceProvider)
}

export default function* rootSaga(): Generator {
  yield all([
    fork(watchGetSamlConfig),
    fork(watchGetSamlIdentityProvider),
    fork(watchPutSamlProperties),
    fork(watchCreateSamlIdentity),
    fork(watchDeleteSamlIdentityProvider),
    fork(watchUpdateSamlIdentity),
    fork(watchCreateWebsiteSsoServiceProvider),
    fork(watchGetWebsiteSsoServiceProvidersSaga),
    fork(watchUpdateWebsiteSsoServiceProvider),
    fork(watchDeleteWebsiteSsoServiceProvider),
  ])
}

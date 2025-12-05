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
  getSamlIdentites,
  getTrustRelationshipResponse,
  deleteTrustRelationshipResponse,
  updateTrustRelationshipResponse,
} from '../features/SamlSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { CREATE, DELETION, UPDATE } from '../../../../app/audit/UserActionType'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'
import type {
  SamlRootState,
  PutSamlPropertiesSagaPayload,
  CreateSamlIdentitySagaPayload,
  UpdateSamlIdentitySagaPayload,
  DeleteSamlIdentitySagaPayload,
  CreateTrustRelationshipSagaPayload,
  UpdateTrustRelationshipSagaPayload,
  DeleteTrustRelationshipSagaPayload,
} from './types/saml'
import type {
  SamlConfiguration,
  TrustRelationshipListResponse,
  GetSamlIdentityProviderPayload,
} from '../../types/redux'
import type {
  SamlApiResponse,
  SamlIdentityCreateResponse,
  SamlIdentityProviderResponse,
} from '../../types/api'

import * as JansConfigApi from 'jans_config_api'

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

function* newTrustRelationFunction(): Generator<SelectEffect, SamlApi, string> {
  const token: string = yield select((state: SamlRootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: SamlRootState) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLTrustRelationshipApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

export function* getSamlConfigSaga(): SagaIterator<SamlConfiguration | unknown> {
  const audit = yield* initAudit()
  try {
    const api: SamlApi = yield* newSamlConfigFunction()
    const data: SamlConfiguration = yield call(api.getSamlProperties)
    yield put(getSamlConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    yield put(getSamlConfigurationResponse(null))
    yield* handleFourZeroOneError(e as Error)
    yield* errorToast({ error: e as Error })
    return e
  }
}

export function* getSamlIdentityProvider({
  payload,
}: PayloadAction<GetSamlIdentityProviderPayload>): SagaIterator<
  SamlIdentityProviderResponse | unknown
> {
  const audit = yield* initAudit()
  try {
    const api: SamlApi = yield* newSamlIdentityFunction()
    const data: SamlIdentityProviderResponse = yield call(api.getSamlIdentityProvider, payload)
    yield put(getSamlIdentitiesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    yield put(getSamlIdentitiesResponse(null))
    yield* handleFourZeroOneError(e as Error)
    yield* errorToast({ error: e as Error })
    return e
  }
}

export function* putSamlProperties({
  payload,
}: PayloadAction<PutSamlPropertiesSagaPayload>): SagaIterator<SamlConfiguration | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'SAML', payload as AdditionalPayload)
    const api: SamlApi = yield* newSamlConfigFunction()
    const data: SamlConfiguration = yield call(api.putSamlProperties, {
      samlAppConfiguration: payload.action.action_data as SamlConfiguration,
    })
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(putSamlPropertiesResponse(data))
    yield call(postUserAction, audit)
    yield put(updateToast(true, 'success', 'Data updated successfully'))
  } catch (error: unknown) {
    yield put(putSamlPropertiesResponse(null))
    yield* handleFourZeroOneError(error as Error)
    yield* errorToast({ error: error as Error })
    return error
  }
}

export function* getTrustRelationshipsSaga(): SagaIterator<
  TrustRelationshipListResponse | unknown
> {
  const audit = yield* initAudit()
  try {
    const api: SamlApi = yield* newTrustRelationFunction()
    const data: TrustRelationshipListResponse = yield call(api.getTrustRelationship)
    yield put(getTrustRelationshipResponse({ data: data?.body || [] }))
    yield call(postUserAction, audit)
    return data
  } catch (e: unknown) {
    yield put(getTrustRelationshipResponse(null))
    yield* handleFourZeroOneError(e as Error)
    yield* errorToast({ error: e as Error })
    return e
  }
}

export function* postTrustRelationship({
  payload,
}: PayloadAction<CreateTrustRelationshipSagaPayload>): SagaIterator<SamlApiResponse | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, 'TRUST-RELATIONSHIP', payload as unknown as AdditionalPayload)
    const token: string = yield select(
      (state: SamlRootState) => state.authReducer.token.access_token,
    )
    const api: SamlApi = yield* newTrustRelationFunction()
    const data: SamlApiResponse = yield call(api.postTrustRelationship, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(updateToast(true, 'success', 'Data saved successfully'))
  } catch (error: unknown) {
    console.log('Error: ', error)
    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error as Error)
    yield* errorToast({ error: error as Error })
    return error
  } finally {
    yield put(samlIdentityResponse())
  }
}

export function* updateTrustRelationship({
  payload,
}: PayloadAction<UpdateTrustRelationshipSagaPayload>): SagaIterator<SamlApiResponse | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'TRUST-RELATIONSHIP', payload as unknown as AdditionalPayload)
    const token: string = yield select(
      (state: SamlRootState) => state.authReducer.token.access_token,
    )
    const api: SamlApi = yield* newTrustRelationFunction()
    const data: SamlApiResponse = yield call(api.updateTrustRelationship, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(updateToast(true, 'success', 'Data updated successfully'))
  } catch (error: unknown) {
    console.log('Error: ', error)
    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error as Error)
    yield* errorToast({ error: error as Error })
    return error
  } finally {
    yield put(updateTrustRelationshipResponse())
  }
}

export function* deleteTrustRelationship({
  payload,
}: PayloadAction<DeleteTrustRelationshipSagaPayload>): SagaIterator<SamlApiResponse | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(
      audit,
      DELETION,
      'TRUST-RELATIONSHIP',
      payload as unknown as AdditionalPayload,
    )
    const api: SamlApi = yield* newTrustRelationFunction()
    yield call(api.deleteTrustRelationship, payload.action.action_data)
    yield put(deleteTrustRelationshipResponse())
    yield call(getTrustRelationshipsSaga)
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: payload.action.action_data } })
    yield put(updateToast(true, 'success', 'Data deleted successfully'))
  } catch (error: unknown) {
    yield put(deleteTrustRelationshipResponse())
    yield* handleFourZeroOneError(error as Error)
    yield* errorToast({ error: error as Error })
    return error
  }
}

export function* postSamlIdentity({
  payload,
}: PayloadAction<CreateSamlIdentitySagaPayload>): SagaIterator<
  SamlIdentityCreateResponse | unknown
> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, 'SAML', payload as unknown as AdditionalPayload)
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
    yield put(updateToast(true, 'success', 'Data saved successfully'))
  } catch (error: unknown) {
    console.log('Error: ', error)
    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error as Error)
    yield* errorToast({ error: error as Error })
    return error
  } finally {
    yield put(samlIdentityResponse())
  }
}

export function* updateSamlIdentity({
  payload,
}: PayloadAction<UpdateSamlIdentitySagaPayload>): SagaIterator<
  SamlIdentityCreateResponse | unknown
> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'SAML', payload as unknown as AdditionalPayload)
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
  } catch (error: unknown) {
    console.log('Error: ', error)
    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error as Error)
    yield* errorToast({ error: error as Error })
    return error
  } finally {
    yield put(updateSamlIdentityResponse())
  }
}

export function* deleteSamlIdentity({
  payload,
}: PayloadAction<DeleteSamlIdentitySagaPayload>): SagaIterator<SamlApiResponse | unknown> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, 'SAML', payload as unknown as AdditionalPayload)
    const api: SamlApi = yield* newSamlIdentityFunction()
    const data: SamlApiResponse = yield call(
      api.deleteSamlIdentityProvider,
      payload.action.action_data,
    )
    yield put(deleteSamlIdentityResponse())
    yield put(getSamlIdentites({} as GetSamlIdentityProviderPayload))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(updateToast(true, 'success', 'Data deleted successfully'))
  } catch (error: unknown) {
    yield put(deleteSamlIdentityResponse())
    yield* handleFourZeroOneError(error as Error)
    yield* errorToast({ error: error as Error })
    return error
  }
}

function* errorToast({ error }: { error: Error }): Generator<PutEffect, void, unknown> {
  const errorMessage =
    (error as { response?: { data?: { description?: string; message?: string } } })?.response?.data
      ?.description ||
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    error.message
  yield put(updateToast(true, 'error', errorMessage))
}

function* handleFourZeroOneError(
  error: unknown,
): Generator<SelectEffect | PutEffect, void, string> {
  if (isFourZeroOneError(error as { status?: number } | null)) {
    const jwt: string = yield select((state: SamlRootState) => state.authReducer.userinfo_jwt)
    yield put(getAPIAccessToken(jwt))
  }
}

export function* watchGetSamlConfig(): Generator {
  yield takeEvery('idpSaml/getSamlConfiguration', getSamlConfigSaga)
}

export function* watchGetSamlIdentityProvider(): Generator {
  yield takeEvery('idpSaml/getSamlIdentites', getSamlIdentityProvider)
}

export function* watchGetTrustRelationshipsSaga(): Generator {
  yield takeEvery('idpSaml/getTrustRelationship', getTrustRelationshipsSaga)
}

export function* watchPutSamlProperties(): Generator {
  yield takeEvery('idpSaml/putSamlProperties', putSamlProperties)
}

export function* watchCreateSamlIdentity(): Generator {
  yield takeEvery('idpSaml/createSamlIdentity', postSamlIdentity)
}

export function* watchCreateTrustRelationship(): Generator {
  yield takeEvery('idpSaml/createTrustRelationship', postTrustRelationship)
}

export function* watchDeleteSamlIdentityProvider(): Generator {
  yield takeEvery('idpSaml/deleteSamlIdentity', deleteSamlIdentity)
}

export function* watchUpdateSamlIdentity(): Generator {
  yield takeEvery('idpSaml/updateSamlIdentity', updateSamlIdentity)
}

export function* watchDeleteTrustRelationship(): Generator {
  yield takeEvery('idpSaml/deleteTrustRelationship', deleteTrustRelationship)
}

export function* watchUpdateTrustRelationship(): Generator {
  yield takeEvery('idpSaml/updateTrustRelationship', updateTrustRelationship)
}

export default function* rootSaga(): Generator {
  yield all([
    fork(watchGetSamlConfig),
    fork(watchGetSamlIdentityProvider),
    fork(watchPutSamlProperties),
    fork(watchCreateSamlIdentity),
    fork(watchDeleteSamlIdentityProvider),
    fork(watchUpdateSamlIdentity),
    fork(watchCreateTrustRelationship),
    fork(watchGetTrustRelationshipsSaga),
    fork(watchUpdateTrustRelationship),
    fork(watchDeleteTrustRelationship),
  ])
}

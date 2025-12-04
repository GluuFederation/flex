import { initAudit } from 'Redux/sagas/SagaUtils'
import { getClient } from 'Redux/api/base'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { call, all, put, fork, select, takeEvery } from 'redux-saga/effects'
import type { PutEffect, SelectEffect } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { postUserAction } from 'Redux/api/backend-api'
import SamlApi from '../api/SamlApi'
import * as JansConfigApi from 'jans_config_api'
import {
  getSamlConfiguration,
  getSamlConfigurationResponse,
  toggleSavedFormFlag,
  getSamlIdentitiesResponse,
  putSamlProperties as putSamlPropertiesAction,
  putSamlPropertiesResponse,
  samlIdentityResponse,
  deleteSamlIdentity as deleteSamlIdentityAction,
  deleteSamlIdentityResponse,
  updateSamlIdentity as updateSamlIdentityAction,
  updateSamlIdentityResponse,
  getSamlIdentites,
  getTrustRelationship as getTrustRelationshipAction,
  getTrustRelationshipResponse,
  deleteTrustRelationship as deleteTrustRelationshipAction,
  deleteTrustRelationshipResponse,
  updateTrustRelationship as updateTrustRelationshipAction,
  updateTrustRelationshipResponse,
  createSamlIdentity as createSamlIdentityAction,
  createTrustRelationship as createTrustRelationshipAction,
} from '../features/SamlSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { CREATE, DELETION, UPDATE } from '../../../../app/audit/UserActionType'
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSaga'
import type {
  PutSamlPropertiesPayload,
  GetSamlIdentityProviderPayload,
  CreateSamlIdentityPayload,
  UpdateSamlIdentityPayload,
  CreateTrustRelationshipPayload,
  UpdateTrustRelationshipPayload,
  SamlIdentityProviderResponse,
  TrustRelationshipListResponse,
  SamlConfiguration,
} from '../../types/redux'
import type { SamlIdentityCreateResponse, SamlApiResponse } from '../../types/api'

interface AuthState {
  token: {
    access_token: string
  }
  issuer: string
  userinfo_jwt: string
}

interface RootState {
  authReducer: AuthState
}

function* newSamlConfigFunction(): Generator<SelectEffect, SamlApi, string> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLConfigurationApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

function* newSamlIdentityFunction(): Generator<SelectEffect, SamlApi, string> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLIdentityBrokerApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

function* newTrustRelationFunction(): Generator<SelectEffect, SamlApi, string> {
  const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
  const issuer: string = yield select((state: RootState) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLTrustRelationshipApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

export function* getSamlConfigSaga(): SagaIterator<SamlConfiguration | Error> {
  const audit = yield* initAudit()
  try {
    const api: SamlApi = yield* newSamlConfigFunction()
    const data: SamlConfiguration = yield call(api.getSamlProperties.bind(api))
    yield put(getSamlConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getSamlConfigurationResponse(null))
    yield* handleFourZeroOneError(e as Error & { status?: number })
    return e as Error
  }
}

export function* getSamlIdentityProvider({
  payload,
}: {
  payload: GetSamlIdentityProviderPayload
}): SagaIterator<SamlIdentityProviderResponse> {
  const audit = yield* initAudit()
  try {
    const api: SamlApi = yield* newSamlIdentityFunction()
    const data: SamlIdentityProviderResponse = yield call(
      api.getSamlIdentityProvider.bind(api),
      payload,
    )
    yield put(getSamlIdentitiesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getSamlIdentitiesResponse(null))
    yield* handleFourZeroOneError(e as Error)
    return e as SamlIdentityProviderResponse
  }
}

export function* putSamlProperties({
  payload,
}: {
  payload: PutSamlPropertiesPayload
}): SagaIterator<SamlConfiguration> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'SAML', {
      action: {
        action_message: payload.action.action_message,
        action_data: {
          enabled: String(payload.action.action_data.enabled),
          selectedIdp: payload.action.action_data.selectedIdp,
          ignoreValidation: String(payload.action.action_data.ignoreValidation),
          applicationName: payload.action.action_data.applicationName,
        },
      },
    })
    const api: SamlApi = yield* newSamlConfigFunction()
    const data: SamlConfiguration = yield call(api.putSamlProperties.bind(api), payload)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(putSamlPropertiesResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (error) {
    yield* errorToast({ error: error as Error })
    yield put(putSamlPropertiesResponse(null))
    yield* handleFourZeroOneError(error as Error)
    return error as SamlConfiguration
  }
}

export function* postSamlIdentity({
  payload,
}: {
  payload: { action: { action_data: FormData } }
}): SagaIterator<SamlIdentityCreateResponse> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, 'SAML', {
      action: {
        action_data: {} as Record<string, string | boolean>,
      },
    })
    const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
    const api: SamlApi = yield* newSamlIdentityFunction()
    const createPayload: CreateSamlIdentityPayload = {
      formdata: payload.action.action_data,
      token,
    }
    const data: SamlIdentityCreateResponse = yield call(
      api.postSamlIdentityProvider.bind(api),
      createPayload,
    )
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    return data
  } catch (error) {
    yield* errorToast({ error: error as Error })

    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error as Error)
    return error as SamlIdentityCreateResponse
  } finally {
    yield put(samlIdentityResponse())
  }
}

export function* getTrustRelationshipsSaga(): SagaIterator<TrustRelationshipListResponse> {
  const audit = yield* initAudit()
  try {
    const api: SamlApi = yield* newTrustRelationFunction()
    const data: TrustRelationshipListResponse = yield call(api.getTrustRelationship.bind(api))
    yield put(getTrustRelationshipResponse({ data: data.body || [] }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getTrustRelationshipResponse(null))
    yield* handleFourZeroOneError(e as Error)
    return e as TrustRelationshipListResponse
  }
}

export function* postTrustRelationship({
  payload,
}: {
  payload: { action: { action_data: FormData } }
}): SagaIterator<SamlApiResponse> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, 'TRUST-RELATIONSHIP', {
      action: {
        action_data: {} as Record<string, string | boolean>,
      },
    })
    const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
    const api: SamlApi = yield* newTrustRelationFunction()
    const createPayload: CreateTrustRelationshipPayload = {
      formdata: payload.action.action_data,
      token,
    }
    const data: SamlApiResponse = yield call(api.postTrustRelationship.bind(api), createPayload)
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (error) {
    yield* errorToast({ error: error as Error })

    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error as Error & { status?: number })
    return error as SamlApiResponse
  } finally {
    yield put(samlIdentityResponse())
  }
}

export function* updateTrustRelationship({
  payload,
}: {
  payload: { action: { action_data: FormData; action_inum?: string } }
}): SagaIterator<SamlApiResponse> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'TRUST-RELATIONSHIP', {
      action: {
        action_data: {} as Record<string, string | boolean>,
      },
    })
    const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
    const api: SamlApi = yield* newTrustRelationFunction()
    if (!payload.action.action_inum) {
      throw new Error('inum is required for update')
    }
    const updatePayload: UpdateTrustRelationshipPayload = {
      formdata: payload.action.action_data,
      token,
      inum: payload.action.action_inum,
    }
    const data: SamlApiResponse = yield call(api.updateTrustRelationship.bind(api), updatePayload)
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (error) {
    yield* errorToast({ error: error as Error })

    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error as Error & { status?: number })
    return error as SamlApiResponse
  } finally {
    yield put(updateTrustRelationshipResponse())
  }
}

export function* deleteTrustRelationship({
  payload,
}: {
  payload: { action: { action_data: string } }
}): SagaIterator<SamlApiResponse> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, 'TRUST-RELATIONSHIP', {
      action: {
        action_data: { inum: payload.action.action_data } as Record<string, string>,
      },
    })
    const api: SamlApi = yield* newTrustRelationFunction()
    const inum = payload.action.action_data
    const data: SamlApiResponse = yield call(api.deleteTrustRelationship.bind(api), inum)
    yield put(deleteTrustRelationshipResponse())
    yield call(getTrustRelationshipsSaga)
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: payload } })
    return data
  } catch (error) {
    yield* errorToast({ error: error as Error })

    yield put(deleteTrustRelationshipResponse())
    yield* handleFourZeroOneError(error as Error & { status?: number })
    return error as SamlApiResponse
  }
}

export function* updateSamlIdentity({
  payload,
}: {
  payload: { action: { action_data: FormData; action_inum?: string } }
}): SagaIterator<SamlIdentityCreateResponse> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'SAML', {
      action: {
        action_data: {} as Record<string, string | boolean>,
      },
    })
    const token: string = yield select((state: RootState) => state.authReducer.token.access_token)
    const api: SamlApi = yield* newSamlIdentityFunction()
    if (!payload.action.action_inum) {
      throw new Error('inum is required for update')
    }
    const updatePayload: UpdateSamlIdentityPayload = {
      formdata: payload.action.action_data,
      token,
      inum: payload.action.action_inum,
    }
    const data: SamlIdentityCreateResponse = yield call(
      api.updateSamlIdentityProvider.bind(api),
      updatePayload,
    )
    yield put(toggleSavedFormFlag(true))
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield call(postUserAction, audit)
    return data
  } catch (error) {
    yield* errorToast({ error: error as Error })

    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error as Error & { status?: number })
    return error as SamlIdentityCreateResponse
  } finally {
    yield put(updateSamlIdentityResponse())
  }
}

export function* deleteSamlIdentity({
  payload,
}: {
  payload: { action: { action_data: string } }
}): SagaIterator<SamlApiResponse> {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, 'SAML', {
      action: {
        action_data: { inum: payload.action.action_data } as Record<string, string>,
      },
    })
    const api: SamlApi = yield* newSamlIdentityFunction()
    const inum = payload.action.action_data
    const data: SamlApiResponse = yield call(api.deleteSamlIdentityProvider.bind(api), inum)
    yield put(deleteSamlIdentityResponse())
    yield put(getSamlIdentites({ inum: '' }))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    return data
  } catch (error) {
    yield* errorToast({ error: error as Error })

    yield put(deleteSamlIdentityResponse())
    yield* handleFourZeroOneError(error as Error & { status?: number })
    return error as SamlApiResponse
  }
}

function* errorToast({ error }: { error: Error }): Generator<PutEffect, void, void> {
  const apiError = error as Error & {
    response?: {
      data?: {
        description?: string
        message?: string
      }
    }
  }

  const errorMessage =
    apiError.response?.data?.description ||
    apiError.response?.data?.message ||
    apiError.message ||
    'An error occurred'

  yield put(updateToast(true, 'error', errorMessage))
}

function* handleFourZeroOneError(
  error: Error & { status?: number },
): Generator<SelectEffect | PutEffect, void, string> {
  if (isFourZeroOneError(error)) {
    const jwt: string = yield select((state: RootState) => state.authReducer.userinfo_jwt)
    yield put(getAPIAccessToken(jwt))
  }
}

export function* watchGetSamlConfig(): SagaIterator<void> {
  yield takeEvery(getSamlConfiguration, getSamlConfigSaga)
}

export function* watchGetSamlIdentityProvider(): SagaIterator<void> {
  yield takeEvery(getSamlIdentites, getSamlIdentityProvider)
}

export function* watchGetTrustRelationshipsSaga(): SagaIterator<void> {
  yield takeEvery(getTrustRelationshipAction, getTrustRelationshipsSaga)
}

export function* watchPutSamlProperties(): SagaIterator<void> {
  yield takeEvery(putSamlPropertiesAction, putSamlProperties)
}

export function* watchCreateSamlIdentity(): SagaIterator<void> {
  yield takeEvery(createSamlIdentityAction, postSamlIdentity)
}

export function* watchCreateTrustRelationship(): SagaIterator<void> {
  yield takeEvery(createTrustRelationshipAction, postTrustRelationship)
}

export function* watchDeleteSamlIdentityProvider(): SagaIterator<void> {
  yield takeEvery(deleteSamlIdentityAction, deleteSamlIdentity)
}

export function* watchUpdateSamlIdentity(): SagaIterator<void> {
  yield takeEvery(updateSamlIdentityAction, updateSamlIdentity)
}

export function* watchDeleteTrustRelationship(): SagaIterator<void> {
  yield takeEvery(deleteTrustRelationshipAction, deleteTrustRelationship)
}

export function* watchUpdateTrustRelationship(): SagaIterator<void> {
  yield takeEvery(updateTrustRelationshipAction, updateTrustRelationship)
}

export default function* rootSaga(): SagaIterator<void> {
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

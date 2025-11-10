import { initAudit } from 'Redux/sagas/SagaUtils'
import { getClient } from 'Redux/api/base'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { call, all, put, fork, select, takeEvery } from 'redux-saga/effects'
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
import { triggerWebhook } from 'Plugins/admin/redux/sagas/WebhookSagaUtils'

const JansConfigApi = require('jans_config_api')

function* newSamlConfigFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLConfigurationApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

function* newSamlIdentityFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLIdentityBrokerApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

function* newTrustRelationFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLTrustRelationshipApi(getClient(JansConfigApi, token, issuer))
  return new SamlApi(api)
}

export function* getSamlConfigSaga() {
  const audit = yield* initAudit()
  try {
    const api = yield* newSamlConfigFunction()
    const data = yield call(api.getSamlProperties)
    yield put(getSamlConfigurationResponse(data))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getSamlConfigurationResponse(null))
    yield* handleFourZeroOneError(e)
    return e
  }
}

export function* getSamlIdentityProvider({ payload }) {
  const audit = yield* initAudit()
  try {
    const api = yield* newSamlIdentityFunction()
    const data = yield call(api.getSamlIdentityProvider, payload)
    yield put(getSamlIdentitiesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getSamlIdentitiesResponse())
    yield* handleFourZeroOneError(e)
    return e
  }
}

export function* putSamlProperties({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'SAML', payload)
    const api = yield* newSamlConfigFunction()
    const data = yield call(api.putSamlProperties, {
      samlAppConfiguration: payload.action.action_data,
    })
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(putSamlPropertiesResponse(data))
    yield call(postUserAction, audit)
  } catch (error) {
    yield* errorToast({ error })
    yield put(putSamlPropertiesResponse())
    yield* handleFourZeroOneError(error)
    return error
  }
}

export function* postSamlIdentity({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, 'SAML', payload)
    const token = yield select((state) => state.authReducer.token.access_token)
    const api = yield* newSamlIdentityFunction()
    const data = yield call(api.postSamlIdentityProvider, {
      formdata: payload.action.action_data,
      token,
    })
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
  } catch (error) {
    console.log('Error: ', error)
    yield* errorToast({ error })

    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error)
    return error
  } finally {
    yield put(samlIdentityResponse())
  }
}

export function* getTrustRelationshipsSaga() {
  const audit = yield* initAudit()
  try {
    const api = yield* newTrustRelationFunction()
    const data = yield call(api.getTrustRelationship)
    yield put(getTrustRelationshipResponse({ data: data?.body || [] }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getTrustRelationshipResponse())
    yield* handleFourZeroOneError(e)
    return e
  }
}

export function* postTrustRelationship({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, CREATE, 'TRUST-RELATIONSHIP', payload)
    const token = yield select((state) => state.authReducer.token.access_token)
    const api = yield* newTrustRelationFunction()
    const data = yield call(api.postTrustRelationship, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
  } catch (error) {
    console.log('Error: ', error)
    yield* errorToast({ error })

    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error)
    return error
  } finally {
    yield put(samlIdentityResponse())
  }
}

export function* updateTrustRelationship({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'TRUST-RELATIONSHIP', payload)
    const token = yield select((state) => state.authReducer.token.access_token)
    const api = yield* newTrustRelationFunction()
    const data = yield call(api.updateTrustRelationship, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
  } catch (error) {
    console.log('Error: ', error)
    yield* errorToast({ error })

    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error)
    return error
  } finally {
    yield put(updateTrustRelationshipResponse())
  }
}

export function* deleteTrustRelationship({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, 'TRUST-RELATIONSHIP', payload)
    const api = yield* newTrustRelationFunction()
    const data = yield call(api.deleteTrustRelationship, payload.action.action_data)
    yield put(deleteTrustRelationshipResponse(data))
    yield getTrustRelationshipsSaga()
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: payload.action.action_data } })
  } catch (error) {
    yield* errorToast({ error })

    yield put(deleteTrustRelationshipResponse())
    yield* handleFourZeroOneError(error)
    return error
  }
}

export function* updateSamlIdentity({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, UPDATE, 'SAML', payload)
    const token = yield select((state) => state.authReducer.token.access_token)
    const api = yield* newSamlIdentityFunction()
    const data = yield call(api.updateSamlIdentityProvider, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
    yield call(postUserAction, audit)
  } catch (error) {
    console.log('Error: ', error)
    yield* errorToast({ error })

    yield put(toggleSavedFormFlag(false))
    yield* handleFourZeroOneError(error)
    return error
  } finally {
    yield put(updateSamlIdentityResponse())
  }
}

export function* deleteSamlIdentity({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, DELETION, 'SAML', payload)
    const api = yield* newSamlIdentityFunction()
    const data = yield call(api.deleteSamlIdentityProvider, payload.action.action_data)
    yield put(deleteSamlIdentityResponse(data))
    yield put(getSamlIdentites())
    yield call(postUserAction, audit)
    yield* triggerWebhook({ payload: { createdFeatureValue: data } })
  } catch (error) {
    yield* errorToast({ error })

    yield put(deleteSamlIdentityResponse())
    yield* handleFourZeroOneError(error)
    return error
  }
}

function* errorToast({ error }) {
  yield put(
    updateToast(
      true,
      'error',
      error?.response?.data?.description || error?.response?.data?.message || error.message,
    ),
  )
}

function* handleFourZeroOneError(error) {
  if (isFourZeroOneError(error)) {
    const jwt = yield select((state) => state.authReducer.userinfo_jwt)
    yield put(getAPIAccessToken(jwt))
  }
}

export function* watchGetSamlConfig() {
  yield takeEvery('idpSaml/getSamlConfiguration', getSamlConfigSaga)
}

export function* watchGetSamlIdentityProvider() {
  yield takeEvery('idpSaml/getSamlIdentites', getSamlIdentityProvider)
}

export function* watchGetTrustRelationshipsSaga() {
  yield takeEvery('idpSaml/getTrustRelationship', getTrustRelationshipsSaga)
}

export function* watchPutSamlProperties() {
  yield takeEvery('idpSaml/putSamlProperties', putSamlProperties)
}

export function* watchCreateSamlIdentity() {
  yield takeEvery('idpSaml/createSamlIdentity', postSamlIdentity)
}

export function* watchCreateTrustRelationship() {
  yield takeEvery('idpSaml/createTrustRelationship', postTrustRelationship)
}

export function* watchDeleteSamlIdentityProvider() {
  yield takeEvery('idpSaml/deleteSamlIdentity', deleteSamlIdentity)
}

export function* watchUpdateSamlIdentity() {
  yield takeEvery('idpSaml/updateSamlIdentity', updateSamlIdentity)
}

export function* watchDeleteTrustRelationship() {
  yield takeEvery('idpSaml/deleteTrustRelationship', deleteTrustRelationship)
}

export function* watchUpdateTrustRelationship() {
  yield takeEvery('idpSaml/updateTrustRelationship', updateTrustRelationship)
}

export default function* rootSaga() {
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

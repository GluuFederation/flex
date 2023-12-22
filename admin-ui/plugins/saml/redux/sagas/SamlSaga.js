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
  updateSamlIdentityResponse
} from '../features/SamlSlice'
import { getAPIAccessToken } from 'Redux/features/authSlice'

const JansConfigApi = require('jans_config_api')

function* newSamlConfigFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLConfigurationApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new SamlApi(api)
}

function* newTrustRelationshipsFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLTrustRelationshipApi(
    getClient(JansConfigApi, token, issuer)
  )
  return new SamlApi(api)
}

function* newSamlIdentityFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.SAMLIdentityBrokerApi(
    getClient(JansConfigApi, token, issuer)
  )
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
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getTrustRelationshipsSaga({ payload }) {
  const audit = yield* initAudit()
  try {
    const api = yield* newSamlIdentityFunction()
    const data = yield call(api.getSamlIdentityProvider, payload)
    yield put(getSamlIdentitiesResponse({ data }))
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(getSamlIdentitiesResponse())
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* putSamlProperties({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, 'UPDATE', 'SAML', payload)
    const api = yield* newSamlConfigFunction()
    const data = yield call(api.putSamlProperties, {
      samlAppConfiguration: payload.action.action_data,
    })
    yield put(putSamlPropertiesResponse(data))
    yield call(postUserAction, audit)
  } catch (error) {
    yield put(putSamlPropertiesResponse())
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* postSamlIdentity({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, 'CREATE', 'SAML', payload)
    const token = yield select((state) => state.authReducer.token.access_token)
    const api = yield* newSamlIdentityFunction()
    yield call(api.postSamlIdentityProvider, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
  } catch (error) {
    console.log('Error: ', error)
    yield put(toggleSavedFormFlag(false))
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  } finally {
    yield put(samlIdentityResponse())
  }
}

export function* updateSamlIdentity({ payload }) {
  console.log('update identity')
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, 'UPDATE', 'SAML', payload)
    const token = yield select((state) => state.authReducer.token.access_token)
    const api = yield* newSamlIdentityFunction()
    yield call(api.updateSamlIdentityProvider, {
      formdata: payload.action.action_data,
      token,
    })
    yield put(toggleSavedFormFlag(true))
    yield call(postUserAction, audit)
  } catch (error) {
    console.log('Error: ', error)
    yield put(toggleSavedFormFlag(false))
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  } finally {
    yield put(updateSamlIdentityResponse())
  }
}

export function* deleteSamlIdentity({ payload }) {
  const audit = yield* initAudit()
  try {
    addAdditionalData(audit, 'DELETE', 'SAML', payload)
    const api = yield* newSamlIdentityFunction()
    const data = yield call(
      api.deleteSamlIdentityProvider,
      payload.action.action_data
    )
    yield put(deleteSamlIdentityResponse(data))
    yield* getTrustRelationshipsSaga()
    yield call(postUserAction, audit)
  } catch (error) {
    yield put(deleteSamlIdentityResponse())
    if (isFourZeroOneError(error)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return error
  }
}

export function* watchGetSamlConfig() {
  yield takeEvery('idpSaml/getSamlConfiguration', getSamlConfigSaga)
}

export function* watchGetTrustRelationshipsSaga() {
  yield takeEvery('idpSaml/getSamlIdentites', getTrustRelationshipsSaga)
}

export function* watchPutSamlProperties() {
  yield takeEvery('idpSaml/putSamlProperties', putSamlProperties)
}

export function* watchCreateSamlIdentity() {
  yield takeEvery('idpSaml/createSamlIdentity', postSamlIdentity)
}

export function* watchDeleteSamlIdentityProvider() {
  yield takeEvery('idpSaml/deleteSamlIdentity', deleteSamlIdentity)
}

export function* watchUpdateSamlIdentity() {
  yield takeEvery('idpSaml/updateSamlIdentity', updateSamlIdentity)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetSamlConfig),
    fork(watchGetTrustRelationshipsSaga),
    fork(watchPutSamlProperties),
    fork(watchCreateSamlIdentity),
    fork(watchDeleteSamlIdentityProvider),
    fork(watchUpdateSamlIdentity)
  ])
}

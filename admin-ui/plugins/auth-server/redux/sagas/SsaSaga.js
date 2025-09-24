import { call, all, put, fork, takeLatest, select } from 'redux-saga/effects'
import { isFourZeroOneError, addAdditionalData } from 'Utils/TokenController'
import { getAPIAccessToken } from 'Redux/features/authSlice'
import SsaApi from '../api/SsaApi'
import {
  getSsaConfig,
  getSsaConfigResponse,
  removeSsaResponse,
  toggleSaveConfig,
  getSsaJwtResponse,
} from '../features/SsaSlice'
import { CREATE, DELETION } from '../../../../app/audit/UserActionType'
import { initAudit } from '../../../../app/redux/sagas/SagaUtils'
import { updateToast } from 'Redux/features/toastSlice'
import { getClient } from '@/redux/api/base'
import { postUserAction } from 'Redux/api/backend-api'
const JansConfigApi = require('jans_config_api')

function* newFunction() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const issuer = yield select((state) => state.authReducer.issuer)
  const api = new JansConfigApi.SoftwareStatementAssertionSSAApi(
    getClient(JansConfigApi, token, issuer),
  )
  return new SsaApi(api)
}

export function* getSsa() {
  const token = yield select((state) => state.authReducer.token.access_token)
  const { authServerHost } = yield select((state) => state.authReducer.config)
  try {
    const data = yield call(new SsaApi().getAllSsa, { payload: { token }, authServerHost })
    if (!data?.error) {
      yield put(getSsaConfigResponse(data))
    } else {
      yield put(getSsaConfigResponse([]))
      yield put(updateToast(true, 'error', data?.error))
    }
    return data
  } catch (e) {
    yield put(getSsaConfigResponse([]))
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* getSsaJwt({ payload }) {
  const token = yield select((state) => state.authReducer.token.access_token)
  const { authServerHost } = yield select((state) => state.authReducer.config)
  try {
    const data = yield call(new SsaApi().getSsaJwt, {
      jti: payload.action.action_data,
      token,
      authServerHost,
    })
    yield put(getSsaJwtResponse(data))
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(getSsaJwtResponse([]))
    return e
  }
}

export function* addSsaConfig({ payload }) {
  const audit = yield* initAudit()
  addAdditionalData(audit, CREATE, 'post-register-ssa', payload)
  const token = yield select((state) => state.authReducer.token.access_token)
  const { authServerHost } = yield select((state) => state.authReducer.config)
  try {
    const data = yield call(new SsaApi().createSsa, {
      payload: payload.action.action_data,
      token,
      authServerHost,
    })
    if (!data?.error) {
      createAndDownloadJSONFile(data)
      yield put(toggleSaveConfig(true))
      yield put(updateToast(true, 'success', data?.error))
    }
    return payload.action.action_data
  } catch (e) {
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

export function* removeSsaConfig({ payload }) {
  const audit = yield* initAudit()
  addAdditionalData(audit, DELETION, 'delete-ssa', payload)
  const token = yield select((state) => state.authReducer.token.access_token)
  try {
    const ssaApi = yield* newFunction()
    const data = yield call(ssaApi.removeSsa, {
      jti: payload.action.action_data,
      authorization: 'Bearer ' + token,
    })
    yield put(updateToast(true, 'success'))
    yield put(getSsaConfig())
    yield call(postUserAction, audit)
    return data
  } catch (e) {
    yield put(updateToast(true, 'error'))
    yield put(removeSsaResponse())
    if (isFourZeroOneError(e)) {
      const jwt = yield select((state) => state.authReducer.userinfo_jwt)
      yield put(getAPIAccessToken(jwt))
    }
    return e
  }
}

function createAndDownloadJSONFile(data) {
  // Convert the data object to a JSON string
  const jsonData = JSON.stringify(data, null, 2)

  // Create a Blob object with the JSON content
  const blob = new Blob([jsonData], { type: 'application/json' })

  // Create a temporary <a> element to trigger the download
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'file.json'

  // Append the <a> element to the document body
  document.body.appendChild(link)

  // Trigger the download
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

export function* watchGetSsaConfig() {
  yield takeLatest('ssa/getSsaConfig', getSsa)
}

export function* watchAddSsaConfig() {
  yield takeLatest('ssa/createSsa', addSsaConfig)
}

export function* watchRemoveSsaConfig() {
  yield takeLatest('ssa/removeSsa', removeSsaConfig)
}

export function* watchGetSsaJwt() {
  yield takeLatest('ssa/getSsaJwt', getSsaJwt)
}

export default function* rootSaga() {
  yield all([
    fork(watchGetSsaConfig),
    fork(watchAddSsaConfig),
    fork(watchRemoveSsaConfig),
    fork(watchGetSsaJwt),
  ])
}

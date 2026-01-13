// @ts-nocheck

import { all, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
import {
  getOAuth2ConfigResponse,
  getAPIAccessTokenResponse,
  getUserLocationResponse,
  setBackendStatus,
  putConfigWorkerResponse,
} from '../features/authSlice'

import {
  fetchServerConfiguration,
  getUserIpAndLocation,
  fetchApiTokenWithDefaultScopes,
  putServerConfiguration,
  createAdminUiSession as createAdminUiSessionApi,
  deleteAdminUiSession as deleteAdminUiSessionApi,
} from '../api/backend-api'
import { updateToast } from 'Redux/features/toastSlice'
import {
  createAdminUiSession,
  createAdminUiSessionResponse,
  deleteAdminUiSessionResponse,
} from 'Redux/features/authSlice'
import { isFourZeroOneError } from 'Utils/TokenController'
import { redirectToLogout } from 'Redux/sagas/SagaUtils'

function* getApiTokenWithDefaultScopes() {
  try {
    const response = yield call(fetchApiTokenWithDefaultScopes)
    if (response?.access_token) {
      return response.access_token
    }
    return null
  } catch (error) {
    yield put(
      setBackendStatus({
        active: false,
        errorMessage: error?.response?.data?.responseMessage,
        statusCode: error?.response?.status,
      }),
    )
    return null
  }
}

function* getOAuth2ConfigWorker({ payload }) {
  try {
    const hasSession = yield select((state) => state.authReducer.hasSession)

    let token = null
    if (!hasSession) {
      token = payload?.access_token
      if (!token) {
        token = yield* getApiTokenWithDefaultScopes()
      }
      if (!token) {
        yield put(getOAuth2ConfigResponse())
        return
      }
    }

    const response = yield call(fetchServerConfiguration, token)
    if (response) {
      localStorage.setItem('postLogoutRedirectUri', response.postLogoutRedirectUri)
      yield put(getOAuth2ConfigResponse({ config: response }))
      return
    }
  } catch (error) {
    console.error('Problems getting OAuth2 configuration.', error?.response?.data || error)
    if (isFourZeroOneError(error)) {
      yield* redirectToLogout()
      return
    }
  }
  yield put(getOAuth2ConfigResponse())
}

export function* putConfigWorker({ payload }) {
  try {
    const { _meta, ...configData } = payload
    const response = yield call(putServerConfiguration, { props: configData })
    if (response) {
      yield put(getOAuth2ConfigResponse({ config: response }))

      if (_meta?.cedarlingLogTypeChanged && _meta?.toastMessage) {
        yield put(updateToast(true, 'success', _meta.toastMessage))
      } else {
        yield put(updateToast(true, 'success'))
      }
      return
    }
  } catch (error) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroOneError(error)) {
      yield* redirectToLogout()
      return
    }
    return error
  } finally {
    yield put(putConfigWorkerResponse())
  }
}

function* getAPIAccessTokenWorker(jwt) {
  try {
    if (jwt?.payload) {
      const response = yield call(fetchApiTokenWithDefaultScopes)
      if (response) {
        yield put(
          getAPIAccessTokenResponse({
            scopes: response.scopes,
            issuer: response.issuer,
          }),
        )

        if (response.access_token) {
          yield put(
            createAdminUiSession({ ujwt: jwt.payload, apiProtectionToken: response.access_token }),
          )
        } else {
          console.error('Failed to obtain API token for session creation')
          yield put(
            createAdminUiSessionResponse({ success: false, error: 'Failed to obtain API token' }),
          )
        }
      }
    }
  } catch (error) {
    console.error('Problems getting API Access Token.', error?.response?.data || error)
    yield put(
      setBackendStatus({
        active: false,
        errorMessage: error?.response?.data?.responseMessage,
        statusCode: error?.response?.status,
      }),
    )
    if (isFourZeroOneError(error)) {
      yield* redirectToLogout()
    }
  }
}

function* getLocationWorker() {
  try {
    const response = yield call(getUserIpAndLocation)
    if (response) {
      yield put(getUserLocationResponse({ location: response }))
      return
    }
  } catch (error) {
    console.error('Problem getting user location.', error?.response?.data || error)
  }
}

function* createAdminUiSessionWorker({ payload }) {
  try {
    const { ujwt, apiProtectionToken } = payload
    yield call(createAdminUiSessionApi, ujwt, apiProtectionToken)
    yield put(createAdminUiSessionResponse({ success: true }))
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error?.response?.data?.responseMessage || error?.message
    console.error('Problems creating Admin UI session.', error?.response?.data || error)
    if (isFourZeroOneError(error)) {
      yield* redirectToLogout()
      return
    }
    yield put(createAdminUiSessionResponse({ success: false, error: errorMessage }))
  }
}

function* deleteAdminUiSessionWorker() {
  try {
    yield call(deleteAdminUiSessionApi)
  } catch (error) {
    console.error('Problems deleting Admin UI session.', error?.response?.data || error)
  } finally {
    yield put(deleteAdminUiSessionResponse())
  }
}

export function* getApiTokenWatcher() {
  yield takeEvery('auth/getAPIAccessToken', getAPIAccessTokenWorker)
}

export function* getOAuth2ConfigWatcher() {
  yield takeEvery('auth/getOAuth2Config', getOAuth2ConfigWorker)
}
export function* getLocationWatcher() {
  yield takeEvery('auth/getUserLocation', getLocationWorker)
}
export function* putConfigWorkerWatcher() {
  yield takeEvery('auth/putConfigWorker', putConfigWorker)
}
export function* createAdminUiSessionWatcher() {
  yield takeLatest('auth/createAdminUiSession', createAdminUiSessionWorker)
}
export function* deleteAdminUiSessionWatcher() {
  yield takeEvery('auth/deleteAdminUiSession', deleteAdminUiSessionWorker)
}

export default function* rootSaga() {
  yield all([
    fork(getOAuth2ConfigWatcher),
    fork(getApiTokenWatcher),
    fork(getLocationWatcher),
    fork(putConfigWorkerWatcher),
    fork(createAdminUiSessionWatcher),
    fork(deleteAdminUiSessionWatcher),
  ])
}

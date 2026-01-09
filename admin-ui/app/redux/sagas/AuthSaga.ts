// @ts-nocheck

import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects'
import {
  getOAuth2ConfigResponse,
  getAPIAccessTokenResponse,
  getUserLocationResponse,
  setBackendStatus,
  putConfigWorkerResponse,
} from '../features/authSlice'

import {
  fetchServerConfiguration,
  fetchApiAccessToken,
  getUserIpAndLocation,
  fetchApiTokenWithDefaultScopes,
  putServerConfiguration,
  createAdminUiSession,
  deleteAdminUiSession,
} from '../api/backend-api'
import { updateToast } from 'Redux/features/toastSlice'
import {
  getAPIAccessToken,
  createAdminUiSessionResponse,
  deleteAdminUiSessionResponse,
} from 'Redux/features/authSlice'
import { isFourZeroOneError } from 'Utils/TokenController'

function* getApiTokenWithDefaultScopes() {
  const response = yield call(fetchApiTokenWithDefaultScopes)

  if (response?.access_token) {
    return response.access_token
  } else if (response?.name === 'AxiosError') {
    yield put(
      setBackendStatus({
        active: false,
        errorMessage: response?.response?.data?.responseMessage,
        statusCode: response?.response?.status,
      }),
    )
    return null
  }
}

function* getOAuth2ConfigWorker({ payload }) {
  try {
    // Check if we have a session or a pre-login token
    const hasSession = yield select((state) => state.authReducer.hasSession)

    // Pre-login: use provided token; Post-login: use session cookie
    let token = null
    if (!hasSession) {
      // Get token from payload or fetch a new default token
      token = payload?.access_token
      if (!token) {
        token = yield* getApiTokenWithDefaultScopes()
      }
    }

    const response = yield call(fetchServerConfiguration, token)
    if (response && response !== -1) {
      localStorage.setItem('postLogoutRedirectUri', response.postLogoutRedirectUri)
      yield put(getOAuth2ConfigResponse({ config: response }))
      return
    }
  } catch (error) {
    console.log('Problems getting OAuth2 configuration.', error)
  }
  yield put(getOAuth2ConfigResponse())
}

export function* putConfigWorker({ payload }) {
  try {
    // Extract metadata (if any) from payload
    const { _meta, ...configData } = payload
    const response = yield call(putServerConfiguration, { props: configData })
    if (response) {
      yield put(getOAuth2ConfigResponse({ config: response }))

      // If cedarlingLogType changed, show specific toast; otherwise show generic success
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
      // Session expired - redirect to login
      window.location.href = '/logout'
    }
    return error
  } finally {
    yield put(putConfigWorkerResponse())
  }
}

function* getAPIAccessTokenWorker(jwt) {
  try {
    if (jwt) {
      // Get API protection token with UJWT for permissions/scopes
      const response = yield call(fetchApiAccessToken, jwt.payload)
      if (response && response !== -1) {
        yield put(
          getAPIAccessTokenResponse({
            scopes: response.scopes,
            issuer: response.issuer,
          }),
        )

        // Get token for one-time session creation
        const defaultToken = yield* getApiTokenWithDefaultScopes()

        if (defaultToken) {
          try {
            yield call(createAdminUiSession, jwt.payload, defaultToken)
            yield put(createAdminUiSessionResponse({ success: true }))
          } catch (sessionError) {
            console.log('Problems creating Admin UI session.', sessionError)
            throw sessionError
          }
        }
        return
      }
    }
  } catch (error) {
    console.log('Problems getting API Access Token.', error)
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
    console.log('Problem getting user location.', error)
  }
}

function* createAdminUiSessionWorker({ payload }) {
  try {
    const { ujwt, apiProtectionToken } = payload
    yield call(createAdminUiSession, ujwt, apiProtectionToken)
    yield put(createAdminUiSessionResponse({ success: true }))
  } catch (error) {
    console.log('Problems creating Admin UI session.', error)
    yield put(createAdminUiSessionResponse({ success: false }))
  }
}

function* deleteAdminUiSessionWorker() {
  try {
    yield call(deleteAdminUiSession)
    yield put(deleteAdminUiSessionResponse())
  } catch (error) {
    console.log('Problems deleting Admin UI session.', error)
    yield put(deleteAdminUiSessionResponse())
  }
}

//watcher sagas
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
  yield takeEvery('auth/createAdminUiSession', createAdminUiSessionWorker)
}
export function* deleteAdminUiSessionWatcher() {
  yield takeEvery('auth/deleteAdminUiSession', deleteAdminUiSessionWorker)
}
/**
 * Auth Root Saga
 */
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

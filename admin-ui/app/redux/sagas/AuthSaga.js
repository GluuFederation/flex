/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import {
  getOAuth2ConfigResponse,
  getAPIAccessTokenResponse,
  getUserLocationResponse,
  setBackendStatus,
} from '../features/authSlice'

import {
  fetchServerConfiguration,
  fetchApiAccessToken,
  getUserIpAndLocation,
  fetchApiTokenWithDefaultScopes,
} from '../api/backend-api'

function* getApiTokenWithDefaultScopes() {
    const response = yield call(fetchApiTokenWithDefaultScopes)

    if (response?.access_token) {
      return response.access_token
    } else if(response?.name === "AxiosError") {
      yield(put(setBackendStatus({ active: false, errorMessage: response?.response?.data?.responseMessage, statusCode: response?.response?.status })))
      return null
    }
}

function* getOAuth2ConfigWorker({ payload }) {
  try {
    const token = !payload?.access_token ? yield* getApiTokenWithDefaultScopes() : payload.access_token
    const response = yield call(fetchServerConfiguration, token)
    localStorage.setItem('postLogoutRedirectUri', response.postLogoutRedirectUri)
    if (response) {
      yield put(getOAuth2ConfigResponse({ config: response }))
      return
    }
  } catch (error) {
    console.log('Problems getting OAuth2 configuration.', error)
  }
  yield put(getOAuth2ConfigResponse())
}

function* getAPIAccessTokenWorker(jwt) {
  try {
    if (jwt) {
      const response = yield call(fetchApiAccessToken, jwt.payload)
      if (response) {
        yield put(getAPIAccessTokenResponse(response))
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

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getOAuth2ConfigWatcher),
    fork(getApiTokenWatcher),
    fork(getLocationWatcher),
  ])
}

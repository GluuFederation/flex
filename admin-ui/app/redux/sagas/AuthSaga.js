/**
 * Auth Sagas
 */
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import {
  getOAuth2ConfigResponse,
  getUserInfoResponse,
  getAPIAccessTokenResponse,
  getUserLocationResponse,
  getRandomChallengePairResponse,
  setBackendStatus,
} from '../features/authSlice'

import {
  fetchServerConfiguration,
  fetchUserInformation,
  fetchApiAccessToken,
  getUserIpAndLocation,
  fetchApiTokenWithDefaultScopes,
} from '../api/backend-api'

import {RandomHashGenerator} from  'Utils/RandomHashGenerator'

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
    if (response) {
      yield put(getOAuth2ConfigResponse({ config: response }))
      return
    }
  } catch (error) {
    console.log('Problems getting OAuth2 configuration.', error)
  }
  yield put(getOAuth2ConfigResponse())
}

function* getUserInformationWorker(code, codeVerifier) {
  try {
    const response = yield call(fetchUserInformation, code.payload, localStorage.getItem("codeVerifier"))
    if (response) {
      yield put(getUserInfoResponse({ uclaims: response.claims, ujwt: response.jwtUserInfo }))
      return
    }
  } catch (error) {
    console.log('Problems getting user information.', error)
  }
}
function* getAPIAccessTokenWorker(jwt) {
  try {
    if (jwt) {
      const response = yield call(fetchApiAccessToken, jwt.payload)
      if (response) {
        yield put(getAPIAccessTokenResponse({ accessToken: response }))
        return
      }
    }
  } catch (error) {
    console.log('Problems getting API Access Token.', error)
  }
}

function* getRandomChallengePairWorker() {
  try {
      const response = yield call(RandomHashGenerator.generateRandomChallengePair, 'SHA-256')
      if (response) {
        yield put(getRandomChallengePairResponse(response))
        return
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

export function* userInfoWatcher() {
  yield takeEvery('auth/getUserInfo', getUserInformationWorker)
}

export function* getOAuth2ConfigWatcher() {
  yield takeEvery('auth/getOAuth2Config', getOAuth2ConfigWorker)
}
export function* getLocationWatcher() {
  yield takeEvery('auth/getUserLocation', getLocationWorker)
}
export function* getRandomChallengePairWatcher() {
  yield takeEvery('auth/getRandomChallengePair', getRandomChallengePairWorker)
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
  yield all([
    fork(getOAuth2ConfigWatcher),
    fork(userInfoWatcher),
    fork(getApiTokenWatcher),
    fork(getLocationWatcher),
    fork(getRandomChallengePairWatcher),
  ])
}

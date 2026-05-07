import { all, call, fork, put, select } from 'redux-saga/effects'
import type { Location as AppLocation } from '../features/types/authTypes'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { takeEvery, takeLatest } from './effects'
import {
  getOAuth2Config,
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
  deleteAdminUiSession,
  deleteAdminUiSessionResponse,
  getAPIAccessToken,
  getUserLocation,
  putConfigWorker as putConfigWorkerAction,
} from 'Redux/features/authSlice'
import { isFourZeroThreeError } from 'Utils/TokenController'
import { redirectToLogout } from 'Redux/sagas/SagaUtils'
import type { ApiErrorLike } from './types'
import { devLogger } from '@/utils/devLogger'
import { setApiToken } from 'Orval/orvalMutator'

type Throwable = Error | ApiErrorLike | string | number | boolean | object | null | undefined

const asApiError = (error: Throwable): ApiErrorLike => {
  if (error === null || error === undefined) return { message: String(error), response: undefined }
  if (typeof error === 'string') return { message: error, response: undefined }
  if (error instanceof Error) {
    const axiosLike = error as Error & { response?: ApiErrorLike['response'] }
    return { message: error.message, response: axiosLike.response }
  }
  const obj = error as ApiErrorLike
  const message = typeof obj.message === 'string' ? obj.message : String(error)
  return { message, response: obj.response }
}

function* getApiTokenWithDefaultScopes(): Generator {
  try {
    const response = (yield call(fetchApiTokenWithDefaultScopes)) as
      | { access_token?: string; scopes?: string[]; issuer?: string }
      | undefined
    if (response?.access_token) {
      return response.access_token
    }
    return null
  } catch (error) {
    const err = asApiError(error as Throwable)
    yield put(
      setBackendStatus({
        active: false,
        errorMessage: err?.response?.data?.responseMessage ?? null,
        statusCode: err?.response?.status ?? null,
      }),
    )
    return null
  }
}

function* getOAuth2ConfigWorker({
  payload,
}: {
  type: string
  payload?: { access_token?: string }
}): Generator {
  try {
    const hasSession = yield select((state) => state.authReducer.hasSession)

    let token = null
    if (!hasSession) {
      token = payload?.access_token
      if (!token) {
        token = yield* getApiTokenWithDefaultScopes()
      }
      if (!token) {
        yield put(getOAuth2ConfigResponse({}))
        return
      }
    }

    const response = (yield call(fetchServerConfiguration, token ?? undefined)) as
      | { postLogoutRedirectUri?: string }
      | undefined
    if (response?.postLogoutRedirectUri) {
      localStorage.setItem('postLogoutRedirectUri', response.postLogoutRedirectUri)
      yield put(getOAuth2ConfigResponse({ config: response }))
      return
    }
  } catch (error) {
    const err = asApiError(error as Throwable)
    devLogger.error('Problems getting OAuth2 configuration.', err?.response?.data ?? err.message)
    if (isFourZeroThreeError(err)) {
      yield* redirectToLogout()
      return
    }
  }
  yield put(getOAuth2ConfigResponse({}))
}

export function* putConfigWorker({
  payload,
}: {
  type: string
  payload: Record<string, JsonValue | undefined> & {
    _meta?: { cedarlingLogTypeChanged?: boolean; toastMessage?: string | undefined }
  }
}): Generator {
  try {
    const { _meta, ...configData } = payload
    const response = yield call(putServerConfiguration, { props: configData })
    if (response) {
      yield put(getOAuth2ConfigResponse({ config: response }))

      if (_meta?.toastMessage) {
        yield put(updateToast(true, 'success', _meta.toastMessage))
      } else {
        yield put(updateToast(true, 'success'))
      }
      return
    }
  } catch (error) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroThreeError(asApiError(error as Throwable))) {
      yield* redirectToLogout()
      return
    }
    return
  } finally {
    yield put(putConfigWorkerResponse())
  }
}

function* getAPIAccessTokenWorker(action: { type: string; payload?: string }): Generator {
  try {
    if (action?.payload) {
      const response = yield call(fetchApiTokenWithDefaultScopes)
      if (response) {
        yield put(
          getAPIAccessTokenResponse({
            scopes: response.scopes,
            issuer: response.issuer,
          }),
        )

        if (response.access_token) {
          setApiToken(response.access_token)
          yield put(
            createAdminUiSession({
              ujwt: action.payload,
              apiProtectionToken: response.access_token,
            }),
          )
          yield put(getOAuth2Config({ access_token: response.access_token }))
        } else {
          devLogger.error('Failed to obtain API token for session creation')
          yield put(
            createAdminUiSessionResponse({ success: false, error: 'Failed to obtain API token' }),
          )
        }
      }
    }
  } catch (error) {
    const err = asApiError(error as Throwable)
    devLogger.error('Problems getting API Access Token.', err?.response?.data ?? err.message)
    yield put(
      setBackendStatus({
        active: false,
        errorMessage: err?.response?.data?.responseMessage ?? null,
        statusCode: err?.response?.status ?? null,
      }),
    )
    if (isFourZeroThreeError(err)) {
      yield* redirectToLogout()
      return
    }
  }
}

function* getLocationWorker(_action: { type: string }): Generator {
  try {
    const response = (yield call(getUserIpAndLocation)) as Awaited<
      ReturnType<typeof getUserIpAndLocation>
    >
    if (response && response !== -1) {
      yield put(getUserLocationResponse({ location: response as AppLocation }))
      return
    }
  } catch (error) {
    const err = asApiError(error as Throwable)
    devLogger.error('Problem getting user location.', err?.response?.data ?? err.message)
  }
}

function* createAdminUiSessionWorker({
  payload,
}: {
  type: string
  payload: { ujwt: string; apiProtectionToken: string }
}): Generator {
  try {
    const { ujwt, apiProtectionToken } = payload
    yield call(createAdminUiSessionApi, ujwt, apiProtectionToken)
    yield put(createAdminUiSessionResponse({ success: true }))
  } catch (error) {
    const err = asApiError(error as Throwable)
    const errorMessage =
      err?.response?.data?.message ?? err?.response?.data?.responseMessage ?? err?.message ?? ''
    devLogger.error('Problems creating Admin UI session.', err?.response?.data ?? err.message)
    if (isFourZeroThreeError(err)) {
      yield* redirectToLogout()
      return
    }
    yield put(createAdminUiSessionResponse({ success: false, error: errorMessage }))
  }
}

function* deleteAdminUiSessionWorker(_action: { type: string }): Generator {
  try {
    yield call(deleteAdminUiSessionApi)
  } catch (error) {
    const err = asApiError(error as Throwable)
    devLogger.error('Problems deleting Admin UI session.', err?.response?.data ?? err.message)
  } finally {
    setApiToken(null)
    yield put(deleteAdminUiSessionResponse())
  }
}

export function* getApiTokenWatcher(): Generator {
  yield takeEvery(getAPIAccessToken.type, getAPIAccessTokenWorker)
}

export function* getOAuth2ConfigWatcher(): Generator {
  yield takeEvery(getOAuth2Config.type, getOAuth2ConfigWorker)
}
export function* getLocationWatcher(): Generator {
  yield takeEvery(getUserLocation.type, getLocationWorker)
}
export function* putConfigWorkerWatcher(): Generator {
  yield takeEvery(putConfigWorkerAction.type, putConfigWorker)
}
export function* createAdminUiSessionWatcher(): Generator {
  yield takeLatest(createAdminUiSession.type, createAdminUiSessionWorker)
}
export function* deleteAdminUiSessionWatcher(): Generator {
  yield takeEvery(deleteAdminUiSession.type, deleteAdminUiSessionWorker)
}

export default function* rootSaga(): Generator {
  yield all([
    fork(getOAuth2ConfigWatcher),
    fork(getApiTokenWatcher),
    fork(getLocationWatcher),
    fork(putConfigWorkerWatcher),
    fork(createAdminUiSessionWatcher),
    fork(deleteAdminUiSessionWatcher),
  ])
}

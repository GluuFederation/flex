import { all, call, fork, put, select } from 'redux-saga/effects'
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
import type { ApiErrorLike } from './types/audit'
import { devLogger } from '@/utils/devLogger'

function* getApiTokenWithDefaultScopes(): Generator<unknown, string | null, unknown> {
  try {
    const response = (yield call(fetchApiTokenWithDefaultScopes)) as
      | { access_token?: string; scopes?: string[]; issuer?: string }
      | undefined
    if (response?.access_token) {
      return response.access_token
    }
    return null
  } catch (error: unknown) {
    const err = error as ApiErrorLike
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
  } catch (error: unknown) {
    const err = error as ApiErrorLike
    devLogger.error('Problems getting OAuth2 configuration.', err?.response?.data ?? error)
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
  payload: Record<string, unknown> & {
    _meta?: { cedarlingLogTypeChanged?: boolean; toastMessage?: string }
  }
}): Generator {
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
  } catch (error: unknown) {
    yield put(updateToast(true, 'error'))
    if (isFourZeroThreeError(error as ApiErrorLike)) {
      yield* redirectToLogout()
      return
    }
    return error
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
  } catch (error: unknown) {
    const err = error as ApiErrorLike
    devLogger.error('Problems getting API Access Token.', err?.response?.data ?? error)
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

function* getLocationWorker(_action: { type: string }): Generator<unknown, void, unknown> {
  try {
    const response = (yield call(getUserIpAndLocation)) as Awaited<
      ReturnType<typeof getUserIpAndLocation>
    >
    if (response && response !== -1) {
      yield put(getUserLocationResponse({ location: response }))
      return
    }
  } catch (error: unknown) {
    const err = error as ApiErrorLike
    devLogger.error('Problem getting user location.', err?.response?.data ?? error)
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
  } catch (error: unknown) {
    const err = error as ApiErrorLike
    const errorMessage =
      err?.response?.data?.message ?? err?.response?.data?.responseMessage ?? err?.message ?? ''
    devLogger.error('Problems creating Admin UI session.', err?.response?.data ?? error)
    if (isFourZeroThreeError(err)) {
      yield* redirectToLogout()
      return
    }
    yield put(createAdminUiSessionResponse({ success: false, error: errorMessage }))
  }
}

function* deleteAdminUiSessionWorker(_action: { type: string }) {
  try {
    yield call(deleteAdminUiSessionApi)
  } catch (error: unknown) {
    const err = error as ApiErrorLike
    devLogger.error('Problems deleting Admin UI session.', err?.response?.data ?? error)
  } finally {
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

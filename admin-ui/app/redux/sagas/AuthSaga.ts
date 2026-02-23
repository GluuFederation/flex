import { all, call, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects'
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
  deleteAdminUiSessionResponse,
} from 'Redux/features/authSlice'
import { isFourZeroThreeError } from 'Utils/TokenController'
import { redirectToLogout } from 'Redux/sagas/SagaUtils'
import { devLogger } from '@/utils/devLogger'

interface ApiErrorLike {
  response?: { data?: { responseMessage?: string; message?: string }; status?: number }
  message?: string
}

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

function* getOAuth2ConfigWorker({ payload }: { payload?: { access_token?: string } }): Generator {
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

function* getAPIAccessTokenWorker(jwt: { payload?: string }): Generator {
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

function* getLocationWorker(): Generator<unknown, void, unknown> {
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
  payload: { ujwt: string; apiProtectionToken: string }
}): Generator<unknown, void, unknown> {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yield* (redirectToLogout as any)()
      return
    }
    yield put(createAdminUiSessionResponse({ success: false, error: errorMessage }))
  }
}

function* deleteAdminUiSessionWorker() {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yield (takeEvery as any)('auth/getAPIAccessToken', getAPIAccessTokenWorker)
}

export function* getOAuth2ConfigWatcher(): Generator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yield (takeEvery as any)('auth/getOAuth2Config', getOAuth2ConfigWorker)
}
export function* getLocationWatcher(): Generator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yield (takeEvery as any)('auth/getUserLocation', getLocationWorker)
}
export function* putConfigWorkerWatcher(): Generator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yield (takeEvery as any)('auth/putConfigWorker', putConfigWorker)
}
export function* createAdminUiSessionWatcher(): Generator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yield (takeLatest as any)('auth/createAdminUiSession', createAdminUiSessionWorker)
}
export function* deleteAdminUiSessionWatcher(): Generator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yield (takeEvery as any)('auth/deleteAdminUiSession', deleteAdminUiSessionWorker)
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

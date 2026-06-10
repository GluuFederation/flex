import type { AppConfigResponse } from 'JansConfigApi'
import {
  getOAuth2Config,
  getOAuth2ConfigResponse,
  getAPIAccessToken,
  getAPIAccessTokenResponse,
  setBackendStatus,
  putConfigWorker,
  putConfigWorkerResponse,
  createAdminUiSession,
  createAdminUiSessionResponse,
} from '../features/authSlice'
import { auditLogoutLogs } from '../features/sessionSlice'
import { updateToast } from '../features/toastSlice'
import {
  fetchServerConfiguration,
  fetchApiTokenWithDefaultScopes,
  putServerConfiguration,
  createAdminUiSession as createAdminUiSessionApi,
  deleteAdminUiSession,
} from '../api/backend-api'
import { isFourZeroThreeError } from 'Utils/TokenController'
import { logger } from '@/utils/logger'
import { setApiToken } from 'Orval'
import { SESSION_EXPIRED } from '@/audit/messages'
import type { Config } from '../features/types/authTypes'
import type { PutConfigMeta } from '../features/types/authSliceTypes'
import type { ApiErrorLike } from '../types/audit'
import type { AppDispatch } from '../hooks'
import { startAppListening } from './index'

type Throwable = Error | ApiErrorLike | string | number | boolean | object | null | undefined
type ApiTokenResult = { access_token?: string; scopes?: string[]; issuer?: string }

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

const redirectToLogout = async (
  dispatch: AppDispatch,
  message = SESSION_EXPIRED,
): Promise<void> => {
  dispatch(auditLogoutLogs({ message }))
  try {
    const response = await fetchApiTokenWithDefaultScopes()
    await deleteAdminUiSession(response.access_token)
  } catch (e) {
    logger.error('Error during logout cleanup:', e instanceof Error ? e : String(e))
  } finally {
    window.location.href = '/admin/logout'
  }
}

const getApiTokenWithDefaultScopes = async (dispatch: AppDispatch): Promise<string | null> => {
  try {
    const response = (await fetchApiTokenWithDefaultScopes()) as ApiTokenResult
    if (response?.access_token) {
      return response.access_token
    }
    return null
  } catch (error) {
    const err = asApiError(error as Throwable)
    dispatch(
      setBackendStatus({
        active: false,
        errorMessage: err?.response?.data?.responseMessage ?? null,
        statusCode: err?.response?.status ?? null,
      }),
    )
    return null
  }
}

export const putConfigEffect = async (
  payload: Config & { _meta?: PutConfigMeta },
  dispatch: AppDispatch,
): Promise<void> => {
  try {
    const { _meta, ...configData } = payload
    const response = await putServerConfiguration({ props: configData as AppConfigResponse })
    if (response) {
      dispatch(getOAuth2ConfigResponse({ config: response as Config }))
      if (_meta?.toastMessage) {
        dispatch(updateToast(true, 'success', _meta.toastMessage))
      } else {
        dispatch(updateToast(true, 'success'))
      }
      return
    }
  } catch (error) {
    dispatch(updateToast(true, 'error'))
    if (isFourZeroThreeError(asApiError(error as Throwable))) {
      await redirectToLogout(dispatch)
      return
    }
    return
  } finally {
    dispatch(putConfigWorkerResponse())
  }
}

startAppListening({
  actionCreator: getOAuth2Config,
  effect: async (action, { dispatch, getState }) => {
    try {
      const hasSession = getState().authReducer.hasSession

      let token: string | null | undefined = null
      if (!hasSession) {
        token = action.payload?.access_token
        if (!token) {
          token = await getApiTokenWithDefaultScopes(dispatch)
        }
        if (!token) {
          dispatch(getOAuth2ConfigResponse({}))
          return
        }
      }

      const response = await fetchServerConfiguration(token ?? undefined)
      if (response?.postLogoutRedirectUri) {
        dispatch(getOAuth2ConfigResponse({ config: response as Config }))
        return
      }
    } catch (error) {
      const err = asApiError(error as Throwable)
      logger.error('Problems getting OAuth2 configuration.', err?.response?.data ?? err.message)
      if (isFourZeroThreeError(err)) {
        await redirectToLogout(dispatch)
        return
      }
    }
    dispatch(getOAuth2ConfigResponse({}))
  },
})

startAppListening({
  actionCreator: getAPIAccessToken,
  effect: async (action, { dispatch }) => {
    try {
      if (action.payload) {
        const response = (await fetchApiTokenWithDefaultScopes()) as ApiTokenResult
        if (response) {
          dispatch(
            getAPIAccessTokenResponse({
              scopes: response.scopes,
              issuer: response.issuer,
            }),
          )

          if (response.access_token) {
            setApiToken(response.access_token)
            dispatch(
              createAdminUiSession({
                ujwt: action.payload,
                apiProtectionToken: response.access_token,
              }),
            )
            dispatch(getOAuth2Config({ access_token: response.access_token }))
          } else {
            setApiToken(null)
            logger.error('Failed to obtain API token for session creation')
            dispatch(
              createAdminUiSessionResponse({ success: false, error: 'Failed to obtain API token' }),
            )
          }
        }
      }
    } catch (error) {
      setApiToken(null)
      const err = asApiError(error as Throwable)
      logger.error('Problems getting API Access Token.', err?.response?.data ?? err.message)
      dispatch(
        setBackendStatus({
          active: false,
          errorMessage: err?.response?.data?.responseMessage ?? null,
          statusCode: err?.response?.status ?? null,
        }),
      )
      if (isFourZeroThreeError(err)) {
        await redirectToLogout(dispatch)
        return
      }
    }
  },
})

startAppListening({
  actionCreator: putConfigWorker,
  effect: async (action, { dispatch }) => {
    await putConfigEffect(action.payload, dispatch)
  },
})

startAppListening({
  actionCreator: createAdminUiSession,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners()
    const { dispatch } = listenerApi
    try {
      const { ujwt, apiProtectionToken } = action.payload
      await createAdminUiSessionApi(ujwt, apiProtectionToken)
      dispatch(createAdminUiSessionResponse({ success: true }))
    } catch (error) {
      const err = asApiError(error as Throwable)
      const errorMessage =
        err?.response?.data?.message ?? err?.response?.data?.responseMessage ?? err?.message ?? ''
      logger.error('Problems creating Admin UI session.', err?.response?.data ?? err.message)
      if (isFourZeroThreeError(err)) {
        await redirectToLogout(dispatch)
        return
      }
      dispatch(createAdminUiSessionResponse({ success: false, error: errorMessage }))
    }
  },
})

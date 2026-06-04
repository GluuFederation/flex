import {
  isLicenseActive,
  retrieveLicense,
  activateAdminuiLicense,
  getTrialLicense,
  checkAdminuiLicenseConfig as checkAdminuiLicenseConfigApi,
  adminuiPostSsa,
  getStat,
} from 'JansConfigApi'
import type { GenericResponse, GetStatParams } from 'JansConfigApi'
import { setApiToken } from 'Orval'
import { getOAuth2Config, setApiDefaultToken, setBackendStatus } from '../features/authSlice'
import {
  checkLicenseConfigValidResponse,
  checkLicensePresentResponse,
  uploadNewSsaTokenResponse,
  generateTrialLicenseResponse,
  checkUserLicenseKeyResponse,
  retrieveLicenseKeyResponse,
  checkThresholdLimit,
  setValidatingFlow,
  setLicenseError,
  checkLicensePresent,
  checkLicenseConfigValid,
  uploadNewSsaToken,
  generateTrialLicense,
} from '../features/licenseSlice'
import type { SSARequestPayload } from 'Redux/api/types/LicenseApi'
import type { ApiTokenResponse } from '../api/types/BackendApi'
import { fetchApiTokenWithDefaultScopes } from '../api/backend-api'
import type { MauEntry } from '../types'
import { getYearMonth } from '../../utils/Util'
import { devLogger } from '@/utils/devLogger'
import type { ApiErrorLike } from '../types/audit'
import type { AppDispatch } from '../hooks'
import { startAppListening } from './index'

const getBackendStatusFromError = (error: Error | ApiErrorLike) => {
  const err = error as ApiErrorLike
  const statusCode = typeof err?.response?.status === 'number' ? err.response.status : null
  const errorMessage =
    err?.response?.data?.responseMessage ??
    err?.response?.data?.message ??
    (err instanceof Error ? err.message : error != null ? String(error) : 'Network error')
  return { active: false as const, errorMessage, statusCode }
}

const getLicenseErrorMessage = (error: Error | ApiErrorLike): string => {
  const asApiError = error as ApiErrorLike
  if (typeof asApiError?.response?.data?.responseMessage === 'string') {
    return asApiError.response!.data!.responseMessage!
  }
  return error instanceof Error ? error.message : String(error)
}

const getAccessToken = async (dispatch: AppDispatch): Promise<ApiTokenResponse> => {
  try {
    const token = (await fetchApiTokenWithDefaultScopes()) as ApiTokenResponse
    dispatch(setApiDefaultToken(token))
    dispatch(setBackendStatus({ active: true, errorMessage: null, statusCode: null }))
    return token
  } catch (error) {
    devLogger.error(
      'Failed to fetch API token with default scopes',
      error instanceof Error ? error : String(error),
    )
    dispatch(setBackendStatus(getBackendStatusFromError(error as Error | ApiErrorLike)))
    throw error
  }
}

const setupApiToken = async (dispatch: AppDispatch): Promise<ApiTokenResponse> => {
  const token = await getAccessToken(dispatch)
  setApiToken(token.access_token)
  return token
}

const checkMauThreshold = async (dispatch: AppDispatch, mau_threshold: number): Promise<void> => {
  await setupApiToken(dispatch)
  try {
    const data = (await getStat({
      month: getYearMonth(new Date()),
      format: 'json',
    } as GetStatParams)) as MauEntry[] | undefined
    const limit = (mau_threshold * 15) / 100 + mau_threshold
    const firstMau = data?.[0]?.monthly_active_users
    if (limit > (firstMau ?? 0) || !data?.length) {
      dispatch(checkLicensePresentResponse({ isLicenseValid: true }))
      dispatch(checkThresholdLimit({ isUnderThresholdLimit: true }))
    } else {
      dispatch(checkThresholdLimit({ isUnderThresholdLimit: false }))
      dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
    }
  } catch (err) {
    devLogger.log(err instanceof Error ? err : String(err))
    dispatch(setLicenseError(getLicenseErrorMessage(err as Error | ApiErrorLike)))
    dispatch(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
    dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
  } finally {
    dispatch(setValidatingFlow({ isValidatingFlow: false }))
  }
}

const retrieveLicenseKey = async (dispatch: AppDispatch): Promise<void> => {
  try {
    await setupApiToken(dispatch)
    const response = (await retrieveLicense()) as GenericResponse | null
    const responseObj = response?.responseObject
    const licenseKey =
      typeof responseObj === 'object' && responseObj !== null && !Array.isArray(responseObj)
        ? responseObj['licenseKey']
        : undefined

    if (licenseKey) {
      try {
        const activateLicense = (await activateAdminuiLicense({
          licenseKey: String(licenseKey),
        })) as GenericResponse | null

        dispatch(generateTrialLicenseResponse(activateLicense))
        dispatch(setValidatingFlow({ isValidatingFlow: true }))

        const arr =
          activateLicense?.responseObject && Array.isArray(activateLicense.responseObject)
            ? (activateLicense.responseObject as Array<{ name?: string; value?: string }>)
            : []
        const mauThreshold = arr.find((item) => item?.name === 'mau_threshold')
        await checkMauThreshold(dispatch, parseInt(mauThreshold?.value ?? '', 10))
      } catch (err) {
        dispatch(setLicenseError(getLicenseErrorMessage(err as Error | ApiErrorLike)))
        dispatch(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
        dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
        dispatch(generateTrialLicenseResponse(null))
      }
    } else {
      dispatch(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
      dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
      dispatch(generateTrialLicenseResponse(null))
    }
  } catch (err) {
    dispatch(setLicenseError(getLicenseErrorMessage(err as Error | ApiErrorLike)))
    devLogger.log('Error in generating key.', err instanceof Error ? err : String(err))
    dispatch(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
    dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
    dispatch(generateTrialLicenseResponse(null))
  }
}

const generateTrialLicenseKey = async (dispatch: AppDispatch): Promise<void> => {
  try {
    await setupApiToken(dispatch)
    const response = (await getTrialLicense()) as GenericResponse | null

    const responseObj = response?.responseObject
    const licenseKeyVal =
      typeof responseObj === 'object' && responseObj !== null && !Array.isArray(responseObj)
        ? responseObj['license-key']
        : undefined

    if (licenseKeyVal) {
      try {
        const activateLicense = (await activateAdminuiLicense({
          licenseKey: String(licenseKeyVal),
        })) as GenericResponse | null
        dispatch(generateTrialLicenseResponse(activateLicense))
        dispatch(
          checkLicensePresentResponse({
            isLicenseValid: activateLicense?.success ?? false,
          }),
        )
        dispatch(checkUserLicenseKeyResponse(activateLicense))
      } catch (err) {
        dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
        dispatch(generateTrialLicenseResponse(null))
        dispatch(setLicenseError(getLicenseErrorMessage(err as Error | ApiErrorLike)))
      }
    }
  } catch (err) {
    dispatch(setLicenseError(getLicenseErrorMessage(err as Error | ApiErrorLike)))
    devLogger.log('Error in generating key.', err instanceof Error ? err : String(err))
    dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
    dispatch(generateTrialLicenseResponse(null))
  }
}

const uploadNewSsaTokenWorker = async (
  dispatch: AppDispatch,
  payload: SSARequestPayload,
): Promise<void> => {
  try {
    const token = await setupApiToken(dispatch)
    const response = (await adminuiPostSsa(payload.payload)) as GenericResponse | null
    if (!response?.success) {
      dispatch(
        uploadNewSsaTokenResponse(
          "Invalid SSA. Please contact Gluu's team to verify if SSA is correct.",
        ),
      )
    }
    dispatch(checkLicenseConfigValidResponse(response?.success ?? false))
    dispatch(getOAuth2Config(token))
  } catch (err) {
    dispatch(checkLicenseConfigValidResponse(false))
    devLogger.log(err instanceof Error ? err : String(err))
    dispatch(uploadNewSsaTokenResponse(getLicenseErrorMessage(err as Error | ApiErrorLike)))
  }
}

const checkAdminuiLicenseConfigWorker = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const token = await setupApiToken(dispatch)
    dispatch(getOAuth2Config(token))
    const response = (await checkAdminuiLicenseConfigApi()) as GenericResponse | null
    dispatch(checkLicenseConfigValidResponse(response?.success ?? false))
  } catch (error) {
    devLogger.log(error instanceof Error ? error : String(error))
    dispatch(checkLicenseConfigValidResponse(false))
  }
}

const checkLicensePresentWorker = async (dispatch: AppDispatch): Promise<void> => {
  try {
    await setupApiToken(dispatch)
    const response = (await isLicenseActive()) as GenericResponse | null
    if (!response?.success) {
      await retrieveLicenseKey(dispatch)
    } else {
      const arr = Array.isArray(response.responseObject)
        ? (response.responseObject as Array<{ name?: string; value?: string }>)
        : []
      const mauThreshold = arr.find((item) => item?.name === 'mau_threshold')
      await checkMauThreshold(dispatch, parseInt(mauThreshold?.value ?? '', 10))
    }
  } catch (error) {
    devLogger.log(
      'Error in checking License present.',
      error instanceof Error ? error : String(error),
    )
    await retrieveLicenseKey(dispatch)
  }
}

startAppListening({
  actionCreator: checkLicensePresent,
  effect: async (_action, { dispatch }) => {
    await checkLicensePresentWorker(dispatch)
  },
})

startAppListening({
  actionCreator: checkLicenseConfigValid,
  effect: async (_action, { dispatch }) => {
    await checkAdminuiLicenseConfigWorker(dispatch)
  },
})

startAppListening({
  actionCreator: uploadNewSsaToken,
  effect: async (action, { dispatch }) => {
    await uploadNewSsaTokenWorker(dispatch, action.payload as SSARequestPayload)
  },
})

startAppListening({
  actionCreator: generateTrialLicense,
  effect: async (_action, { dispatch }) => {
    await generateTrialLicenseKey(dispatch)
  },
})

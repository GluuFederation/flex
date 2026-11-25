import {
  isLicenseActive,
  retrieveLicense,
  getTrialLicense,
  checkAdminuiLicenseConfig as checkAdminuiLicenseConfigApi,
  adminuiPostSsa,
  getStat,
} from 'JansConfigApi'
import type { GenericResponse, GetStatParams } from 'JansConfigApi'
import { getOAuth2Config } from '../features/authSlice'
import { handleSessionExpired } from '../features/initSlice'
import {
  checkLicenseConfigValidResponse,
  checkLicensePresentResponse,
  uploadNewSsaTokenResponse,
  generateTrialLicenseResponse,
  checkUserLicenseKeyResponse,
  retrieveLicenseKeyResponse,
  checkThresholdLimit,
  setMauCheckFailed,
  setLicenseUnusable,
  setValidatingFlow,
  setLicenseError,
  checkLicensePresent,
  checkLicenseConfigValid,
  uploadNewSsaToken,
  generateTrialLicense,
} from '../features/licenseSlice'
import type { SSARequestPayload } from 'Redux/api/types/LicenseApi'
import { ensureApiToken } from '../api/apiToken'
import type { MauEntry } from '../types'
import { getYearMonth } from '../../utils/Util'
import { logger } from '@/utils/logger'
import { resolveApiErrorMessage } from '@/utils/apiErrorMessage'
import type { ApiErrorLike } from '../types/audit'
import type { AppDispatch } from '../hooks'
import { startAppListening } from './index'

// An expired session fails these calls with an auth status. That is a sign-in problem, not a
// broken SSA config, so it must not fall through to the branch that renders the SSA upload screen.
const AUTH_FAILURE_STATUSES: readonly number[] = [401, 403]

const isAuthFailure = (error: Error | ApiErrorLike): boolean => {
  const status = (error as ApiErrorLike)?.response?.status
  return typeof status === 'number' && AUTH_FAILURE_STATUSES.includes(status)
}

const getLicenseErrorMessage = (error: Error | ApiErrorLike): string => {
  const asApiError = error as ApiErrorLike
  if (typeof asApiError?.response?.data?.responseMessage === 'string') {
    return asApiError.response!.data!.responseMessage!
  }
  if (typeof asApiError?.response?.data?.message === 'string') {
    return asApiError.response!.data!.message!
  }
  return error instanceof Error ? error.message : String(error)
}

const getMauThreshold = (response: GenericResponse): number | null => {
  const data = response.responseObject
  const value = Array.isArray(data)
    ? (data as Array<{ name?: string; value?: string }>).find(
        (item) => item?.name === 'mau_threshold',
      )?.value
    : data?.mauThreshold
  const threshold = parseInt(String(value ?? ''), 10)
  return Number.isFinite(threshold) ? threshold : null
}

const isLicenseUnusable = (response: GenericResponse): boolean => {
  const data = response.responseObject
  return !Array.isArray(data) && data?.isLicenseUsable === false
}

const resolveActivatedMauThreshold = async (
  response: GenericResponse,
): Promise<{ mauThreshold: number | null; isUnusable: boolean }> => {
  if (isLicenseUnusable(response)) {
    return { mauThreshold: null, isUnusable: true }
  }
  const threshold = getMauThreshold(response)
  if (threshold !== null) {
    return { mauThreshold: threshold, isUnusable: false }
  }
  const activeLicense = (await isLicenseActive()) as GenericResponse | null
  if (!activeLicense?.success) {
    return { mauThreshold: null, isUnusable: false }
  }
  return {
    mauThreshold: getMauThreshold(activeLicense),
    isUnusable: isLicenseUnusable(activeLicense),
  }
}

const showNoValidLicense = (dispatch: AppDispatch): void => {
  dispatch(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
  dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
  dispatch(generateTrialLicenseResponse(null))
}

const blockUnusableLicense = (dispatch: AppDispatch): void => {
  logger.error('The license is not usable, so sign-in is blocked.')
  dispatch(setLicenseUnusable(true))
  dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
}

const checkMauThreshold = async (
  dispatch: AppDispatch,
  mau_threshold: number,
): Promise<boolean> => {
  await ensureApiToken(dispatch)
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
      return true
    }
    dispatch(checkThresholdLimit({ isUnderThresholdLimit: false }))
    dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
    return false
  } catch (err) {
    logger.error('Error checking MAU threshold:', resolveApiErrorMessage(err as Error))
    dispatch(setLicenseError(getLicenseErrorMessage(err as Error | ApiErrorLike)))
    dispatch(setMauCheckFailed(true))
    dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
    return false
  } finally {
    dispatch(setValidatingFlow({ isValidatingFlow: false }))
  }
}

const retrieveAndActivateLicense = async (dispatch: AppDispatch): Promise<void> => {
  try {
    await ensureApiToken(dispatch)
    const response = (await retrieveLicense()) as GenericResponse | null
    if (!response?.success) {
      showNoValidLicense(dispatch)
      return
    }
    const { mauThreshold, isUnusable } = await resolveActivatedMauThreshold(response)
    if (isUnusable) {
      blockUnusableLicense(dispatch)
      return
    }
    if (mauThreshold === null) {
      logger.error('Could not confirm an active license with a valid mau_threshold.')
      showNoValidLicense(dispatch)
      return
    }
    dispatch(generateTrialLicenseResponse(response))
    dispatch(setValidatingFlow({ isValidatingFlow: true }))
    await checkMauThreshold(dispatch, mauThreshold)
  } catch (err) {
    dispatch(setLicenseError(getLicenseErrorMessage(err as Error | ApiErrorLike)))
    logger.error('Error in retrieving license.', err instanceof Error ? err : String(err))
    showNoValidLicense(dispatch)
  }
}

const startTrialLicense = async (dispatch: AppDispatch): Promise<void> => {
  try {
    await ensureApiToken(dispatch)
    const response = (await getTrialLicense()) as GenericResponse | null
    dispatch(generateTrialLicenseResponse(response))
    if (!response?.success) {
      dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
      if (response) {
        dispatch(checkUserLicenseKeyResponse(response))
      }
      return
    }
    const { mauThreshold, isUnusable } = await resolveActivatedMauThreshold(response)
    if (isUnusable) {
      blockUnusableLicense(dispatch)
      return
    }
    if (mauThreshold === null) {
      logger.error('Could not confirm the trial license with a valid mau_threshold.')
      showNoValidLicense(dispatch)
      return
    }
    if (await checkMauThreshold(dispatch, mauThreshold)) {
      dispatch(checkUserLicenseKeyResponse(response))
    }
  } catch (err) {
    dispatch(setLicenseError(getLicenseErrorMessage(err as Error | ApiErrorLike)))
    logger.error('Error in starting trial license.', err instanceof Error ? err : String(err))
    dispatch(checkLicensePresentResponse({ isLicenseValid: false }))
    dispatch(generateTrialLicenseResponse(null))
  }
}

const uploadNewSsaTokenWorker = async (
  dispatch: AppDispatch,
  payload: SSARequestPayload,
): Promise<void> => {
  try {
    const token = await ensureApiToken(dispatch)
    const response = (await adminuiPostSsa(payload.payload)) as GenericResponse | null
    if (!response?.success) {
      dispatch(
        uploadNewSsaTokenResponse(
          "Invalid SSA. Please contact Gluu's team to verify if SSA is correct.",
        ),
      )
    }
    dispatch(checkLicenseConfigValidResponse(response?.success ?? false))
    dispatch(getOAuth2Config(token ?? undefined))
  } catch (err) {
    dispatch(checkLicenseConfigValidResponse(false))
    logger.error('Error uploading SSA token:', err instanceof Error ? err : String(err))
    dispatch(uploadNewSsaTokenResponse(getLicenseErrorMessage(err as Error | ApiErrorLike)))
  }
}

const checkAdminuiLicenseConfigWorker = async (dispatch: AppDispatch): Promise<void> => {
  try {
    const token = await ensureApiToken(dispatch)
    dispatch(getOAuth2Config(token ?? undefined))
    const response = (await checkAdminuiLicenseConfigApi()) as GenericResponse | null
    dispatch(checkLicenseConfigValidResponse(response?.success ?? false))
  } catch (error) {
    logger.error('Error checking license config:', error instanceof Error ? error : String(error))
    if (isAuthFailure(error as Error | ApiErrorLike)) {
      dispatch(handleSessionExpired({ isSessionExpired: true }))
      return
    }
    dispatch(checkLicenseConfigValidResponse(false))
  }
}

const checkLicensePresentWorker = async (dispatch: AppDispatch): Promise<void> => {
  try {
    await ensureApiToken(dispatch)
    const response = (await isLicenseActive()) as GenericResponse | null
    if (!response?.success) {
      await retrieveAndActivateLicense(dispatch)
      return
    }
    if (isLicenseUnusable(response)) {
      blockUnusableLicense(dispatch)
      return
    }
    const mauThreshold = getMauThreshold(response)
    if (mauThreshold === null) {
      logger.error('Active license response has no valid mau_threshold.')
      showNoValidLicense(dispatch)
      return
    }
    await checkMauThreshold(dispatch, mauThreshold)
  } catch (error) {
    logger.error(
      'Error in checking License present.',
      error instanceof Error ? error : String(error),
    )
    await retrieveAndActivateLicense(dispatch)
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
    await startTrialLicense(dispatch)
  },
})

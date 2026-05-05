import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  checkLicenseConfigValidResponse,
  checkLicensePresentResponse,
  getOAuth2Config,
  uploadNewSsaTokenResponse,
  generateTrialLicenseResponse,
  checkUserLicenseKeyResponse,
  retrieveLicenseKeyResponse,
  checkThresholdLimit,
  setValidatingFlow,
  setApiDefaultToken,
  setLicenseError,
  setBackendStatus,
  checkLicensePresent,
  checkUserLicenceKey,
  checkLicenseConfigValid,
  uploadNewSsaToken as uploadNewSsaTokenAction,
  generateTrialLicense,
  retrieveLicenseKey as retrieveLicenseKeyAction,
} from '../actions'
import type { LicenseRequestPayload, SSARequestPayload } from 'Redux/api/types/LicenseApi'
import type { ApiTokenResponse } from 'Redux/api/types/BackendApi'
import { fetchApiTokenWithDefaultScopes } from 'Redux/api/backend-api'
import type { MauEntry } from 'Redux/types'
import { getYearMonth } from '../../utils/Util'
import { devLogger } from '@/utils/devLogger'
import type { ApiErrorLike, SagaError } from './types'
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
import { setApiToken } from '../../../orval-mutator'

let defaultToken: ApiTokenResponse | undefined

const getBackendStatusFromError = (error: Error | ApiErrorLike) => {
  const err = error as ApiErrorLike
  const statusCode = typeof err?.response?.status === 'number' ? err.response.status : null
  const errorMessage =
    err?.response?.data?.responseMessage ??
    err?.response?.data?.message ??
    (err instanceof Error ? err.message : error != null ? String(error) : 'Network error')
  return { active: false as const, errorMessage, statusCode }
}

export function* getAccessToken() {
  if (!defaultToken) {
    try {
      defaultToken = (yield call(fetchApiTokenWithDefaultScopes)) as ApiTokenResponse
      yield put(setApiDefaultToken(defaultToken))
      yield put(setBackendStatus({ active: true, errorMessage: null, statusCode: null }))
    } catch (error) {
      devLogger.error(
        'Failed to fetch API token with default scopes',
        error instanceof Error ? error : String(error),
      )
      yield put(setBackendStatus(getBackendStatusFromError(error as Error | ApiErrorLike)))
      throw error
    }
  }
  return defaultToken
}

function* setupApiToken() {
  const token = (yield call(getAccessToken)) as ApiTokenResponse
  setApiToken(token.access_token)
}

function* checkLicensePresentWorker(_action?: { type: string }) {
  try {
    yield* setupApiToken()
    const response = (yield call(isLicenseActive)) as GenericResponse | null
    if (!response?.success) {
      yield* retrieveLicenseKey()
    } else {
      const arr = Array.isArray(response.responseObject)
        ? (response.responseObject as Array<{ name?: string; value?: string }>)
        : []
      const mauThreshold = arr.find((item) => item?.name === 'mau_threshold')
      yield* checkMauThreshold(parseInt(mauThreshold?.value ?? '', 10))
    }
  } catch (error) {
    devLogger.log(
      'Error in checking License present.',
      error instanceof Error ? error : String(error),
    )
    yield* retrieveLicenseKey()
  }
}

const getLicenseErrorMessage = (error: Error | SagaError | ApiErrorLike): string => {
  const asApiError = error as ApiErrorLike
  if (typeof asApiError?.response?.data?.responseMessage === 'string') {
    return asApiError.response!.data!.responseMessage!
  }
  return error instanceof Error ? error.message : String(error)
}

function* retrieveLicenseKey(_action?: { type: string }) {
  try {
    yield* setupApiToken()
    const response = (yield call(retrieveLicense)) as GenericResponse | null
    const responseObj = response?.responseObject
    const licenseKey =
      typeof responseObj === 'object' && responseObj !== null && !Array.isArray(responseObj)
        ? responseObj['licenseKey']
        : undefined

    if (licenseKey) {
      try {
        const activateLicense = (yield call(activateAdminuiLicense, {
          licenseKey: String(licenseKey),
        })) as GenericResponse | null

        yield put(generateTrialLicenseResponse(activateLicense))
        yield put(setValidatingFlow({ isValidatingFlow: true }))

        const arr =
          activateLicense?.responseObject && Array.isArray(activateLicense.responseObject)
            ? (activateLicense.responseObject as Array<{ name?: string; value?: string }>)
            : []
        const mauThreshold = arr.find((item) => item?.name === 'mau_threshold')
        yield* checkMauThreshold(parseInt(mauThreshold?.value ?? '', 10))
      } catch (err) {
        yield put(setLicenseError(getLicenseErrorMessage(err as Error | SagaError)))
        yield put(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
        yield put(checkLicensePresentResponse({ isLicenseValid: false }))
        yield put(generateTrialLicenseResponse(null))
      }
    } else {
      yield put(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
      yield put(checkLicensePresentResponse({ isLicenseValid: false }))
      yield put(generateTrialLicenseResponse(null))
    }
  } catch (err) {
    yield put(setLicenseError(getLicenseErrorMessage(err as Error | SagaError)))
    devLogger.log('Error in generating key.', err instanceof Error ? err : String(err))
    yield put(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
    yield put(checkLicensePresentResponse({ isLicenseValid: false }))
    yield put(generateTrialLicenseResponse(null))
  }
}

function* checkMauThreshold(mau_threshold: number) {
  yield* setupApiToken()
  try {
    const data = (yield call(getStat, {
      month: getYearMonth(new Date()),
      format: 'json',
    } as GetStatParams)) as MauEntry[] | undefined
    const limit = (mau_threshold * 15) / 100 + mau_threshold
    const firstMau = data?.[0]?.monthly_active_users
    if (limit > (firstMau ?? 0) || !data?.length) {
      yield put(checkLicensePresentResponse({ isLicenseValid: true }))
      yield put(checkThresholdLimit({ isUnderThresholdLimit: true }))
    } else {
      yield put(checkThresholdLimit({ isUnderThresholdLimit: false }))
      yield put(checkLicensePresentResponse({ isLicenseValid: false }))
    }
  } catch (err) {
    devLogger.log(err instanceof Error ? err : String(err))
    yield put(setLicenseError(getLicenseErrorMessage(err as Error | SagaError)))
    yield put(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
    yield put(checkLicensePresentResponse({ isLicenseValid: false }))
  } finally {
    yield put(setValidatingFlow({ isValidatingFlow: false }))
  }
}

function* generateTrailLicenseKey(_action?: { type: string }): SagaIterator {
  try {
    yield* setupApiToken()
    const response = (yield call(getTrialLicense)) as GenericResponse | null

    const responseObj = response?.responseObject
    const licenseKeyVal =
      typeof responseObj === 'object' && responseObj !== null && !Array.isArray(responseObj)
        ? responseObj['license-key']
        : undefined

    if (licenseKeyVal) {
      try {
        const activateLicense = (yield call(activateAdminuiLicense, {
          licenseKey: String(licenseKeyVal),
        })) as GenericResponse | null
        yield put(generateTrialLicenseResponse(activateLicense))
        yield put(
          checkLicensePresentResponse({
            isLicenseValid: activateLicense?.success ?? false,
          }),
        )
        yield put(checkUserLicenseKeyResponse(activateLicense))
      } catch (err) {
        yield put(checkLicensePresentResponse({ isLicenseValid: false }))
        yield put(generateTrialLicenseResponse(null))
        yield put(setLicenseError(getLicenseErrorMessage(err as Error | SagaError)))
      }
    }
  } catch (err) {
    yield put(setLicenseError(getLicenseErrorMessage(err as Error | SagaError)))
    devLogger.log('Error in generating key.', err instanceof Error ? err : String(err))
    yield put(checkLicensePresentResponse({ isLicenseValid: false }))
    yield put(generateTrialLicenseResponse(null))
  }
}

function* activateCheckUserLicenseKey(action: { payload: LicenseRequestPayload }): SagaIterator {
  const { payload } = action
  try {
    yield* setupApiToken()
    const response = (yield call(activateAdminuiLicense, payload.payload)) as GenericResponse | null
    yield put(checkUserLicenseKeyResponse(response))
  } catch (err) {
    devLogger.log(err instanceof Error ? err : String(err))
  }
}

function* uploadNewSsaToken(action: { type: string; payload: SSARequestPayload }) {
  const { payload } = action
  try {
    yield* setupApiToken()
    const response = (yield call(adminuiPostSsa, payload.payload)) as GenericResponse | null
    if (!response?.success) {
      yield put(
        uploadNewSsaTokenResponse(
          "Invalid SSA. Please contact Gluu's team to verify if SSA is correct.",
        ),
      )
    }
    yield put(checkLicenseConfigValidResponse(response?.success ?? false))
    yield put(getOAuth2Config(defaultToken))
  } catch (err) {
    yield put(checkLicenseConfigValidResponse(false))
    devLogger.log(err instanceof Error ? err : String(err))
    yield put(uploadNewSsaTokenResponse(getLicenseErrorMessage(err as Error | SagaError)))
  }
}

function* checkAdminuiLicenseConfigWorker(_action?: { type: string }) {
  try {
    yield* setupApiToken()
    yield put(getOAuth2Config(defaultToken))
    const response = (yield call(checkAdminuiLicenseConfigApi)) as GenericResponse | null
    yield put(checkLicenseConfigValidResponse(response?.success ?? false))
  } catch (error) {
    devLogger.log(error instanceof Error ? error : String(error))
    yield put(checkLicenseConfigValidResponse(false))
  }
}

export function* checkLicensePresentWatcher(): SagaIterator {
  yield takeEvery(checkLicensePresent, checkLicensePresentWorker)
  yield takeEvery(checkUserLicenceKey, activateCheckUserLicenseKey)
  yield takeEvery(checkLicenseConfigValid, checkAdminuiLicenseConfigWorker)
  yield takeEvery(uploadNewSsaTokenAction, uploadNewSsaToken)
  yield takeEvery(generateTrialLicense, generateTrailLicenseKey)
  yield takeEvery(retrieveLicenseKeyAction, retrieveLicenseKey)
}

export default function* rootSaga() {
  yield all([fork(checkLicensePresentWatcher)])
}

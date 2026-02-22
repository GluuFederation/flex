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
  checkLicensePresent,
  checkUserLicenceKey,
  checkLicenseConfigValid,
  uploadNewSsaToken as uploadNewSsaTokenAction,
  generateTrialLicense,
  retrieveLicenseKey as retrieveLicenseKeyAction,
} from '../actions'
import LicenseApi from 'Redux/api/LicenseApi'
import type {
  LicenseApiGenericResponse,
  LicenseRequestPayload,
  SSARequestPayload,
} from 'Redux/api/types/LicenseApi'
import { getClientWithToken, getClient } from 'Redux/api/base'
import type { ApiTokenResponse } from 'Redux/api/types/BackendApi'
import { fetchApiTokenWithDefaultScopes } from 'Redux/api/backend-api'
import MauApi from 'Redux/api/MauApi'
import { getYearMonth } from '../../utils/Util'
import { devLogger } from '@/utils/devLogger'
import * as JansConfigApi from 'jans_config_api'
import type { SagaError } from './types/audit'

let defaultToken: ApiTokenResponse | undefined

export function* getAccessToken() {
  if (!defaultToken) {
    try {
      defaultToken = (yield call(fetchApiTokenWithDefaultScopes)) as ApiTokenResponse
      yield put(setApiDefaultToken(defaultToken))
    } catch (error) {
      devLogger.error('Failed to fetch API token with default scopes', error)
      throw error
    }
  }
  return defaultToken
}

function* getApiTokenWithDefaultScopes() {
  const token = (yield call(getAccessToken)) as ApiTokenResponse
  const api = new JansConfigApi.AdminUILicenseApi(
    getClientWithToken(JansConfigApi, token.access_token),
  )
  return new LicenseApi(api)
}

function* newFunction() {
  const tokenResponse = (yield call(getAccessToken)) as ApiTokenResponse & { issuer?: string }
  const access_token = tokenResponse.access_token
  const issuer = tokenResponse.issuer ?? null
  const api = new JansConfigApi.StatisticsUserApi(getClient(JansConfigApi, access_token, issuer))
  return new MauApi(api)
}

function* checkLicensePresentWorker(_action?: { type: string }) {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = (yield call(licenseApi.getIsActive)) as LicenseApiGenericResponse | null
    if (!response?.success) {
      yield* retrieveLicenseKey()
    } else {
      const arr = Array.isArray(response.responseObject) ? response.responseObject : []
      const mauThreshold = arr.find((item) => item?.name === 'mau_threshold')
      yield* checkMauThreshold(parseInt(mauThreshold?.value ?? '', 10))
    }
  } catch (error) {
    devLogger.log('Error in checking License present.', error)
    yield* retrieveLicenseKey()
  }
}

function getLicenseErrorMessage(error: Error | SagaError): string {
  if (typeof (error as SagaError).response?.body?.responseMessage === 'string') {
    return (error as SagaError).response!.body!.responseMessage!
  }
  return error instanceof Error ? error.message : String(error)
}

function* retrieveLicenseKey(_action?: { type: string }) {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = (yield call(licenseApi.retrieveLicense)) as LicenseApiGenericResponse | null
    const responseObj = response?.responseObject
    const licenseKey =
      typeof responseObj === 'object' && responseObj !== null && !Array.isArray(responseObj)
        ? responseObj['licenseKey']
        : undefined

    if (licenseKey) {
      try {
        const activateLicense = (yield call(licenseApi.submitLicenseKey, {
          payload: { licenseKey },
        })) as LicenseApiGenericResponse | null

        yield put(generateTrialLicenseResponse(activateLicense))
        yield put(setValidatingFlow({ isValidatingFlow: true }))

        const arr =
          activateLicense?.responseObject && Array.isArray(activateLicense.responseObject)
            ? activateLicense.responseObject
            : []
        const mauThreshold = arr.find((item) => item?.name === 'mau_threshold')
        yield* checkMauThreshold(parseInt(mauThreshold?.value ?? '', 10))
      } catch (err) {
        yield put(setLicenseError(getLicenseErrorMessage(err as Error | SagaError)))
        yield put(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
        yield put(checkLicensePresentResponse({ isLicenseValid: false }))
        yield put(generateTrialLicenseResponse(null))
      }
    }
  } catch (err) {
    yield put(setLicenseError(getLicenseErrorMessage(err as Error | SagaError)))
    devLogger.log('Error in generating key.', err)
    yield put(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
    yield put(checkLicensePresentResponse({ isLicenseValid: false }))
    yield put(generateTrialLicenseResponse(null))
  }
}

function* checkMauThreshold(mau_threshold: number) {
  const mauApi = yield* newFunction()
  try {
    const data = (yield call(mauApi.getMau, { month: getYearMonth(new Date()) })) as
      | Array<{ monthly_active_users?: number }>
      | undefined
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
    devLogger.log(err)
    yield put(setLicenseError(getLicenseErrorMessage(err as Error | SagaError)))
    yield put(retrieveLicenseKeyResponse({ isNoValidLicenseKeyFound: true }))
    yield put(checkLicensePresentResponse({ isLicenseValid: false }))
  } finally {
    yield put(setValidatingFlow({ isValidatingFlow: false }))
  }
}

function* generateTrailLicenseKey(_action?: { type: string }): SagaIterator {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = (yield call(licenseApi.getTrialLicense)) as LicenseApiGenericResponse | null

    const responseObj = response?.responseObject
    const licenseKeyVal =
      typeof responseObj === 'object' && responseObj !== null && !Array.isArray(responseObj)
        ? responseObj['license-key']
        : undefined

    if (licenseKeyVal) {
      try {
        const activateLicense = (yield call(licenseApi.submitLicenseKey, {
          payload: { licenseKey: licenseKeyVal },
        })) as LicenseApiGenericResponse | null
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
    devLogger.log('Error in generating key.', err)
    yield put(checkLicensePresentResponse({ isLicenseValid: false }))
    yield put(generateTrialLicenseResponse(null))
  }
}

function* activateCheckUserLicenseKey(action: { payload: LicenseRequestPayload }): SagaIterator {
  const { payload } = action
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = (yield call(
      licenseApi.submitLicenseKey,
      payload,
    )) as LicenseApiGenericResponse | null
    yield put(checkUserLicenseKeyResponse(response))
  } catch (err) {
    devLogger.log(err)
  }
}

function* uploadNewSsaToken(action: { type: string; payload: SSARequestPayload }) {
  const { payload } = action
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    const response = (yield call(
      licenseApi.uploadSSAtoken,
      payload,
    )) as LicenseApiGenericResponse | null
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
    devLogger.log(err)
    yield put(uploadNewSsaTokenResponse(getLicenseErrorMessage(err as Error | SagaError)))
  }
}

function* checkAdminuiLicenseConfig(_action?: { type: string }) {
  try {
    const licenseApi = yield* getApiTokenWithDefaultScopes()
    yield put(getOAuth2Config(defaultToken))
    const response = (yield call(
      licenseApi.checkAdminuiLicenseConfig,
    )) as LicenseApiGenericResponse | null
    yield put(checkLicenseConfigValidResponse(response?.success ?? false))
  } catch (error) {
    devLogger.log(error)
    yield put(checkLicenseConfigValidResponse(false))
  }
}

export function* checkLicensePresentWatcher(): SagaIterator {
  yield takeEvery(checkLicensePresent, checkLicensePresentWorker)
  yield takeEvery(checkUserLicenceKey, activateCheckUserLicenseKey)
  yield takeEvery(checkLicenseConfigValid, checkAdminuiLicenseConfig)
  yield takeEvery(uploadNewSsaTokenAction, uploadNewSsaToken)
  yield takeEvery(generateTrialLicense, generateTrailLicenseKey)
  yield takeEvery(retrieveLicenseKeyAction, retrieveLicenseKey)
}

/**
 * License Root Saga
 */
export default function* rootSaga() {
  yield all([fork(checkLicensePresentWatcher)])
}

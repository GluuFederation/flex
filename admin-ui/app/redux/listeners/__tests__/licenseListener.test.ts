import { configureStore } from '@reduxjs/toolkit'
import { listenerMiddleware } from '../index'
import licenseReducer, {
  checkLicensePresent,
  checkLicenseConfigValid,
  uploadNewSsaToken,
  generateTrialLicense,
} from '../../features/licenseSlice'
import authReducer from '../../features/authSlice'
import {
  isLicenseActive,
  retrieveLicense,
  activateAdminuiLicense,
  getTrialLicense,
  checkAdminuiLicenseConfig,
  adminuiPostSsa,
  getStat,
} from 'JansConfigApi'
import { fetchApiTokenWithDefaultScopes } from '../../api/backend-api'

jest.mock('JansConfigApi')
jest.mock('Orval', () => ({ setApiToken: jest.fn() }))
jest.mock('../../api/backend-api')

import '../licenseListener'

const mockedFetchToken = fetchApiTokenWithDefaultScopes as jest.MockedFunction<
  typeof fetchApiTokenWithDefaultScopes
>
const mockedIsLicenseActive = isLicenseActive as jest.MockedFunction<typeof isLicenseActive>
const mockedRetrieveLicense = retrieveLicense as jest.MockedFunction<typeof retrieveLicense>
const mockedActivateLicense = activateAdminuiLicense as jest.MockedFunction<
  typeof activateAdminuiLicense
>
const mockedGetTrialLicense = getTrialLicense as jest.MockedFunction<typeof getTrialLicense>
const mockedCheckConfig = checkAdminuiLicenseConfig as jest.MockedFunction<
  typeof checkAdminuiLicenseConfig
>
const mockedPostSsa = adminuiPostSsa as jest.MockedFunction<typeof adminuiPostSsa>
const mockedGetStat = getStat as jest.MockedFunction<typeof getStat>

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const buildStore = () =>
  configureStore({
    reducer: { authReducer, licenseReducer },
    middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
  })

const license = () => store.getState().licenseReducer
let store: ReturnType<typeof buildStore>

const ACTIVE_WITH_THRESHOLD = {
  success: true,
  responseObject: [{ name: 'mau_threshold', value: '100' }],
}

describe('licenseListener', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedFetchToken.mockResolvedValue({ access_token: 'tok' } as never)
    store = buildStore()
  })

  describe('Step 1: checkLicenseConfigValid (GET /isConfigValid)', () => {
    it('marks the config valid when the endpoint succeeds', async () => {
      mockedCheckConfig.mockResolvedValue({ success: true } as never)

      store.dispatch(checkLicenseConfigValid(undefined))
      await flush()

      expect(license().isConfigValid).toBe(true)
    })

    it('marks the config invalid when the endpoint reports failure', async () => {
      mockedCheckConfig.mockResolvedValue({ success: false } as never)

      store.dispatch(checkLicenseConfigValid(undefined))
      await flush()

      expect(license().isConfigValid).toBe(false)
    })

    it('marks the config invalid when the endpoint throws', async () => {
      mockedCheckConfig.mockRejectedValue(new Error('network'))

      store.dispatch(checkLicenseConfigValid(undefined))
      await flush()

      expect(license().isConfigValid).toBe(false)
    })
  })

  describe('Step 2: uploadNewSsaToken (POST /ssa)', () => {
    it('marks the config valid on a successful SSA upload', async () => {
      mockedPostSsa.mockResolvedValue({ success: true } as never)

      store.dispatch(uploadNewSsaToken({ payload: {} } as never))
      await flush()

      expect(license().isConfigValid).toBe(true)
      expect(license().errorSSA).toBe('')
    })

    it('reports an invalid SSA and marks the config invalid when the upload fails', async () => {
      mockedPostSsa.mockResolvedValue({ success: false } as never)

      store.dispatch(uploadNewSsaToken({ payload: {} } as never))
      await flush()

      expect(license().isConfigValid).toBe(false)
      expect(license().errorSSA).toContain('Invalid SSA')
    })

    it('marks the config invalid and stores the error when the upload throws', async () => {
      mockedPostSsa.mockRejectedValue(new Error('upload boom'))

      store.dispatch(uploadNewSsaToken({ payload: {} } as never))
      await flush()

      expect(license().isConfigValid).toBe(false)
      expect(license().errorSSA).toBe('upload boom')
    })
  })

  describe('Step 3 + 3a: checkLicensePresent (GET /isActive then GET /api/v1/stat)', () => {
    it('marks the license valid and under threshold when active and MAU is below the limit', async () => {
      mockedIsLicenseActive.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockResolvedValue([{ monthly_active_users: 50 }] as never)

      store.dispatch(checkLicensePresent(undefined))
      await flush()

      expect(license().isLicenseValid).toBe(true)
      expect(license().isUnderThresholdLimit).toBe(true)
    })

    it('treats an empty stat response as under threshold', async () => {
      mockedIsLicenseActive.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockResolvedValue([] as never)

      store.dispatch(checkLicensePresent(undefined))
      await flush()

      expect(license().isLicenseValid).toBe(true)
      expect(license().isUnderThresholdLimit).toBe(true)
    })

    it('flags over-threshold when MAU exceeds mau_threshold * 1.15', async () => {
      mockedIsLicenseActive.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockResolvedValue([{ monthly_active_users: 200 }] as never)

      store.dispatch(checkLicensePresent(undefined))
      await flush()

      expect(license().isUnderThresholdLimit).toBe(false)
      expect(license().isLicenseValid).toBe(false)
    })

    it('falls back to no-valid-key when the stat call throws', async () => {
      mockedIsLicenseActive.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockRejectedValue(new Error('stat boom'))

      store.dispatch(checkLicensePresent(undefined))
      await flush()

      expect(license().isNoValidLicenseKeyFound).toBe(true)
      expect(license().isLicenseValid).toBe(false)
    })
  })

  describe('Step 4 + 6: retrieve then activate (POST /retrieve, POST /activate)', () => {
    beforeEach(() => {
      mockedIsLicenseActive.mockResolvedValue({ success: false } as never)
    })

    it('retrieves the camelCase licenseKey, activates, and validates MAU', async () => {
      mockedRetrieveLicense.mockResolvedValue({
        responseObject: { licenseKey: 'key-123' },
      } as never)
      mockedActivateLicense.mockResolvedValue({
        success: true,
        responseObject: [{ name: 'mau_threshold', value: '100' }],
      } as never)
      mockedGetStat.mockResolvedValue([] as never)

      store.dispatch(checkLicensePresent(undefined))
      await flush()

      expect(mockedActivateLicense).toHaveBeenCalledWith({ licenseKey: 'key-123' })
      expect(license().isLicenseValid).toBe(true)
      expect(license().isUnderThresholdLimit).toBe(true)
    })

    it('shows the no-valid-key state when activation throws', async () => {
      mockedRetrieveLicense.mockResolvedValue({
        responseObject: { licenseKey: 'key-123' },
      } as never)
      mockedActivateLicense.mockRejectedValue(new Error('activate boom'))

      store.dispatch(checkLicensePresent(undefined))
      await flush()

      expect(license().isNoValidLicenseKeyFound).toBe(true)
      expect(license().isLicenseValid).toBe(false)
    })

    it('shows the no-valid-key state when retrieve returns no key', async () => {
      mockedRetrieveLicense.mockResolvedValue({ responseObject: {} } as never)

      store.dispatch(checkLicensePresent(undefined))
      await flush()

      expect(license().isNoValidLicenseKeyFound).toBe(true)
      expect(license().isLicenseValid).toBe(false)
      expect(mockedActivateLicense).not.toHaveBeenCalled()
    })

    it('shows the no-valid-key state when retrieve throws', async () => {
      mockedRetrieveLicense.mockRejectedValue(new Error('retrieve boom'))

      store.dispatch(checkLicensePresent(undefined))
      await flush()

      expect(license().isNoValidLicenseKeyFound).toBe(true)
      expect(license().isLicenseValid).toBe(false)
    })

    it('routes to retrieve when the isActive check itself throws', async () => {
      mockedIsLicenseActive.mockRejectedValue(new Error('isActive boom'))
      mockedRetrieveLicense.mockResolvedValue({ responseObject: {} } as never)

      store.dispatch(checkLicensePresent(undefined))
      await flush()

      expect(mockedRetrieveLicense).toHaveBeenCalled()
      expect(license().isNoValidLicenseKeyFound).toBe(true)
    })
  })

  describe('Step 5 + 6: generateTrialLicense then activate (POST /trial, POST /activate)', () => {
    it('reads the hyphenated license-key, activates, and marks the license valid', async () => {
      mockedGetTrialLicense.mockResolvedValue({
        responseObject: { 'license-key': 'trial-123' },
      } as never)
      mockedActivateLicense.mockResolvedValue({ success: true } as never)

      store.dispatch(generateTrialLicense())
      await flush()

      expect(mockedActivateLicense).toHaveBeenCalledWith({ licenseKey: 'trial-123' })
      expect(license().isLicenseValid).toBe(true)
    })

    it('marks the license invalid and stores the error when activation throws', async () => {
      mockedGetTrialLicense.mockResolvedValue({
        responseObject: { 'license-key': 'trial-123' },
      } as never)
      mockedActivateLicense.mockRejectedValue(new Error('activate boom'))

      store.dispatch(generateTrialLicense())
      await flush()

      expect(license().isLicenseValid).toBe(false)
      expect(license().error).toBe('activate boom')
    })

    it('marks the license invalid when the trial endpoint throws', async () => {
      mockedGetTrialLicense.mockRejectedValue(new Error('trial boom'))

      store.dispatch(generateTrialLicense())
      await flush()

      expect(license().isLicenseValid).toBe(false)
      expect(license().error).toBe('trial boom')
    })
  })
})

import { configureStore } from '@reduxjs/toolkit'
import { waitFor } from '@testing-library/react'
import { listenerMiddleware } from '../index'
import licenseReducer, {
  checkLicensePresent,
  checkLicenseConfigValid,
  uploadNewSsaToken,
  generateTrialLicense,
} from '../../features/licenseSlice'
import authReducer from '../../features/authSlice'
import { reducer as initReducer } from '../../features/initSlice'
import {
  isLicenseActive,
  retrieveLicense,
  getTrialLicense,
  checkAdminuiLicenseConfig,
  adminuiPostSsa,
  getStat,
} from 'JansConfigApi'
import { setApiToken } from 'Orval'
import { fetchApiTokenWithDefaultScopes } from '../../api/backend-api'

jest.mock('JansConfigApi')
jest.mock('Orval', () => ({ setApiToken: jest.fn(), getApiToken: jest.fn(() => null) }))
jest.mock('../../api/backend-api')

import '../licenseListener'

const mockedFetchToken = fetchApiTokenWithDefaultScopes as jest.MockedFunction<
  typeof fetchApiTokenWithDefaultScopes
>
const mockedSetApiToken = setApiToken as jest.MockedFunction<typeof setApiToken>
const mockedIsLicenseActive = isLicenseActive as jest.MockedFunction<typeof isLicenseActive>
const mockedRetrieveLicense = retrieveLicense as jest.MockedFunction<typeof retrieveLicense>
const mockedGetTrialLicense = getTrialLicense as jest.MockedFunction<typeof getTrialLicense>
const mockedCheckConfig = checkAdminuiLicenseConfig as jest.MockedFunction<
  typeof checkAdminuiLicenseConfig
>
const mockedPostSsa = adminuiPostSsa as jest.MockedFunction<typeof adminuiPostSsa>
const mockedGetStat = getStat as jest.MockedFunction<typeof getStat>

const buildStore = () =>
  configureStore({
    reducer: { authReducer, licenseReducer, initReducer },
    middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
  })

const license = () => store.getState().licenseReducer
const init = () => store.getState().initReducer
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

      await waitFor(() => expect(license().isConfigValid).toBe(true))
    })

    it('marks the config invalid when the endpoint reports failure', async () => {
      mockedCheckConfig.mockResolvedValue({ success: false } as never)

      store.dispatch(checkLicenseConfigValid(undefined))

      await waitFor(() => expect(license().isConfigValid).toBe(false))
    })

    it('marks the config invalid when the endpoint throws', async () => {
      mockedCheckConfig.mockRejectedValue(new Error('network'))

      store.dispatch(checkLicenseConfigValid(undefined))

      await waitFor(() => expect(license().isConfigValid).toBe(false))
      expect(init().isSessionExpired).toBe(false)
    })

    // A timed-out session must surface the timeout modal. Marking the config invalid here would
    // send the user to the SSA upload screen when all they need is to sign in again.
    it.each([401, 403])('reports a timeout rather than an invalid config on %i', async (status) => {
      mockedCheckConfig.mockRejectedValue({ response: { status } })

      store.dispatch(checkLicenseConfigValid(undefined))

      await waitFor(() => expect(init().isSessionExpired).toBe(true))
      expect(license().isConfigValid).toBeNull()
    })
  })

  describe('Step 2: uploadNewSsaToken (POST /ssa)', () => {
    it('fetches a token, forwards the access token and SSA JWT, and marks the config valid', async () => {
      mockedPostSsa.mockResolvedValue({ success: true } as never)

      store.dispatch(uploadNewSsaToken({ payload: { ssa: 'jwt-xyz' } } as never))

      await waitFor(() => expect(license().isConfigValid).toBe(true))
      expect(license().errorSSA).toBe('')
      // bootstrap + request-shape contract
      expect(mockedFetchToken).toHaveBeenCalled()
      expect(mockedSetApiToken).toHaveBeenCalledWith('tok')
      expect(mockedPostSsa).toHaveBeenCalledWith({ ssa: 'jwt-xyz' })
    })

    it('reports an invalid SSA and marks the config invalid when the upload fails', async () => {
      mockedPostSsa.mockResolvedValue({ success: false } as never)

      store.dispatch(uploadNewSsaToken({ payload: {} } as never))

      await waitFor(() => expect(license().errorSSA).toContain('Invalid SSA'))
      expect(license().isConfigValid).toBe(false)
    })

    it('marks the config invalid and stores the error when the upload throws', async () => {
      mockedPostSsa.mockRejectedValue(new Error('upload boom'))

      store.dispatch(uploadNewSsaToken({ payload: {} } as never))

      await waitFor(() => expect(license().errorSSA).toBe('upload boom'))
      expect(license().isConfigValid).toBe(false)
    })
  })

  describe('Step 3 + 3a: checkLicensePresent (GET /isActive then GET /api/v1/stat)', () => {
    it('marks the license valid and under threshold when active and MAU is below the limit', async () => {
      mockedIsLicenseActive.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockResolvedValue([{ monthly_active_users: 50 }] as never)

      store.dispatch(checkLicensePresent(undefined))

      await waitFor(() => expect(license().isLicenseValid).toBe(true))
      expect(license().isUnderThresholdLimit).toBe(true)
      // the active-license path bootstraps a token before calling the stat endpoint
      expect(mockedFetchToken).toHaveBeenCalled()
      expect(mockedSetApiToken).toHaveBeenCalledWith('tok')
    })

    it('treats an empty stat response as under threshold', async () => {
      mockedIsLicenseActive.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockResolvedValue([] as never)

      store.dispatch(checkLicensePresent(undefined))

      await waitFor(() => expect(license().isLicenseValid).toBe(true))
      expect(license().isUnderThresholdLimit).toBe(true)
    })

    it('flags over-threshold when MAU exceeds mau_threshold * 1.15', async () => {
      mockedIsLicenseActive.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockResolvedValue([{ monthly_active_users: 200 }] as never)

      store.dispatch(checkLicensePresent(undefined))

      await waitFor(() => expect(license().isUnderThresholdLimit).toBe(false))
      expect(license().isLicenseValid).toBe(false)
    })

    it('falls back to no-valid-key when the stat call throws', async () => {
      mockedIsLicenseActive.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockRejectedValue(new Error('stat boom'))

      store.dispatch(checkLicensePresent(undefined))

      await waitFor(() => expect(license().isNoValidLicenseKeyFound).toBe(true))
      expect(license().isLicenseValid).toBe(false)
    })
  })

  describe('Step 4: retrieve, which activates on the server (GET /retrieve)', () => {
    beforeEach(() => {
      mockedIsLicenseActive.mockResolvedValue({ success: false } as never)
    })

    it('treats a successful retrieve as an activated license and validates MAU', async () => {
      mockedRetrieveLicense.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockResolvedValue([] as never)

      store.dispatch(checkLicensePresent(undefined))

      await waitFor(() => expect(license().isLicenseValid).toBe(true))
      expect(license().isUnderThresholdLimit).toBe(true)
      expect(license().isNoValidLicenseKeyFound).toBe(false)
      expect(mockedGetStat).toHaveBeenCalled()
    })

    it('flags over-threshold using the mau_threshold returned by retrieve', async () => {
      mockedRetrieveLicense.mockResolvedValue(ACTIVE_WITH_THRESHOLD as never)
      mockedGetStat.mockResolvedValue([{ monthly_active_users: 200 }] as never)

      store.dispatch(checkLicensePresent(undefined))

      await waitFor(() => expect(license().isUnderThresholdLimit).toBe(false))
      expect(license().isLicenseValid).toBe(false)
    })

    it('shows the no-valid-key state when retrieve reports failure', async () => {
      mockedRetrieveLicense.mockResolvedValue({ success: false } as never)

      store.dispatch(checkLicensePresent(undefined))

      await waitFor(() => expect(license().isNoValidLicenseKeyFound).toBe(true))
      expect(license().isLicenseValid).toBe(false)
      expect(mockedGetStat).not.toHaveBeenCalled()
    })

    it('shows the no-valid-key state and stores the error when retrieve throws', async () => {
      mockedRetrieveLicense.mockRejectedValue({
        response: { status: 404, data: { responseMessage: 'No license found' } },
      })

      store.dispatch(checkLicensePresent(undefined))

      await waitFor(() => expect(license().isNoValidLicenseKeyFound).toBe(true))
      expect(license().isLicenseValid).toBe(false)
      expect(license().error).toBe('No license found')
    })

    it('routes to retrieve when the isActive check itself throws', async () => {
      mockedIsLicenseActive.mockRejectedValue(new Error('isActive boom'))
      mockedRetrieveLicense.mockResolvedValue({ success: false } as never)

      store.dispatch(checkLicensePresent(undefined))

      await waitFor(() => expect(license().isNoValidLicenseKeyFound).toBe(true))
      expect(mockedRetrieveLicense).toHaveBeenCalled()
    })
  })

  describe('Step 5: generateTrialLicense, which activates on the server (GET /trial)', () => {
    it('marks the license valid when the trial is activated', async () => {
      mockedGetTrialLicense.mockResolvedValue({ success: true } as never)

      store.dispatch(generateTrialLicense())

      await waitFor(() => expect(license().isLicenseValid).toBe(true))
      expect(license().generatingTrialKey).toBe(false)
      expect(license().error).toBe('')
    })

    it('stores the server message and stops loading when the trial is not activated', async () => {
      mockedGetTrialLicense.mockResolvedValue({
        success: false,
        responseMessage: 'License is not activated.',
      } as never)

      store.dispatch(generateTrialLicense())

      await waitFor(() => expect(license().error).toBe('License is not activated.'))
      expect(license().isLicenseValid).toBe(false)
      expect(license().generatingTrialKey).toBe(false)
    })

    it('stops loading when the trial endpoint returns no body', async () => {
      mockedGetTrialLicense.mockResolvedValue(null as never)

      store.dispatch(generateTrialLicense())

      await waitFor(() => expect(license().islicenseCheckResultLoaded).toBe(true))
      expect(license().isLicenseValid).toBe(false)
      expect(license().generatingTrialKey).toBe(false)
    })

    it('marks the license invalid when the trial endpoint throws', async () => {
      mockedGetTrialLicense.mockRejectedValue(new Error('trial boom'))

      store.dispatch(generateTrialLicense())

      await waitFor(() => expect(license().error).toBe('trial boom'))
      expect(license().isLicenseValid).toBe(false)
      expect(license().generatingTrialKey).toBe(false)
    })
  })
})

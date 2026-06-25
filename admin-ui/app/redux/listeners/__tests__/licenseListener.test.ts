import { configureStore } from '@reduxjs/toolkit'
import { listenerMiddleware } from '../index'
import licenseReducer, {
  checkLicensePresent,
  checkLicenseConfigValid,
  uploadNewSsaToken,
} from '../../features/licenseSlice'
import authReducer from '../../features/authSlice'
import { isLicenseActive, checkAdminuiLicenseConfig, adminuiPostSsa, getStat } from 'JansConfigApi'
import { fetchApiTokenWithDefaultScopes } from '../../api/backend-api'

jest.mock('JansConfigApi')
jest.mock('Orval', () => ({ setApiToken: jest.fn() }))
jest.mock('../../api/backend-api')

import '../licenseListener'

const mockedFetchToken = fetchApiTokenWithDefaultScopes as jest.MockedFunction<
  typeof fetchApiTokenWithDefaultScopes
>
const mockedIsLicenseActive = isLicenseActive as jest.MockedFunction<typeof isLicenseActive>
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

describe('licenseListener', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedFetchToken.mockResolvedValue({ access_token: 'tok' } as never)
  })

  it('checkLicenseConfigValid stores a valid config result', async () => {
    mockedCheckConfig.mockResolvedValue({ success: true } as never)
    const store = buildStore()

    store.dispatch(checkLicenseConfigValid(undefined))
    await flush()

    expect(store.getState().licenseReducer.isConfigValid).toBe(true)
  })

  it('checkLicensePresent marks a valid license when under the MAU threshold', async () => {
    mockedIsLicenseActive.mockResolvedValue({
      success: true,
      responseObject: [{ name: 'mau_threshold', value: '100' }],
    } as never)
    mockedGetStat.mockResolvedValue([] as never)
    const store = buildStore()

    store.dispatch(checkLicensePresent(undefined))
    await flush()

    const state = store.getState().licenseReducer
    expect(state.isLicenseValid).toBe(true)
    expect(state.isUnderThresholdLimit).toBe(true)
  })

  it('uploadNewSsaToken stores a valid config result on a successful post', async () => {
    mockedPostSsa.mockResolvedValue({ success: true } as never)
    const store = buildStore()

    store.dispatch(uploadNewSsaToken({ payload: {} } as never))
    await flush()

    expect(store.getState().licenseReducer.isConfigValid).toBe(true)
  })

  it('uploadNewSsaToken reports an invalid config when the post fails', async () => {
    mockedPostSsa.mockResolvedValue({ success: false } as never)
    const store = buildStore()

    store.dispatch(uploadNewSsaToken({ payload: {} } as never))
    await flush()

    const state = store.getState().licenseReducer
    expect(state.isConfigValid).toBe(false)
    expect(state.errorSSA).toContain('Invalid SSA')
  })
})

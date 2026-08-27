import type { AppConfigResponse } from 'JansConfigApi'
import { putConfigEffect, createSessionEffect } from '../authListener'
import { putServerConfiguration, createAdminUiSession } from '../../api/backend-api'
import {
  getOAuth2Config,
  getOAuth2ConfigResponse,
  putConfigWorkerResponse,
} from '../../features/authSlice'
import { updateToast } from '../../features/toastSlice'
import type { Config } from '../../features/types/authTypes'

jest.mock('../../api/backend-api')

const mockedPutServerConfiguration = putServerConfiguration as jest.MockedFunction<
  typeof putServerConfiguration
>
const mockedCreateAdminUiSession = createAdminUiSession as jest.MockedFunction<
  typeof createAdminUiSession
>

describe('authListener - putConfigEffect', () => {
  const mockConfig: Config = {
    sessionTimeoutInMins: 30,
    acrValues: 'simple_password_auth',
    cedarlingLogType: 'OFF',
    additionalParameters: [],
  }
  const mockResponse: Config = {
    ...mockConfig,
    postLogoutRedirectUri: 'https://example.com/logout',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockedPutServerConfiguration.mockResolvedValue(mockResponse as AppConfigResponse)
  })

  describe('when cedarlingLogType changes', () => {
    it('should dispatch updateToast with custom message on success', async () => {
      const customToastMessage = 'Please relogin to view cedarling changes'
      const dispatch = jest.fn()

      await putConfigEffect(
        {
          ...mockConfig,
          _meta: { cedarlingLogTypeChanged: true, toastMessage: customToastMessage },
        },
        dispatch,
      )

      expect(dispatch).toHaveBeenCalledWith(getOAuth2ConfigResponse({ config: mockResponse }))
      expect(dispatch).toHaveBeenCalledWith(updateToast(true, 'success', customToastMessage))
      expect(dispatch).toHaveBeenCalledWith(putConfigWorkerResponse())
    })

    it('should not dispatch custom toast message on error', async () => {
      const customToastMessage = 'Please relogin to view cedarling changes'
      const dispatch = jest.fn()
      mockedPutServerConfiguration.mockRejectedValue(new Error('Network error'))

      await putConfigEffect(
        {
          ...mockConfig,
          _meta: { cedarlingLogTypeChanged: true, toastMessage: customToastMessage },
        },
        dispatch,
      )

      expect(dispatch).not.toHaveBeenCalledWith(updateToast(true, 'success', customToastMessage))
      expect(dispatch).toHaveBeenCalledWith(updateToast(true, 'error'))
      expect(dispatch).toHaveBeenCalledWith(putConfigWorkerResponse())
    })
  })

  describe('when cedarlingLogType does not change', () => {
    it('should dispatch generic success toast when no metadata provided', async () => {
      const dispatch = jest.fn()

      await putConfigEffect({ ...mockConfig }, dispatch)

      expect(dispatch).toHaveBeenCalledWith(getOAuth2ConfigResponse({ config: mockResponse }))
      expect(dispatch).toHaveBeenCalledWith(updateToast(true, 'success'))
      expect(dispatch).toHaveBeenCalledWith(putConfigWorkerResponse())
    })

    it('should dispatch generic success toast when cedarlingLogTypeChanged is false', async () => {
      const dispatch = jest.fn()

      await putConfigEffect({ ...mockConfig, _meta: { cedarlingLogTypeChanged: false } }, dispatch)

      expect(dispatch).toHaveBeenCalledWith(getOAuth2ConfigResponse({ config: mockResponse }))
      expect(dispatch).toHaveBeenCalledWith(updateToast(true, 'success'))
      expect(dispatch).toHaveBeenCalledWith(putConfigWorkerResponse())
    })

    it('should dispatch generic success toast when toastMessage is undefined', async () => {
      const dispatch = jest.fn()

      await putConfigEffect({ ...mockConfig, _meta: { cedarlingLogTypeChanged: true } }, dispatch)

      expect(dispatch).toHaveBeenCalledWith(getOAuth2ConfigResponse({ config: mockResponse }))
      expect(dispatch).toHaveBeenCalledWith(updateToast(true, 'success'))
      expect(dispatch).toHaveBeenCalledWith(putConfigWorkerResponse())
    })
  })

  describe('error handling', () => {
    it('should dispatch error toast on failure', async () => {
      const dispatch = jest.fn()
      mockedPutServerConfiguration.mockRejectedValue(new Error('API Error'))

      await putConfigEffect({ ...mockConfig }, dispatch)

      expect(dispatch).not.toHaveBeenCalledWith(getOAuth2ConfigResponse({ config: mockResponse }))
      expect(dispatch).toHaveBeenCalledWith(updateToast(true, 'error'))
      expect(dispatch).toHaveBeenCalledWith(putConfigWorkerResponse())
    })
  })

  describe('metadata extraction', () => {
    it('should not send _meta to the API', async () => {
      const dispatch = jest.fn()

      await putConfigEffect(
        { ...mockConfig, _meta: { cedarlingLogTypeChanged: true, toastMessage: 'Test message' } },
        dispatch,
      )

      expect(mockedPutServerConfiguration).toHaveBeenCalledWith({
        props: mockConfig as AppConfigResponse,
      })
    })

    it('should handle payload without _meta correctly', async () => {
      const dispatch = jest.fn()

      await putConfigEffect({ ...mockConfig }, dispatch)

      expect(mockedPutServerConfiguration).toHaveBeenCalledWith({
        props: mockConfig as AppConfigResponse,
      })
      expect(dispatch).toHaveBeenCalledWith(getOAuth2ConfigResponse({ config: mockResponse }))
      expect(dispatch).toHaveBeenCalledWith(updateToast(true, 'success'))
    })
  })

  describe('response handling', () => {
    it('should handle successful response with config update', async () => {
      const dispatch = jest.fn()

      await putConfigEffect({ ...mockConfig }, dispatch)

      expect(dispatch).toHaveBeenCalledWith(getOAuth2ConfigResponse({ config: mockResponse }))
    })

    it('should always call putConfigWorkerResponse in finally block', async () => {
      const dispatch = jest.fn()

      await putConfigEffect({ ...mockConfig }, dispatch)

      expect(dispatch).toHaveBeenCalledWith(putConfigWorkerResponse())
    })

    it('should call putConfigWorkerResponse even on error', async () => {
      const dispatch = jest.fn()
      mockedPutServerConfiguration.mockRejectedValue(new Error('API Error'))

      await putConfigEffect({ ...mockConfig }, dispatch)

      expect(dispatch).toHaveBeenCalledWith(putConfigWorkerResponse())
    })
  })
})

describe('authListener - createSessionEffect', () => {
  const payload = { ujwt: 'user-jwt', apiProtectionToken: 'api-token' }

  beforeEach(() => jest.clearAllMocks())

  it('requests the config only after the session cookie exists', async () => {
    mockedCreateAdminUiSession.mockResolvedValue({})
    const dispatch = jest.fn()

    await createSessionEffect(payload, dispatch)

    const dispatched = dispatch.mock.calls.map(([action]) => action.type)
    expect(dispatched.indexOf('auth/getOAuth2Config')).toBeGreaterThan(
      dispatched.indexOf('auth/createAdminUiSessionResponse'),
    )
    expect(dispatch).toHaveBeenCalledWith(getOAuth2Config({}))
  })

  it('sends no token on that config request, so the cookie is used', async () => {
    mockedCreateAdminUiSession.mockResolvedValue({})
    const dispatch = jest.fn()

    await createSessionEffect(payload, dispatch)

    const configCall = dispatch.mock.calls.find(([a]) => a.type === 'auth/getOAuth2Config')
    expect(configCall?.[0].payload).toEqual({})
  })

  it('falls back to the bearer token when the session cannot be created', async () => {
    mockedCreateAdminUiSession.mockRejectedValue(new Error('boom'))
    const dispatch = jest.fn()

    await createSessionEffect(payload, dispatch)

    expect(dispatch).toHaveBeenCalledWith(getOAuth2Config({ access_token: 'api-token' }))
  })

  it('signs the user out instead of loading config on a 403', async () => {
    mockedCreateAdminUiSession.mockRejectedValue({ response: { status: 403 } })
    const dispatch = jest.fn()

    await createSessionEffect(payload, dispatch)

    const dispatched = dispatch.mock.calls.map(([action]) => action.type)
    expect(dispatched).not.toContain('auth/getOAuth2Config')
  })
})

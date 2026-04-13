import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { getOAuth2ConfigResponse, putConfigWorkerResponse } from '../../features/authSlice'
import { updateToast } from '../../features/toastSlice'
import { putServerConfiguration } from '../../api/backend-api'
import * as AuthSaga from '../AuthSaga'

const { putConfigWorker } = AuthSaga

describe('AuthSaga - putConfigWorker', () => {
  const mockConfig = {
    sessionTimeoutInMins: 30,
    acrValues: 'simple_password_auth',
    cedarlingLogType: 'OFF',
    additionalParameters: [] as string[],
  }
  const mockResponse = {
    ...mockConfig,
    postLogoutRedirectUri: 'https://example.com/logout',
  }

  const mockState = {
    authReducer: {
      token: {
        access_token: 'mock-access-token',
      },
    },
  }

  describe('when cedarlingLogType changes', () => {
    it('should dispatch updateToast with custom message on success', async () => {
      const customToastMessage = 'Please relogin to view cedarling changes'
      const action = {
        type: 'auth/putConfigWorker',
        payload: {
          ...mockConfig,
          _meta: {
            cedarlingLogTypeChanged: true,
            toastMessage: customToastMessage,
          },
        },
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success', customToastMessage))
        .put(putConfigWorkerResponse())
        .run()

      expect(result).toBeTruthy()
    })

    it('should not dispatch custom toast message on error', async () => {
      const customToastMessage = 'Please relogin to view cedarling changes'
      const mockError = new Error('Network error')
      const action = {
        type: 'auth/putConfigWorker',
        payload: {
          ...mockConfig,
          _meta: {
            cedarlingLogTypeChanged: true,
            toastMessage: customToastMessage,
          },
        },
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), throwError(mockError)]])
        .not.put(updateToast(true, 'success', customToastMessage))
        .put(updateToast(true, 'error'))
        .put(putConfigWorkerResponse())
        .run()

      expect(result).toBeTruthy()
    })
  })

  describe('when cedarlingLogType does not change', () => {
    it('should dispatch generic success toast when no metadata provided', async () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success'))
        .put(putConfigWorkerResponse())
        .run()

      expect(result).toBeTruthy()
    })

    it('should dispatch generic success toast when cedarlingLogTypeChanged is false', async () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: {
          ...mockConfig,
          _meta: {
            cedarlingLogTypeChanged: false,
          },
        },
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success'))
        .put(putConfigWorkerResponse())
        .run()

      expect(result).toBeTruthy()
    })

    it('should dispatch generic success toast when toastMessage is undefined', async () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: {
          ...mockConfig,
          _meta: {
            cedarlingLogTypeChanged: true,
          },
        },
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success'))
        .put(putConfigWorkerResponse())
        .run()

      expect(result).toBeTruthy()
    })
  })

  describe('error handling', () => {
    it('should dispatch error toast on failure', async () => {
      const mockError = new Error('API Error')
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), throwError(mockError)]])
        .not.put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'error'))
        .put(putConfigWorkerResponse())
        .run()

      expect(result).toBeTruthy()
    })
  })

  describe('metadata extraction', () => {
    it('should not send _meta to the API', async () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: {
          ...mockConfig,
          _meta: {
            cedarlingLogTypeChanged: true,
            toastMessage: 'Test message',
          },
        },
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .call(putServerConfiguration, {
          props: mockConfig,
        })
        .run()

      expect(result).toBeTruthy()
    })

    it('should handle payload without _meta correctly', async () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .call(putServerConfiguration, {
          props: mockConfig,
        })
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success'))
        .run()

      expect(result).toBeTruthy()
    })
  })

  describe('response handling', () => {
    it('should handle successful response with config update', async () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .run()

      expect(result).toBeTruthy()
    })

    it('should always call putConfigWorkerResponse in finally block', async () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(putConfigWorkerResponse())
        .run()

      expect(result).toBeTruthy()
    })

    it('should call putConfigWorkerResponse even on error', async () => {
      const mockError = new Error('API Error')
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      const result = await expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), throwError(mockError)]])
        .put(putConfigWorkerResponse())
        .run()

      expect(result).toBeTruthy()
    })
  })
})

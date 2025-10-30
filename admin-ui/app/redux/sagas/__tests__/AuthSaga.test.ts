import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { getOAuth2ConfigResponse, putConfigWorkerResponse } from '../../features/authSlice'
import { updateToast } from '../../features/toastSlice'
import { putServerConfiguration } from '../../api/backend-api'
import * as AuthSaga from '../AuthSaga'

const { putConfigWorker } = AuthSaga

describe('AuthSaga - putConfigWorker', () => {
  const mockToken = 'mock-access-token'
  const mockConfig = {
    sessionTimeoutInMins: 30,
    acrValues: 'simple_password_auth',
    cedarlingLogType: 'OFF',
    additionalParameters: [],
  }
  const mockResponse = {
    ...mockConfig,
    postLogoutRedirectUri: 'https://example.com/logout',
  }

  const mockState = {
    authReducer: {
      token: {
        access_token: mockToken,
      },
    },
  }

  describe('when cedarlingLogType changes', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should dispatch updateToast with custom message on success', () => {
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

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success', customToastMessage))
        .put(putConfigWorkerResponse())
        .run()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should not dispatch custom toast message on error', () => {
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

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), throwError(mockError)]])
        .not.put(updateToast(true, 'success', customToastMessage))
        .put(updateToast(true, 'error'))
        .put(putConfigWorkerResponse())
        .run()
    })
  })

  describe('when cedarlingLogType does not change', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should dispatch generic success toast when no metadata provided', () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success'))
        .put(putConfigWorkerResponse())
        .run()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should dispatch generic success toast when cedarlingLogTypeChanged is false', () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: {
          ...mockConfig,
          _meta: {
            cedarlingLogTypeChanged: false,
          },
        },
      }

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success'))
        .put(putConfigWorkerResponse())
        .run()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should dispatch generic success toast when toastMessage is undefined', () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: {
          ...mockConfig,
          _meta: {
            cedarlingLogTypeChanged: true,
            toastMessage: undefined,
          },
        },
      }

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success'))
        .put(putConfigWorkerResponse())
        .run()
    })
  })

  describe('error handling', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should dispatch error toast on failure', () => {
      const mockError = new Error('API Error')
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), throwError(mockError)]])
        .not.put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'error'))
        .put(putConfigWorkerResponse())
        .run()
    })
  })

  describe('metadata extraction', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should not send _meta to the API', () => {
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

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .call(putServerConfiguration, {
          token: mockToken,
          props: mockConfig, // Should NOT include _meta
        })
        .run()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should handle payload without _meta correctly', () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .call(putServerConfiguration, {
          token: mockToken,
          props: mockConfig,
        })
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .put(updateToast(true, 'success'))
        .run()
    })
  })

  describe('response handling', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should handle successful response with config update', () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(getOAuth2ConfigResponse({ config: mockResponse }))
        .run()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should always call putConfigWorkerResponse in finally block', () => {
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), mockResponse]])
        .put(putConfigWorkerResponse())
        .run()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should call putConfigWorkerResponse even on error', () => {
      const mockError = new Error('API Error')
      const action = {
        type: 'auth/putConfigWorker',
        payload: mockConfig,
      }

      return expectSaga(putConfigWorker, action)
        .withState(mockState)
        .provide([[matchers.call.fn(putServerConfiguration), throwError(mockError)]])
        .put(putConfigWorkerResponse())
        .run()
    })
  })
})

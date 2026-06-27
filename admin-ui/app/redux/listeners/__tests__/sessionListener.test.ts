import { configureStore } from '@reduxjs/toolkit'
import { listenerMiddleware } from '../index'
import sessionReducer, { auditLogoutLogs } from '../../features/sessionSlice'
import authReducer from '../../features/authSlice'
import {
  postUserAction,
  fetchApiTokenWithDefaultScopes,
  deleteAdminUiSession,
} from '../../api/backend-api'
import { isFourZeroThreeError } from 'Utils/TokenController'

jest.mock('../../api/backend-api')
jest.mock('Utils/TokenController', () => ({
  addAdditionalData: jest.fn(),
  isFourZeroThreeError: jest.fn(() => false),
}))

import '../sessionListener'

const mockedPostUserAction = postUserAction as jest.MockedFunction<typeof postUserAction>
const mockedFetchToken = fetchApiTokenWithDefaultScopes as jest.MockedFunction<
  typeof fetchApiTokenWithDefaultScopes
>
const mockedDeleteSession = deleteAdminUiSession as jest.MockedFunction<typeof deleteAdminUiSession>
const mockedIs403 = isFourZeroThreeError as jest.MockedFunction<typeof isFourZeroThreeError>

const buildStore = () =>
  configureStore({
    reducer: { authReducer, logoutAuditReducer: sessionReducer },
    middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
  })

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('sessionListener - auditLogoutLogs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedIs403.mockReturnValue(false)
  })

  it('dispatches a successful audit result on a 2xx response', async () => {
    mockedPostUserAction.mockResolvedValue({ status: 200 } as never)
    const store = buildStore()

    store.dispatch(auditLogoutLogs({ message: 'logout' }))
    await flush()

    expect(mockedPostUserAction).toHaveBeenCalled()
    expect(store.getState().logoutAuditReducer.logoutAuditSucceeded).toBe(true)
  })

  it('dispatches a failed audit result on a non-2xx response', async () => {
    mockedPostUserAction.mockResolvedValue({ status: 500 } as never)
    const store = buildStore()

    store.dispatch(auditLogoutLogs({ message: 'logout' }))
    await flush()

    expect(store.getState().logoutAuditReducer.logoutAuditSucceeded).toBe(false)
  })

  it('dispatches a failed audit result on a non-403 error', async () => {
    mockedPostUserAction.mockRejectedValue(new Error('boom'))
    const store = buildStore()

    store.dispatch(auditLogoutLogs({ message: 'logout' }))
    await flush()

    expect(store.getState().logoutAuditReducer.logoutAuditSucceeded).toBe(false)
  })

  it('runs session cleanup and skips the audit result on a 403 error', async () => {
    mockedIs403.mockReturnValue(true)
    mockedPostUserAction.mockRejectedValue({ response: { status: 403 } })
    mockedFetchToken.mockResolvedValue({ access_token: 'tok' } as never)
    mockedDeleteSession.mockResolvedValue({} as never)
    const store = buildStore()

    store.dispatch(auditLogoutLogs({ message: 'logout' }))
    await flush()

    expect(mockedFetchToken).toHaveBeenCalled()
    expect(mockedDeleteSession).toHaveBeenCalledWith('tok')
    // the 403 branch redirects and returns without dispatching an audit result
    expect(store.getState().logoutAuditReducer.logoutAuditSucceeded).toBeNull()
  })
})

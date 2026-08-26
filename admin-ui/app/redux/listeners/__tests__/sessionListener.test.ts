import { configureStore } from '@reduxjs/toolkit'
import { listenerMiddleware } from '../index'
import sessionReducer, { auditLogoutLogs } from '../../features/sessionSlice'
import authReducer from '../../features/authSlice'
import { postUserAction } from '../../api/backend-api'
import { isFourZeroThreeError } from 'Utils/TokenController'

jest.mock('../../api/backend-api')
jest.mock('Utils/TokenController', () => ({
  addAdditionalData: jest.fn(),
  isFourZeroThreeError: jest.fn(() => false),
}))

import '../sessionListener'

const mockedPostUserAction = postUserAction as jest.MockedFunction<typeof postUserAction>
const mockedIs403 = isFourZeroThreeError as jest.MockedFunction<typeof isFourZeroThreeError>

const buildStore = () =>
  configureStore({
    reducer: { authReducer, sessionReducer },
    middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
  })

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('sessionListener - auditLogoutLogs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedIs403.mockReturnValue(false)
  })

  it('posts the logout audit log', async () => {
    mockedPostUserAction.mockResolvedValue({ status: 200 })
    const store = buildStore()

    store.dispatch(auditLogoutLogs({ message: 'logout' }))
    await flush()

    expect(mockedPostUserAction).toHaveBeenCalled()
  })

  it('flags the logout request even when the audit post fails', async () => {
    mockedIs403.mockReturnValue(true)
    mockedPostUserAction.mockRejectedValue({ response: { status: 403 } })
    const store = buildStore()

    store.dispatch(auditLogoutLogs({ message: 'logout' }))
    await flush()

    expect(store.getState().sessionReducer.logoutRequested).toBe(true)
  })

  it('flags the logout request even when the audit post returns a non-2xx response', async () => {
    mockedPostUserAction.mockResolvedValue({ status: 500 })
    const store = buildStore()

    store.dispatch(auditLogoutLogs({ message: 'logout' }))
    await flush()

    expect(store.getState().sessionReducer.logoutRequested).toBe(true)
  })
})

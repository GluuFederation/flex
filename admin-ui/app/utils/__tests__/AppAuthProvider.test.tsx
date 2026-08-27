import React from 'react'
import { render, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import AppAuthProvider from '../AppAuthProvider'
import authReducer from '@/redux/features/authSlice'
import licenseReducer from '@/redux/features/licenseSlice'
import { reducer as initReducer } from '@/redux/features/initSlice'
import cedarPermissionsReducer from '@/redux/features/cedarPermissionsSlice'
import toastReducer from '@/redux/features/toastSlice'
import sessionReducer from '@/redux/features/sessionSlice'
import { NO_VALID_ROLE } from '@/audit/messages'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { auditLogoutLogs } from '@/redux/features/sessionSlice'

const LOGOUT_DELAY_MS = 3 * 1000

jest.mock('@/redux/api/backend-api', () => ({
  fetchActivePolicyStoreBytes: jest.fn().mockResolvedValue(undefined),
  fetchUserInformation: jest.fn().mockResolvedValue(-1),
}))

const rootReducer = combineReducers({
  authReducer,
  licenseReducer,
  initReducer,
  cedarPermissions: cedarPermissionsReducer,
  toastReducer,
  sessionReducer,
})

const buildStore = (licenseState: object = {}, authState: object = {}) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      licenseReducer: { ...licenseReducer(undefined, { type: '@@i' }), ...licenseState },
      authReducer: { ...authReducer(undefined, { type: '@@i' }), ...authState },
    } as never,
  })

const withRoles = (jansAdminUIRole: string | string[] | undefined) => ({
  userinfo: { inum: 'test-inum', jansAdminUIRole },
})

const renderProvider = (store = buildStore()) =>
  render(
    <Provider store={store}>
      <AppTestWrapper>
        <AppAuthProvider>
          <div data-testid="admin-content">Admin UI</div>
        </AppAuthProvider>
      </AppTestWrapper>
    </Provider>,
  )

describe('AppAuthProvider', () => {
  it('renders the redirect fallback and hides protected children while unauthenticated', () => {
    const { container, queryByTestId } = renderProvider()

    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
    expect(queryByTestId('admin-content')).not.toBeInTheDocument()
  })

  it('shows the MAU-exceeded modal when the monthly active users pass the threshold', () => {
    const { getByText } = renderProvider(buildStore({ isUnderThresholdLimit: false }))

    expect(getByText(/monthly active users exceed/i)).toBeInTheDocument()
  })

  describe('a user without a valid Admin UI role', () => {
    beforeEach(() => jest.useFakeTimers())
    afterEach(() => jest.useRealTimers())

    it('logs out automatically once the grace period elapses', () => {
      const store = buildStore({}, withRoles([]))
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      renderProvider(store)

      expect(dispatchSpy).not.toHaveBeenCalledWith(auditLogoutLogs({ message: NO_VALID_ROLE }))

      act(() => {
        jest.advanceTimersByTime(LOGOUT_DELAY_MS)
      })

      expect(dispatchSpy).toHaveBeenCalledWith(auditLogoutLogs({ message: NO_VALID_ROLE }))
    })

    it('logs out even when no toast is ever closed or displayed', () => {
      const store = buildStore({}, withRoles(undefined))
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      renderProvider(store)

      act(() => {
        jest.advanceTimersByTime(LOGOUT_DELAY_MS)
      })

      expect(dispatchSpy).toHaveBeenCalledWith(auditLogoutLogs({ message: NO_VALID_ROLE }))
    })

    it('hides the protected children', () => {
      const { queryByTestId } = renderProvider(buildStore({}, withRoles([])))

      expect(queryByTestId('admin-content')).not.toBeInTheDocument()
    })

    it.each([
      ['an empty string', ''],
      ['a whitespace-only string', '   '],
      ['an array holding only an empty string', ['']],
      ['an array holding only whitespace', ['  ']],
    ])('treats %s as no role at all', (_label, jansAdminUIRole) => {
      const store = buildStore({}, withRoles(jansAdminUIRole))
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      renderProvider(store)

      act(() => {
        jest.advanceTimersByTime(LOGOUT_DELAY_MS)
      })

      expect(dispatchSpy).toHaveBeenCalledWith(auditLogoutLogs({ message: NO_VALID_ROLE }))
    })

    it('keeps a user whose role list also contains an empty entry', () => {
      const store = buildStore({}, withRoles(['', 'api-admin']))
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      renderProvider(store)

      act(() => {
        jest.advanceTimersByTime(LOGOUT_DELAY_MS * 3)
      })

      expect(dispatchSpy).not.toHaveBeenCalledWith(auditLogoutLogs({ message: NO_VALID_ROLE }))
    })

    it('never logs out a user that does have a role', () => {
      const store = buildStore({}, withRoles(['api-admin']))
      const dispatchSpy = jest.spyOn(store, 'dispatch')
      renderProvider(store)

      act(() => {
        jest.advanceTimersByTime(LOGOUT_DELAY_MS * 3)
      })

      expect(dispatchSpy).not.toHaveBeenCalledWith(auditLogoutLogs({ message: NO_VALID_ROLE }))
    })
  })
})

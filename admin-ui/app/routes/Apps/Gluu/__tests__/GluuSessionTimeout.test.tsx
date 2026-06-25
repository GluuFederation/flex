import { render, screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuSessionTimeout from 'Routes/Apps/Gluu/GluuSessionTimeout'

type IdleHandlers = { onIdle?: () => void; onActive?: () => void; disabled?: boolean }

const mockReset = jest.fn()
let capturedHandlers: IdleHandlers = {}

jest.mock('@/hooks/useIdleTimer', () => ({
  useIdleTimer: (opts: IdleHandlers) => {
    capturedHandlers = opts
    return { reset: mockReset, isIdle: false }
  },
}))

const mockNavigateToRoute = jest.fn()
jest.mock('@/helpers/navigation', () => {
  const actual = jest.requireActual('@/helpers/navigation')
  return {
    ...actual,
    useAppNavigation: () => ({ navigateToRoute: mockNavigateToRoute, navigateBack: jest.fn() }),
  }
})

const createStore = (logoutAuditSucceeded: boolean | null = null): Store =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { config: { sessionTimeoutInMins: 5 } }) => state,
      logoutAuditReducer: (state = { logoutAuditSucceeded }) => state,
    }),
  })

const renderTimeout = (isAuthenticated = true, logoutAuditSucceeded: boolean | null = null) => {
  const store = createStore(logoutAuditSucceeded)
  // Spy before render so the dispatch reference the component captures is the spied one.
  const dispatchSpy = jest.spyOn(store, 'dispatch')
  const utils = render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuSessionTimeout isAuthenticated={isAuthenticated} />
      </AppTestWrapper>
    </Provider>,
  )
  return { ...utils, store, dispatchSpy }
}

describe('GluuSessionTimeout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    capturedHandlers = {}
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('does not show the timeout dialog initially', () => {
    renderTimeout(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('registers the idle timer with idle/active handlers', () => {
    renderTimeout(true)
    expect(typeof capturedHandlers.onIdle).toBe('function')
    expect(typeof capturedHandlers.onActive).toBe('function')
  })

  it('disables the idle timer when the user is not authenticated', () => {
    renderTimeout(false)
    expect(capturedHandlers.disabled).toBe(true)
  })

  it('opens the timeout dialog with the countdown after idle + delay', () => {
    renderTimeout(true)
    act(() => {
      capturedHandlers.onIdle?.()
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('counts down each second while the dialog is open', () => {
    renderTimeout(true)
    act(() => {
      capturedHandlers.onIdle?.()
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    // Dialog is still open partway through the countdown.
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes the dialog and dispatches a logout audit when the countdown reaches zero', () => {
    const { dispatchSpy } = renderTimeout(true)
    act(() => {
      capturedHandlers.onIdle?.()
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    dispatchSpy.mockClear()
    act(() => {
      // Run well past the full countdown (starts at 10, fires logout after it hits 0).
      jest.advanceTimersByTime(15 * 1000)
    })
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: expect.stringContaining('auditLogoutLogs') }),
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('navigates to logout once the logout audit succeeds', () => {
    renderTimeout(true, true)
    expect(mockNavigateToRoute).toHaveBeenCalledWith('/admin/logout')
  })

  it('resets the idle timer when authenticated', () => {
    renderTimeout(true)
    expect(mockReset).toHaveBeenCalled()
  })
})

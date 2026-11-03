import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuToast from 'Routes/Apps/Gluu/GluuToast'

type ToastReducerState = {
  showToast: boolean
  type: string
  message: string
  onCloseRedirectUrl: string
}

const initialToastState: ToastReducerState = {
  showToast: true,
  type: 'success',
  message: 'Saved successfully',
  onCloseRedirectUrl: '',
}

const createTestStore = (toastState: ToastReducerState, isSessionExpired: boolean): Store =>
  configureStore({
    reducer: combineReducers({
      toastReducer: (
        state = toastState,
        action: { type: string; payload?: Partial<ToastReducerState> },
      ) => {
        if (action.type === 'toast/updateToast') {
          return { ...state, ...action.payload }
        }
        return state
      },
      initReducer: (state = { isSessionExpired }) => state,
    }),
  })

const renderToast = (
  toastState: ToastReducerState = initialToastState,
  isSessionExpired = false,
) => {
  const store = createTestStore(toastState, isSessionExpired)
  const result = render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuToast />
      </AppTestWrapper>
    </Provider>,
  )
  return { store, ...result }
}

describe('GluuToast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('renders a toast with the message when showToast is true', () => {
    renderToast()
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Saved successfully')).toBeInTheDocument()
  })

  it('renders nothing when showToast is false', () => {
    renderToast({ ...initialToastState, showToast: false })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('does not show an error toast once the session has expired', () => {
    const { store } = renderToast(
      { ...initialToastState, type: 'error', message: 'Request failed with status code 403' },
      true,
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(store.getState().toastReducer.showToast).toBe(false)
  })

  it('still shows an error toast while the session is active', () => {
    renderToast({
      ...initialToastState,
      type: 'error',
      message: 'Request failed with status code 500',
    })
    expect(screen.getByText('Request failed with status code 500')).toBeInTheDocument()
  })

  it('dismisses the toast when the close button is clicked', () => {
    renderToast()
    const closeButton = screen.getByRole('button', { name: /close/i })
    act(() => {
      fireEvent.click(closeButton)
      jest.advanceTimersByTime(400)
    })
    expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument()
  })

  it('auto-dismisses the toast after the timeout elapses', () => {
    renderToast()
    expect(screen.getByText('Saved successfully')).toBeInTheDocument()
    act(() => {
      // default auto-close (10s) + exit animation buffer
      jest.advanceTimersByTime(10000 + 400)
    })
    expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument()
  })

  it('pauses the auto-dismiss timer while hovered and survives past the normal timeout', () => {
    renderToast()
    const toast = screen.getByRole('alert')
    act(() => {
      fireEvent.mouseEnter(toast)
      jest.advanceTimersByTime(10000 + 400)
    })
    // still present because hover paused the timer
    expect(screen.getByText('Saved successfully')).toBeInTheDocument()
  })
})

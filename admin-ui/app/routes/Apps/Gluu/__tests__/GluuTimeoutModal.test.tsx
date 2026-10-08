import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Middleware, UnknownAction } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuTimeoutModal from 'Routes/Apps/Gluu/GluuTimeoutModal'
import { reducer as initReducer } from 'Redux/features/initSlice'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { SESSION_EXPIRED } from '@/audit/messages'

const renderModal = (isSessionExpired: boolean) => {
  const actions: UnknownAction[] = []
  const recorder: Middleware = () => (next) => (action) => {
    actions.push(action as UnknownAction)
    return next(action)
  }
  const store = configureStore({
    reducer: combineReducers({ initReducer }),
    preloadedState: { initReducer: { isSessionExpired } },
    middleware: (getDefault) => getDefault().concat(recorder),
  })
  const result = render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuTimeoutModal />
      </AppTestWrapper>
    </Provider>,
  )
  const signOuts = () =>
    actions.filter((a) => a.type === auditLogoutLogs.type) as ReturnType<typeof auditLogoutLogs>[]
  return { store, signOuts, ...result }
}

describe('GluuTimeoutModal', () => {
  it('shows the session-expired dialog when the session has expired', () => {
    renderModal(true)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Session Expired')).toBeInTheDocument()
    expect(screen.getByText(/session has expired/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument()
  })

  it('renders nothing while the session is valid', () => {
    const { container } = renderModal(false)
    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it.each([
    ['Refresh', () => fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))],
    [
      'the close button',
      () => fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0]),
    ],
    ['Escape', () => fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })],
  ])('signs out through the logout flow on %s', (_label, trigger) => {
    const { signOuts } = renderModal(true)

    trigger()

    expect(signOuts()).toEqual([auditLogoutLogs({ message: SESSION_EXPIRED })])
  })

  it('signs out only once when triggered repeatedly', () => {
    const { signOuts } = renderModal(true)

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    fireEvent.click(screen.getAllByRole('button', { name: /close/i })[0])

    expect(signOuts()).toHaveLength(1)
  })
})

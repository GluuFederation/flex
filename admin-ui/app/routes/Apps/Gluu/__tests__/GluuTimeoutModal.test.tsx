import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuTimeoutModal from 'Routes/Apps/Gluu/GluuTimeoutModal'
import { reducer as initReducer } from 'Redux/features/initSlice'

const createTestStore = (isTimeout: boolean, authServerHost = ''): Store =>
  configureStore({
    reducer: combineReducers({
      initReducer,
      authReducer: (state = { config: { authServerHost } }) => state,
    }),
    preloadedState: { initReducer: { isTimeout } },
  })

const renderModal = (isTimeout: boolean, authServerHost = '') => {
  const store = createTestStore(isTimeout, authServerHost)
  const result = render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuTimeoutModal />
      </AppTestWrapper>
    </Provider>,
  )
  return { store, ...result }
}

describe('GluuTimeoutModal', () => {
  it('renders the timeout dialog when isTimeout is true', () => {
    renderModal(true)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Request Timeout')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('renders nothing when isTimeout is false', () => {
    renderModal(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Request Timeout')).not.toBeInTheDocument()
  })

  it('clears the timeout state when the close button is clicked', () => {
    const { store } = renderModal(true)
    const closeButtons = screen.getAllByRole('button', { name: /close/i })
    fireEvent.click(closeButtons[0])
    expect(store.getState().initReducer.isTimeout).toBe(false)
  })

  it('clears the timeout state when Try Again is clicked', () => {
    const { store } = renderModal(true, '')
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(store.getState().initReducer.isTimeout).toBe(false)
  })
})

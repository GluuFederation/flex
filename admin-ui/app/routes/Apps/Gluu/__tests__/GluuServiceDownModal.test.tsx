import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuServiceDownModal from 'Routes/Apps/Gluu/GluuServiceDownModal'

const createTestStore = (authServerHost: string): Store =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { config: { authServerHost } }) => state,
    }),
  })

const renderModal = (
  props: { message?: string; statusCode?: number | string } = {},
  authServerHost = '',
) => {
  const store = createTestStore(authServerHost)
  return render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuServiceDownModal {...props} />
      </AppTestWrapper>
    </Provider>,
  )
}

describe('GluuServiceDownModal', () => {
  it('renders the message and the Try Again button', () => {
    renderModal({ message: 'Service is unavailable' })
    expect(screen.getByText('Service is unavailable')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('renders the status code when provided', () => {
    renderModal({ message: 'Down', statusCode: 503 })
    expect(screen.getByText('Error code: 503')).toBeInTheDocument()
  })

  it('does not render an error code when statusCode is absent', () => {
    renderModal({ message: 'Down' })
    expect(screen.queryByText(/Error code:/)).not.toBeInTheDocument()
  })

  it('invokes the refresh handler without throwing when Try Again is clicked', () => {
    renderModal({ message: 'Down' }, '')
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))).not.toThrow()
  })
})

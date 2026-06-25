import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuErrorModal from 'Routes/Apps/Gluu/GluuErrorModal'

const createTestStore = (authServerHost: string): Store =>
  configureStore({
    reducer: combineReducers({
      authReducer: (state = { config: { authServerHost } }) => state,
    }),
  })

const renderModal = (
  props: { message?: string; description?: string } = {},
  authServerHost = '',
) => {
  const store = createTestStore(authServerHost)
  return render(
    <Provider store={store}>
      <AppTestWrapper>
        <GluuErrorModal {...props} />
      </AppTestWrapper>
    </Provider>,
  )
}

describe('GluuErrorModal', () => {
  it('renders the provided message and the Try Again button', () => {
    renderModal({ message: 'Something went wrong' })
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('renders the description as HTML', () => {
    renderModal({ message: 'Oops', description: '<strong>details here</strong>' })
    expect(screen.getByText('details here')).toBeInTheDocument()
  })

  it('invokes the refresh handler without throwing when Try Again is clicked', () => {
    renderModal({ message: 'Down' }, '')
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))).not.toThrow()
  })
})

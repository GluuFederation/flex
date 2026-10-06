import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Store } from '@reduxjs/toolkit'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import GluuErrorModal from 'Routes/Apps/Gluu/GluuErrorModal'
import i18n from '../../../../i18n'
import translationFr from '../../../../locales/fr/translation.json'

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

  it('translates the default retry label', async () => {
    i18n.addResourceBundle('fr', 'translation', translationFr, true, true)
    await i18n.changeLanguage('fr')
    try {
      renderModal({ message: 'Limite de MAU dépassée' })
      expect(screen.getByRole('button', { name: 'Réessayer' })).toBeInTheDocument()
    } finally {
      await i18n.changeLanguage('en')
    }
  })

  it('renders the description as plain text', () => {
    renderModal({ message: 'Oops', description: '<strong>details here</strong>' })
    expect(screen.getByText('<strong>details here</strong>')).toBeInTheDocument()
  })

  it('invokes the refresh handler without throwing when Try Again is clicked', () => {
    renderModal({ message: 'Down' }, '')
    expect(() => fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))).not.toThrow()
  })

  it('omits the heading when no message is given', () => {
    renderModal({ description: 'Backend is down' })
    expect(screen.getByText('Backend is down')).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })

  it('is a named dialog with focus on the retry button', () => {
    renderModal({ message: 'Signed Out', description: 'No role' })
    const dialog = screen.getByRole('alertdialog', { name: 'Signed Out' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription('No role')
    expect(screen.getByRole('button', { name: 'Try Again' })).toHaveFocus()
  })

  it('keeps focus on the retry button when Tab is pressed', () => {
    renderModal({ message: 'Signed Out' })
    const retry = screen.getByRole('button', { name: 'Try Again' })
    retry.blur()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(retry).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(retry).toHaveFocus()
  })
})

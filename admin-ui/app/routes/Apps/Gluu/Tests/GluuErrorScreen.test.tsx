import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import GluuErrorScreen from '../GluuErrorScreen'
import i18n from '../../../../i18n'
import { ThemeProvider } from '../../../../context/theme/themeContext'

const renderScreen = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <GluuErrorScreen error={new Error('boom')} resetErrorBoundary={jest.fn()} />
      </ThemeProvider>
    </I18nextProvider>,
  )

describe('GluuErrorScreen', () => {
  it('renders the crash heading and message', () => {
    renderScreen()
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/encountered an unexpected issue/i)).toBeInTheDocument()
  })

  it('renders the home and support actions', () => {
    renderScreen()
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /support portal/i })).toBeInTheDocument()
  })

  it('renders the footer with company and rights', () => {
    renderScreen()
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument()
  })
})

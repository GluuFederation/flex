import React from 'react'
import { render, screen } from '@testing-library/react'
import SettingsPage from 'Plugins/admin/components/Settings/SettingsPage'
import i18n from '../../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from 'Context/theme/themeContext'

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <ThemeProvider>{children}</ThemeProvider>
  </I18nextProvider>
)

it('Should render the license detail page properly', () => {
  render(<SettingsPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/List paging size/)
  screen.getByText(/Config API URL/)
})

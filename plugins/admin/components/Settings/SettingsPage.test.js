import React from 'react'
import { render, screen } from '@testing-library/react'
import SettingsPage from './SettingsPage'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)

it('Should render the license detail page properly', () => {
  render(<SettingsPage />, {
    wrapper: Wrapper,
  })
  screen.getByText(/List paging size/)
  screen.getByText(/Dark Mode/)
  screen.getByText(/Config API URL/)
})

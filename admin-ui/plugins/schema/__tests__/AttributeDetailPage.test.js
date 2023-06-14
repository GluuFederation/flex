import React from 'react'
import { render, screen } from '@testing-library/react'
import AttributeDetailPage from '../presentation/pages/AttributeDetailPage'
import i18n from '../../../app/i18n'
import attributes from '../utils/attributes'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from 'Context/theme/themeContext'

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}><ThemeProvider>{children}</ThemeProvider></I18nextProvider>
)
const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const row = attributes[0]

it('Should render the attribute detail page properly', () => {
  render(<AttributeDetailPage row={row} permissions={permissions} />, {
    wrapper: Wrapper,
  })
  screen.getByText(/Display Name/)
  screen.getByText(/Description/)
  screen.getByText(/Status/)
  screen.getByText(/Attribute Edit Type/)
  screen.getByText(/Attribute View Type/)
})

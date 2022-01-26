import React from 'react'
import { render, screen } from '@testing-library/react'
import UiRoleDetailPage from './UiRoleDetailPage'
import roles from "./roles"
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)
const permissions = [
  'https://jans.io/oauth/config/attributes.readonly',
  'https://jans.io/oauth/config/attributes.write',
  'https://jans.io/oauth/config/attributes.delete',
]
const row = roles[0]
it('Should render the license detail page properly', () => {
  render(<UiRoleDetailPage row={row}  permissions={permissions} />, {
    wrapper: Wrapper,
  })
  const name = row.name
  screen.getByText(/Name/)
  screen.getByText(/Description/)
  screen.getByText(name)
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientDetailPage from './ClientDetailPage'
import clients from './clients'
import i18n from '../../../../app/i18n'
import { I18nextProvider } from 'react-i18next'

const Wrapper = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)
const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const row = clients[0]
it('Should the client detail page properly properly', () => {
  render(<ClientDetailPage row={row} scopes={permissions} />, {
    wrapper: Wrapper,
  })
  screen.getByText(/1801.a0beec01-617b-4607-8a35-3e46ac43deb5/)
  screen.getByText('Jans Config Api Client')
  screen.getByText('pairwise')
  screen.getByText(/The openid connect client name/)
})

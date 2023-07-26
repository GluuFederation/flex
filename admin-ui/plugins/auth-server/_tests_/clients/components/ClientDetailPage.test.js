import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientDetailPage from 'Plugins/auth-server/components/Clients/ClientDetailPage'
import clients from './clients.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const Wrapper = ({ children }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
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
  screen.getByText(/Name/)
})

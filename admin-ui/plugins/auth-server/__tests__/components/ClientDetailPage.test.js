import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientDetailPage from 'Plugins/auth-server/components/Clients/ClientDetailPage'
import clients from './clients.test'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper.test'

const Wrapper = ({ children }) => <AppTestWrapper>{children}</AppTestWrapper>
const permissions = [
  'https://jans.io/oauth/config/openid/clients.readonly',
  'https://jans.io/oauth/config/openid/clients.write',
  'https://jans.io/oauth/config/openid/clients.delete',
]
const row = clients[0]
it('Should show client details properly', () => {
  render(<ClientDetailPage row={row} scopes={permissions} />, {
    wrapper: Wrapper,
  })
  screen.getByText(/1801.a0beec01-617b-4607-8a35-3e46ac43deb5/)
  screen.getByText('Jans Config Api Client')
  screen.getByText('pairwise')
  screen.getByText(/Name/)

  expect(screen.getByText(/Scopes/i)).toBeInTheDocument()
  expect(screen.getByText(/Client Id/i)).toBeInTheDocument()
  expect(screen.getByText(/Description/i)).toBeInTheDocument()
  expect(screen.getByText(/Application type/i)).toBeInTheDocument()
  expect(screen.getByText(/Status/i)).toBeInTheDocument()
  expect(screen.getByText(/Grants/i)).toBeInTheDocument()
  expect(screen.getByText(/Login URIs/i)).toBeInTheDocument()
  expect(screen.getByText(/Authentication method for the Token Endpoint/i)).toBeInTheDocument()
  expect(screen.getByText(/Logout Redirect URIs/i)).toBeInTheDocument()
  expect(screen.getByText(/Response types/i)).toBeInTheDocument()
  expect(screen.getByText(/Supress authorization/i)).toBeInTheDocument()
  expect(screen.getByText(/id_token subject type/i)).toBeInTheDocument()
})

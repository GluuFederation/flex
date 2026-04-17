import React from 'react'
import { render, screen } from '@testing-library/react'
import { ClientDetailPage } from 'Plugins/auth-server/components/OidcClients/components'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import mockClients from '../fixtures/mockClients'
import type { ClientRow, ScopeItem } from 'Plugins/auth-server/components/OidcClients/types'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
)

const client = mockClients[0] as ClientRow

const mockScopes: ScopeItem[] = [
  {
    inum: 'F0C4',
    dn: 'inum=F0C4,ou=scopes,o=jans',
    id: 'openid',
  },
  {
    inum: '43F1',
    dn: 'inum=43F1,ou=scopes,o=jans',
    id: 'profile',
  },
]

it('Should render the client detail page properly', () => {
  render(<ClientDetailPage row={client} scopes={mockScopes} />, { wrapper: Wrapper })

  // The detail grid renders field labels — check key fields are present
  // LABELS.CLIENT_ID ('fields.client_id') → "Client ID"
  // LABELS.NAME ('fields.name') → "Name" (not "Client Name")
  expect(screen.getByText(/Client ID/i)).toBeInTheDocument()
  expect(screen.getAllByText(/Name/i).length).toBeGreaterThan(0)
})

it('Should display the client inum value', () => {
  render(<ClientDetailPage row={client} scopes={mockScopes} />, { wrapper: Wrapper })
  expect(screen.getByText(client.inum)).toBeInTheDocument()
})

it('Should display the client name', () => {
  render(<ClientDetailPage row={client} scopes={[]} />, { wrapper: Wrapper })
  expect(screen.getByText(client.clientName!)).toBeInTheDocument()
})

it('Should render with empty scopes gracefully', () => {
  const { container } = render(<ClientDetailPage row={client} scopes={[]} />, {
    wrapper: Wrapper,
  })
  expect(container).toBeTruthy()
})

it('Should render correctly for a disabled client', () => {
  const disabledClient: ClientRow = { ...client, disabled: true }
  render(<ClientDetailPage row={disabledClient} scopes={mockScopes} />, { wrapper: Wrapper })
  expect(screen.getByText(/Disabled/i)).toBeInTheDocument()
})

it('Should render correctly for a trusted client', () => {
  const trustedClient: ClientRow = { ...client, trustedClient: true }
  render(<ClientDetailPage row={trustedClient} scopes={mockScopes} />, { wrapper: Wrapper })
  // Trusted client renders "Yes" badge
  expect(screen.getAllByText(/Yes/i).length).toBeGreaterThan(0)
})

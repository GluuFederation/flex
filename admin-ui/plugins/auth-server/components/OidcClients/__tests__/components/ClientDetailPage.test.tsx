import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('client secret', () => {
  const secretClient: ClientRow = { ...client, clientSecret: 'super-secret-value' }

  it('Should mask the client secret until it is revealed', async () => {
    const user = userEvent.setup()
    render(<ClientDetailPage row={secretClient} scopes={mockScopes} />, { wrapper: Wrapper })

    expect(screen.queryByText(secretClient.clientSecret as string)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /show password/i }))
    expect(screen.getByText(secretClient.clientSecret as string)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /hide password/i }))
    expect(screen.queryByText(secretClient.clientSecret as string)).not.toBeInTheDocument()
  })

  it('Should mask a second client secret independently of a revealed one', async () => {
    const user = userEvent.setup()
    const otherClient: ClientRow = {
      ...client,
      inum: 'other-inum',
      clientSecret: 'another-secret-value',
    }

    const { unmount } = render(<ClientDetailPage row={secretClient} scopes={mockScopes} />, {
      wrapper: Wrapper,
    })
    await user.click(screen.getByRole('button', { name: /show password/i }))
    expect(screen.getByText(secretClient.clientSecret as string)).toBeInTheDocument()
    unmount()

    render(<ClientDetailPage row={otherClient} scopes={mockScopes} />, { wrapper: Wrapper })
    expect(screen.queryByText(otherClient.clientSecret as string)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument()
  })

  it('Should show a placeholder when the client has no secret', () => {
    const noSecretClient: ClientRow = { ...client, clientSecret: undefined }
    render(<ClientDetailPage row={noSecretClient} scopes={mockScopes} />, { wrapper: Wrapper })
    expect(screen.queryByRole('button', { name: /show password/i })).not.toBeInTheDocument()
  })
})

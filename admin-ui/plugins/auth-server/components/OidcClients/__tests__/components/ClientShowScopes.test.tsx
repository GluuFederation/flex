import React from 'react'
import { render, screen } from '@testing-library/react'
import ClientShowScopes from 'Plugins/auth-server/components/OidcClients/components/ClientShowScopes'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}))

jest.mock('JansConfigApi', () => ({
  ...jest.requireActual('JansConfigApi'),
  getOauthScopes: jest.fn(() =>
    Promise.resolve({
      entries: [
        { inum: 'F0C4', id: 'openid', displayName: 'OpenID Connect' },
        { inum: '43F1', id: 'profile', displayName: 'Profile' },
      ],
      totalEntriesCount: 2,
    }),
  ),
}))

const { getOauthScopes } = jest.requireMock('JansConfigApi') as { getOauthScopes: jest.Mock }

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={queryClient}>
      <AppTestWrapper>{children}</AppTestWrapper>
    </QueryClientProvider>
  )
}

it('Should render nothing when isOpen is false', () => {
  const { container } = render(<ClientShowScopes handler={jest.fn()} data={[]} isOpen={false} />, {
    wrapper: Wrapper,
  })
  expect(container.firstChild).toBeNull()
})

it('Should render the scopes modal when isOpen is true', () => {
  const { container } = render(
    <ClientShowScopes
      handler={jest.fn()}
      data={['inum=F0C4,ou=scopes,o=jans', 'inum=43F1,ou=scopes,o=jans']}
      isOpen={true}
    />,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should show scope displayNames when modal is open and data loaded', async () => {
  render(
    <ClientShowScopes handler={jest.fn()} data={['inum=F0C4,ou=scopes,o=jans']} isOpen={true} />,
    { wrapper: Wrapper },
  )
  expect((await screen.findAllByText(/OpenID Connect/i)).length).toBeGreaterThan(0)
})

it('fetches every page so a client with more than 200 scopes shows them all', async () => {
  const firstPage = Array.from({ length: 200 }, (_, i) => ({ inum: `A${i}`, id: `scope-a${i}` }))
  const secondPage = [{ inum: 'B0', id: 'last-scope', displayName: 'Last Scope' }]
  getOauthScopes
    .mockResolvedValueOnce({ entries: firstPage, totalEntriesCount: 201 })
    .mockResolvedValueOnce({ entries: secondPage, totalEntriesCount: 201 })

  render(
    <ClientShowScopes
      handler={jest.fn()}
      data={['inum=F0C4,ou=scopes,o=jans', 'inum=43F1,ou=scopes,o=jans']}
      isOpen={true}
    />,
    { wrapper: Wrapper },
  )

  expect(await screen.findByText('Last Scope')).toBeInTheDocument()
  expect(screen.getByText('scope-a0')).toBeInTheDocument()
  expect(getOauthScopes).toHaveBeenCalledWith(
    { limit: 200, pattern: 'F0C4,43F1', startIndex: 0 },
    undefined,
    expect.anything(),
  )
  expect(getOauthScopes).toHaveBeenLastCalledWith(
    { limit: 200, pattern: 'F0C4,43F1', startIndex: 200 },
    undefined,
    expect.anything(),
  )
})

it('Should render empty scopes gracefully when isOpen is true', () => {
  const { container } = render(<ClientShowScopes handler={jest.fn()} data={[]} isOpen={true} />, {
    wrapper: Wrapper,
  })
  expect(container).toBeTruthy()
})

it('Should render loading state when fetching scopes', () => {
  getOauthScopes.mockReturnValueOnce(new Promise(() => undefined))

  const { container } = render(
    <ClientShowScopes handler={jest.fn()} data={['inum=F0C4,ou=scopes,o=jans']} isOpen={true} />,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

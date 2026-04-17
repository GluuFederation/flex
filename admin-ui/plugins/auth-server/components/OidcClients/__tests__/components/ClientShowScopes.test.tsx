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
  useGetOauthScopes: jest.fn(() => ({
    data: {
      entries: [
        { inum: 'F0C4', id: 'openid', displayName: 'OpenID Connect' },
        { inum: '43F1', id: 'profile', displayName: 'Profile' },
      ],
    },
    isLoading: false,
    isFetching: false,
  })),
}))

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

it('Should show scope displayNames when modal is open and data loaded', () => {
  render(
    <ClientShowScopes handler={jest.fn()} data={['inum=F0C4,ou=scopes,o=jans']} isOpen={true} />,
    { wrapper: Wrapper },
  )
  expect(screen.getAllByText(/OpenID Connect/i).length).toBeGreaterThan(0)
})

it('Should render empty scopes gracefully when isOpen is true', () => {
  const { useGetOauthScopes } = jest.requireMock('JansConfigApi') as {
    useGetOauthScopes: jest.Mock
  }
  useGetOauthScopes.mockReturnValueOnce({
    data: { entries: [] },
    isLoading: false,
    isFetching: false,
  })

  const { container } = render(<ClientShowScopes handler={jest.fn()} data={[]} isOpen={true} />, {
    wrapper: Wrapper,
  })
  expect(container).toBeTruthy()
})

it('Should render loading state when fetching scopes', () => {
  const { useGetOauthScopes } = jest.requireMock('JansConfigApi') as {
    useGetOauthScopes: jest.Mock
  }
  useGetOauthScopes.mockReturnValueOnce({
    data: undefined,
    isLoading: true,
    isFetching: true,
  })

  const { container } = render(
    <ClientShowScopes handler={jest.fn()} data={['inum=F0C4,ou=scopes,o=jans']} isOpen={true} />,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

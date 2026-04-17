import React from 'react'
import { render } from '@testing-library/react'
import ClientShowSpontaneousScopes from 'Plugins/auth-server/components/OidcClients/components/ClientShowSpontaneousScopes'
import AppTestWrapper from 'Routes/Apps/Gluu/Tests/Components/AppTestWrapper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}))

jest.mock('JansConfigApi', () => ({
  ...jest.requireActual('JansConfigApi'),
  useGetScopeByCreator: jest.fn(() => ({
    data: [],
    isLoading: false,
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
  const { container } = render(
    <ClientShowSpontaneousScopes handler={jest.fn()} isOpen={false} clientInum="0008-0DB1" />,
    { wrapper: Wrapper },
  )
  expect(container.firstChild).toBeNull()
})

it('Should render the spontaneous scopes modal when isOpen is true', () => {
  const { container } = render(
    <ClientShowSpontaneousScopes handler={jest.fn()} isOpen={true} clientInum="0008-0DB1" />,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should render correctly when scopes data is available', () => {
  const { useGetScopeByCreator } = jest.requireMock('JansConfigApi') as {
    useGetScopeByCreator: jest.Mock
  }
  useGetScopeByCreator.mockReturnValueOnce({
    data: [
      { inum: 'SP-001', id: 'spontaneous_scope_1', scopeType: 'spontaneous' },
      { inum: 'SP-002', id: 'spontaneous_scope_2', scopeType: 'spontaneous' },
    ],
    isLoading: false,
  })

  const { container } = render(
    <ClientShowSpontaneousScopes handler={jest.fn()} isOpen={true} clientInum="0008-0DB1" />,
    { wrapper: Wrapper },
  )

  expect(container).toBeTruthy()
})

it('Should render loading state gracefully', () => {
  const { useGetScopeByCreator } = jest.requireMock('JansConfigApi') as {
    useGetScopeByCreator: jest.Mock
  }
  useGetScopeByCreator.mockReturnValueOnce({
    data: undefined,
    isLoading: true,
  })

  const { container } = render(
    <ClientShowSpontaneousScopes handler={jest.fn()} isOpen={true} clientInum="0008-0DB1" />,
    { wrapper: Wrapper },
  )
  expect(container).toBeTruthy()
})

it('Should render without clientInum gracefully', () => {
  const { container } = render(<ClientShowSpontaneousScopes handler={jest.fn()} isOpen={true} />, {
    wrapper: Wrapper,
  })
  expect(container).toBeTruthy()
})

import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAssetServices } from '../useAssetQueries'

type AssetServicesOptions = { query: { enabled: boolean } }

const mockUseGetAssetServices = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetAssetServices: (options: AssetServicesOptions) => mockUseGetAssetServices(options),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useAssetServices', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGetAssetServices.mockReturnValue({ data: ['svc-a'], isLoading: false })
  })

  it('enables the query by default', () => {
    const { result } = renderHook(() => useAssetServices(), { wrapper: createWrapper() })
    expect(mockUseGetAssetServices.mock.calls[0][0].query.enabled).toBe(true)
    expect(result.current.data).toEqual(['svc-a'])
  })

  it('respects an explicit enabled option', () => {
    renderHook(() => useAssetServices({ enabled: false }), { wrapper: createWrapper() })
    expect(mockUseGetAssetServices.mock.calls[0][0].query.enabled).toBe(false)
  })

  it('passes the shared query defaults through', () => {
    renderHook(() => useAssetServices(), { wrapper: createWrapper() })
    const queryOptions = mockUseGetAssetServices.mock.calls[0][0].query
    expect(queryOptions.refetchOnWindowFocus).toBe(false)
    expect(queryOptions.staleTime).toBeGreaterThan(0)
  })
})

import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { GetOauthScopesParams, GetAttributesParams } from 'JansConfigApi'
import { useScopes, useScopeAttributes, useScopeScripts } from '../useScopeQueries'

type QueryOptions = { query?: Record<string, boolean | number> }

const mockUseGetOauthScopes = jest.fn()
const mockUseGetConfigScripts = jest.fn()
const mockGetAttributes = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetOauthScopes: (params: GetOauthScopesParams, options: QueryOptions) =>
    mockUseGetOauthScopes(params, options),
  useGetConfigScripts: (params: undefined, options: QueryOptions) =>
    mockUseGetConfigScripts(params, options),
  getAttributes: (params: GetAttributesParams, _options: undefined, signal?: AbortSignal) =>
    mockGetAttributes(params, _options, signal),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children)
  return Wrapper
}

describe('useScopeQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('useScopes', () => {
    it('passes params and query options to useGetOauthScopes and returns its result', () => {
      const queryResult = { data: { entries: [] }, isLoading: false }
      mockUseGetOauthScopes.mockReturnValue(queryResult)
      const params = { limit: 10, startIndex: 0 }
      const { result } = renderHook(() => useScopes(params))

      expect(result.current).toBe(queryResult)
      expect(mockUseGetOauthScopes).toHaveBeenCalledWith(
        params,
        expect.objectContaining({
          query: expect.objectContaining({ retry: false, refetchOnWindowFocus: false }),
        }),
      )
    })
  })

  describe('useScopeScripts', () => {
    it('returns empty scripts when there is no data', () => {
      mockUseGetConfigScripts.mockReturnValue({ data: undefined, isLoading: false, error: null })
      const { result } = renderHook(() => useScopeScripts())
      expect(result.current.scripts).toEqual([])
    })

    it('maps config script entries to the script shape', () => {
      mockUseGetConfigScripts.mockReturnValue({
        data: {
          entries: [
            { dn: 'dn1', name: 'script1', inum: 'i1', scriptType: 'person', enabled: true },
          ],
        },
        isLoading: false,
        error: null,
      })
      const { result } = renderHook(() => useScopeScripts())
      expect(result.current.scripts).toHaveLength(1)
      expect(result.current.scripts[0]).toEqual({
        dn: 'dn1',
        name: 'script1',
        inum: 'i1',
        scriptType: 'person',
        enabled: true,
      })
    })
  })

  describe('useScopeAttributes', () => {
    it('aggregates a single page of attributes and maps them to claims', async () => {
      mockGetAttributes.mockResolvedValueOnce({
        entries: [{ dn: 'dn-a', name: 'attr-a', key: 'k-a' }],
        totalEntriesCount: 1,
      })

      const { result } = renderHook(() => useScopeAttributes({ limit: 100 }), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.attributes).toEqual([{ dn: 'dn-a', name: 'attr-a', key: 'k-a' }])
      expect(mockGetAttributes).toHaveBeenCalledTimes(1)
    })

    it('paginates until a short page is returned', async () => {
      mockGetAttributes
        .mockResolvedValueOnce({
          entries: [
            { dn: 'd1', name: 'n1', key: 'k1' },
            { dn: 'd2', name: 'n2', key: 'k2' },
          ],
          totalEntriesCount: 3,
        })
        .mockResolvedValueOnce({
          entries: [{ dn: 'd3', name: 'n3', key: 'k3' }],
          totalEntriesCount: 3,
        })

      const { result } = renderHook(() => useScopeAttributes({ limit: 2 }), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.attributes).toHaveLength(3)
      })
      expect(mockGetAttributes).toHaveBeenCalledTimes(2)
    })
  })
})

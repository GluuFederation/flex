import React from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetWebhook } from '../useGetWebhook'
import type { WebhookEntry, PagedWebhookResult } from '../../types'

type WebhookSelect = (data: PagedWebhookResult) => WebhookEntry | undefined
type WebhookParams = { limit: number; startIndex: number; pattern: string }
type WebhookOptions = { query: { enabled: boolean; select: WebhookSelect } }

const mockUseGetAllWebhooks = jest.fn()

jest.mock('JansConfigApi', () => ({
  useGetAllWebhooks: (params: WebhookParams, options: WebhookOptions) =>
    mockUseGetAllWebhooks(params, options),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const webhooks: WebhookEntry[] = [
  { inum: 'w-1', displayName: 'first', url: 'https://example.com/first' },
  { inum: 'w-2', displayName: 'second', url: 'https://example.com/second' },
]

describe('useGetWebhook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('queries with the webhook id as the search pattern and is enabled', () => {
    mockUseGetAllWebhooks.mockImplementation((_params, options: WebhookOptions) => ({
      data: options.query.select({ entries: webhooks }),
      status: 'success',
      isFetching: false,
    }))

    const { result } = renderHook(() => useGetWebhook('w-2'), { wrapper: createWrapper() })

    expect(mockUseGetAllWebhooks.mock.calls[0][0]).toEqual(
      expect.objectContaining({ limit: 100, startIndex: 0, pattern: 'w-2' }),
    )
    expect(mockUseGetAllWebhooks.mock.calls[0][1].query.enabled).toBe(true)
    expect(result.current.webhook).toEqual(
      expect.objectContaining({ inum: 'w-2', displayName: 'second' }),
    )
  })

  it('returns undefined when no entry matches the id', () => {
    mockUseGetAllWebhooks.mockImplementation((_params, options: WebhookOptions) => ({
      data: options.query.select({ entries: webhooks }),
      status: 'success',
      isFetching: false,
    }))

    const { result } = renderHook(() => useGetWebhook('missing'), { wrapper: createWrapper() })
    expect(result.current.webhook).toBeUndefined()
  })

  it('handles a response with no entries', () => {
    mockUseGetAllWebhooks.mockImplementation((_params, options: WebhookOptions) => ({
      data: options.query.select({}),
      status: 'success',
      isFetching: false,
    }))

    const { result } = renderHook(() => useGetWebhook('w-1'), { wrapper: createWrapper() })
    expect(result.current.webhook).toBeUndefined()
  })

  it('is disabled when no webhook id is provided', () => {
    mockUseGetAllWebhooks.mockReturnValue({ data: undefined, status: 'pending', isFetching: false })
    renderHook(() => useGetWebhook(undefined), { wrapper: createWrapper() })
    expect(mockUseGetAllWebhooks.mock.calls[0][1].query.enabled).toBe(false)
    expect(mockUseGetAllWebhooks.mock.calls[0][0].pattern).toBe('')
  })

  it('reports isPending while the status is pending', () => {
    mockUseGetAllWebhooks.mockReturnValue({ data: undefined, status: 'pending', isFetching: false })
    const { result } = renderHook(() => useGetWebhook('w-1'), { wrapper: createWrapper() })
    expect(result.current.isPending).toBe(true)
  })

  it('reports isPending while fetching even when status is not pending', () => {
    mockUseGetAllWebhooks.mockReturnValue({ data: undefined, status: 'success', isFetching: true })
    const { result } = renderHook(() => useGetWebhook('w-1'), { wrapper: createWrapper() })
    expect(result.current.isPending).toBe(true)
  })
})

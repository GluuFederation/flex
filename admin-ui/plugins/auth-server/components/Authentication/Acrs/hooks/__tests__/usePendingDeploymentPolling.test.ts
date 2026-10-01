import { createElement, type ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider, useQuery, type QueryStatus } from '@tanstack/react-query'
import type { Deployment } from 'JansConfigApi'
import { PENDING_REFETCH_INTERVAL, PENDING_REFETCH_LIMIT } from '@/utils/queryUtils'
import {
  usePendingDeploymentPolling,
  type DeploymentsQuery,
} from 'Plugins/auth-server/components/Authentication/Acrs/hooks/usePendingDeploymentPolling'
import {
  mockAgamaDeployments,
  mockPendingAgamaDeployment,
} from 'Plugins/auth-server/components/Authentication/__tests__/fixtures/mockAuthenticationData'

const pending = { entries: [mockPendingAgamaDeployment] }
const finished = {
  entries: [{ ...mockPendingAgamaDeployment, finishedAt: '2026-10-01T10:00:00Z' }],
}

const queryAt = (
  entries: Deployment[],
  dataUpdateCount: number,
  status: QueryStatus = 'success',
): DeploymentsQuery => ({ state: { data: { entries }, status, dataUpdateCount } })

const renderPoll = () => renderHook(() => usePendingDeploymentPolling()).result.current

describe('usePendingDeploymentPolling', () => {
  it('checks again every few seconds while a deployment is pending', () => {
    expect(renderPoll()(queryAt(pending.entries, 1))).toBe(PENDING_REFETCH_INTERVAL)
  })

  it('does not check again once every deployment has finished or nothing is loaded', () => {
    const poll = renderPoll()
    expect(poll(queryAt(mockAgamaDeployments, 1))).toBe(false)
    expect(poll({ state: { status: 'pending', dataUpdateCount: 0 } })).toBe(false)
  })

  it('does not check again after a failed check', () => {
    expect(renderPoll()(queryAt(pending.entries, 2, 'error'))).toBe(false)
  })

  it(`stops after ${PENDING_REFETCH_LIMIT} checks of the same pending deployment`, () => {
    const poll = renderPoll()
    const query = queryAt(pending.entries, 1)
    expect(poll(query)).toBe(PENDING_REFETCH_INTERVAL)

    query.state.dataUpdateCount = PENDING_REFETCH_LIMIT
    expect(poll(query)).toBe(PENDING_REFETCH_INTERVAL)

    query.state.dataUpdateCount = 1 + PENDING_REFETCH_LIMIT
    expect(poll(query)).toBe(false)
  })

  it('counts from zero again for the next pending deployment', () => {
    const poll = renderPoll()
    const query = queryAt(pending.entries, 1)
    poll(query)
    query.state.dataUpdateCount = 1 + PENDING_REFETCH_LIMIT
    expect(poll(query)).toBe(false)

    query.state = { data: finished, status: 'success', dataUpdateCount: 2 + PENDING_REFETCH_LIMIT }
    expect(poll(query)).toBe(false)

    query.state = { data: pending, status: 'success', dataUpdateCount: 3 + PENDING_REFETCH_LIMIT }
    expect(poll(query)).toBe(PENDING_REFETCH_INTERVAL)
  })

  it('counts each query separately, so another page keeps its own checks', () => {
    const poll = renderPoll()
    const firstPage = queryAt(pending.entries, 1)
    poll(firstPage)
    firstPage.state.dataUpdateCount = 1 + PENDING_REFETCH_LIMIT
    expect(poll(firstPage)).toBe(false)

    const secondPage = queryAt(pending.entries, 3 * PENDING_REFETCH_LIMIT)
    expect(poll(secondPage)).toBe(PENDING_REFETCH_INTERVAL)
  })

  describe('driving a real query', () => {
    let client: QueryClient

    beforeEach(() => {
      jest.useFakeTimers()
      client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    })

    afterEach(() => {
      client.clear()
      jest.useRealTimers()
    })

    const renderPollingQuery = (queryFn: () => Promise<{ entries: Deployment[] }>) =>
      renderHook(
        () => {
          const refetchInterval = usePendingDeploymentPolling()
          const { data, isError } = useQuery({
            queryKey: ['agama-deployments'],
            queryFn,
            refetchInterval,
          })
          return { data, isError }
        },
        {
          wrapper: ({ children }: { children: ReactNode }) =>
            createElement(QueryClientProvider, { client }, children),
        },
      )

    const waitForPolls = (polls: number) =>
      act(async () => {
        await jest.advanceTimersByTimeAsync(PENDING_REFETCH_INTERVAL * polls)
      })

    it('re-fetches until the deployment finishes, then stops', async () => {
      const queryFn = jest.fn().mockResolvedValueOnce(pending).mockResolvedValue(finished)
      const { result } = renderPollingQuery(queryFn)

      await waitFor(() => expect(result.current.data).toEqual(pending))
      await waitForPolls(1)
      await waitFor(() => expect(result.current.data).toEqual(finished))
      await waitForPolls(3)
      expect(queryFn).toHaveBeenCalledTimes(2)
    })

    it('stops re-fetching after a failed check', async () => {
      const queryFn = jest
        .fn()
        .mockResolvedValueOnce(pending)
        .mockRejectedValue(new Error('config-api unavailable'))
      const { result } = renderPollingQuery(queryFn)

      await waitFor(() => expect(result.current.data).toEqual(pending))
      await waitForPolls(1)
      await waitFor(() => expect(result.current.isError).toBe(true))
      await waitForPolls(3)
      expect(queryFn).toHaveBeenCalledTimes(2)
    })

    it(`gives up after ${PENDING_REFETCH_LIMIT} checks when the deployment never finishes`, async () => {
      const queryFn = jest.fn().mockResolvedValue(pending)
      const { result } = renderPollingQuery(queryFn)

      await waitFor(() => expect(result.current.data).toEqual(pending))
      await waitForPolls(PENDING_REFETCH_LIMIT + 5)
      expect(queryFn).toHaveBeenCalledTimes(1 + PENDING_REFETCH_LIMIT)
    })

    it(`allows another ${PENDING_REFETCH_LIMIT} checks when the tab is opened again`, async () => {
      const queryFn = jest.fn().mockResolvedValue(pending)
      const firstVisit = renderPollingQuery(queryFn)
      await waitFor(() => expect(firstVisit.result.current.data).toEqual(pending))
      await waitForPolls(PENDING_REFETCH_LIMIT + 5)
      firstVisit.unmount()

      renderPollingQuery(queryFn)
      await waitForPolls(PENDING_REFETCH_LIMIT + 5)
      expect(queryFn).toHaveBeenCalledTimes(1 + 2 * PENDING_REFETCH_LIMIT)
    })
  })
})

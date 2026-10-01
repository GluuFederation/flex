import { useCallback, useRef } from 'react'
import type { QueryStatus } from '@tanstack/react-query'
import type { Deployment } from 'JansConfigApi'
import { PENDING_REFETCH_INTERVAL, PENDING_REFETCH_LIMIT } from '@/utils/queryUtils'
import { hasPendingDeployment } from '../helper/acrUtils'

export type DeploymentsQuery = {
  state: { data?: { entries?: Deployment[] }; status: QueryStatus; dataUpdateCount: number }
}

export const usePendingDeploymentPolling = (): ((query: DeploymentsQuery) => number | false) => {
  const firstPendingUpdate = useRef(new WeakMap<DeploymentsQuery, number>())

  return useCallback((query: DeploymentsQuery) => {
    const { data, status, dataUpdateCount } = query.state
    if (!hasPendingDeployment(data?.entries)) {
      firstPendingUpdate.current.delete(query)
      return false
    }
    const pendingSince = firstPendingUpdate.current.get(query) ?? dataUpdateCount
    firstPendingUpdate.current.set(query, pendingSince)
    return status !== 'error' && dataUpdateCount - pendingSince < PENDING_REFETCH_LIMIT
      ? PENDING_REFETCH_INTERVAL
      : false
  }, [])
}

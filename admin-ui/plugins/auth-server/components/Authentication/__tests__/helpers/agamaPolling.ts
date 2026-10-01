import { useGetAgamaPrj, type Deployment } from 'JansConfigApi'
import type { DeploymentsQuery } from '../../Acrs/hooks/usePendingDeploymentPolling'

export const agamaRefetchIntervalFor = (entries: Deployment[]): number | false | undefined => {
  const refetchInterval = jest.mocked(useGetAgamaPrj).mock.lastCall?.[1]?.query?.refetchInterval
  const query: DeploymentsQuery = {
    state: { data: { entries }, status: 'success', dataUpdateCount: 1 },
  }
  return typeof refetchInterval === 'function' ? refetchInterval(query as never) : refetchInterval
}

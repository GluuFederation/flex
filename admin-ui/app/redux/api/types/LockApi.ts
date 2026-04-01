import type { LockStatEntry } from 'Routes/Dashboards/types/DashboardTypes'

export interface LockApiClient {
  getLockStat: (
    options: Record<string, string>,
    callback: (error: Error | null, data: LockStatEntry[]) => void,
  ) => void
}

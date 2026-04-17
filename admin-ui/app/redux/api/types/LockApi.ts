import type { LockStatEntry } from 'Routes/Dashboards/types/DashboardTypes'

export type LockApiClient = {
  getLockStat: (
    options: Record<string, string>,
    callback: (error: Error | null, data: LockStatEntry[]) => void,
  ) => void
}

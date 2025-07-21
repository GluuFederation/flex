export interface LockApiClient {
  getLockStat: (
    options: Record<string, unknown>,
    callback: (error: Error | null, data: unknown) => void,
  ) => void
}

export interface HealthState {
  serverStatus: string | null
  dbStatus: string | null
  health: Record<string, any>
  loading: boolean
}

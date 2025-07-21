export interface CedarPermissionsState {
  permissions: Record<string, boolean>
  loading: boolean
  error: string | null
  initialized: boolean | null
  isInitializing: boolean
}

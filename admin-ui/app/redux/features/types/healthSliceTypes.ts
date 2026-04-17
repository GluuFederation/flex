export type HealthStatus = 'Running' | 'Not present' | 'Down'

export type HealthServiceKey =
  | 'jans-lock'
  | 'jans-auth'
  | 'jans-config-api'
  | 'jans-casa'
  | 'jans-fido2'
  | 'jans-scim'
  | 'jans-link'
  | 'keycloak'

export type KnownHealthServices = Partial<Record<HealthServiceKey, HealthStatus>>

export type HealthStatusResponse = KnownHealthServices & {
  [serviceName: string]: HealthStatus | undefined
}

export type HealthState = {
  serverStatus: HealthStatus | null
  dbStatus: HealthStatus | null
  health: HealthStatusResponse
  loading: boolean
}

export type HealthStatusResponsePayload = {
  data?: {
    status?: HealthStatus
    db_status?: HealthStatus
  }
}

export type HealthServerStatusResponsePayload = {
  data?: HealthStatusResponse
}

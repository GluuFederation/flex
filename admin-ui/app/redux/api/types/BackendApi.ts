import type { AppConfigResponse } from 'JansConfigApi'

/** Response from API protection token endpoints */
export interface ApiTokenResponse {
  access_token: string
}

/** Payload for putServerConfiguration (admin-ui config update) */
export interface PutServerConfigPayload {
  props: AppConfigResponse
  token?: string
}

/** Payload sent to the audit logging endpoint */
export interface UserActionPayload {
  headers?: Record<string, string>
  client_id?: string
  ip_address?: string
  status?: string
  performedBy?: { user_inum: string; userId: string }
  action?: string
  resource?: string
  message?: string
  modifiedFields?: Record<string, unknown>
  performedOn?: string | Date
  payload?: Record<string, unknown>
  date?: Date
}

/** Params for fetching user info from the OIDC userinfo endpoint */
export interface FetchUserInfoParams {
  userInfoEndpoint: string
  token_type: string
  access_token: string
}

/** Geolocation API response (geolocation-db.com) */
export interface UserIpAndLocationResponse {
  [key: string]: unknown
}

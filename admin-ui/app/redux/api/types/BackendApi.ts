import type { AppConfigResponse } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

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
  modifiedFields?: Record<string, JsonValue>
  performedOn?: string | Date
  payload?: Record<string, JsonValue>
  date?: Date
}

/** Params for fetching user info from the OIDC userinfo endpoint */
export interface FetchUserInfoParams {
  userInfoEndpoint: string
  token_type: string
  access_token: string
}

export type FetchUserInfoResult = string | -1

/** Policy store API response shape */
export type PolicyStoreApiResponse =
  | { success: true; responseBytes: string; responseMessage?: string; responseCode?: number }
  | { success: false; responseMessage?: string; responseCode?: number }
  | { success?: undefined; responseMessage?: string; responseCode?: number }

/** Geolocation API response (geolocation-db.com) */
export interface UserIpAndLocationResponse {
  IPv4?: string
  city?: string
  country_code?: string
  country_name?: string
  latitude?: number
  longitude?: number
  postal?: string
  state?: string
}

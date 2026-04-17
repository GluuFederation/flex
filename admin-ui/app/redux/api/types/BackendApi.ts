import type { AppConfigResponse } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export type ApiTokenResponse = {
  access_token: string
}

export type PutServerConfigPayload = {
  props: AppConfigResponse
  token?: string
}

export type UserActionPayload = {
  headers?: Record<string, string | undefined>
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

export type FetchUserInfoParams = {
  userInfoEndpoint: string
  token_type: string
  access_token: string
}

export type FetchUserInfoResult = string | -1

export type PolicyStoreApiResponse =
  | { success: true; responseBytes: string; responseMessage?: string; responseCode?: number }
  | { success: false; responseMessage?: string; responseCode?: number }
  | { success?: undefined; responseMessage?: string; responseCode?: number }

export type UserIpAndLocationResponse = {
  IPv4?: string
  city?: string
  country_code?: string
  country_name?: string
  latitude?: number
  longitude?: number
  postal?: string
  state?: string
}

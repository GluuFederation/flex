import type { AppConfigResponse } from 'JansConfigApi'
import type {
  ApiTokenResponse,
  FetchUserInfoParams,
  PutServerConfigPayload,
  UserActionPayload,
  UserIpAndLocationResponse,
} from './types/BackendApi'
import axios from '../api/axios'
import axios_instance from 'axios'
import { devLogger } from '@/utils/devLogger'

export type {
  ApiTokenResponse,
  FetchUserInfoParams,
  PutServerConfigPayload,
  UserActionPayload,
  UserIpAndLocationResponse,
} from './types/BackendApi'

export const fetchServerConfiguration = (token?: string): Promise<AppConfigResponse> => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : { withCredentials: true }
  return axios
    .get<AppConfigResponse>('/admin-ui/config', config)
    .then((response) => response.data)
    .catch((error) => {
      devLogger.error('Problems getting configuration in order to process authz code flow.', error)
      throw error
    })
}

export const putServerConfiguration = (
  payload: PutServerConfigPayload,
): Promise<AppConfigResponse> => {
  const { props } = payload
  return axios
    .put<AppConfigResponse>('/admin-ui/config', props, { withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      devLogger.error('Problems updating configuration.', error)
      throw error
    })
}

// get user location and ip
export const getUserIpAndLocation = (): Promise<UserIpAndLocationResponse | -1> => {
  return axios_instance
    .get<UserIpAndLocationResponse>('https://geolocation-db.com/json/')
    .then((response) => response.data)
    .catch((error) => {
      devLogger.error('Error fetching user location and ip address', error)
      return -1
    })
}

// Retrieve user information
export const fetchUserInformation = ({
  userInfoEndpoint,
  token_type,
  access_token,
}: FetchUserInfoParams): Promise<Record<string, unknown> | -1> => {
  const headers = { Authorization: `${token_type} ${access_token}` }
  return axios
    .get<Record<string, unknown>>(userInfoEndpoint, { headers })
    .then((response) => response.data)
    .catch((error) => {
      devLogger.error('Problems fetching user information with the provided code.', error)
      return -1
    })
}

// post user action
export const postUserAction = (
  userAction: UserActionPayload,
): Promise<{ status?: number; data?: Record<string, string | number | boolean> }> => {
  const payload = { ...userAction }
  delete payload.headers
  return axios
    .post(
      '/admin-ui/logging/audit',
      {
        headers: { 'Content-Type': 'application/json' },
        userAction: payload,
      },
      { withCredentials: true },
    )
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      devLogger.error('Problems posting user action audit log.', error)
      throw error
    })
}

// Get API Access Token
export const fetchApiAccessToken = (
  jwt: string,
  permissionTag: string[],
): Promise<ApiTokenResponse | -1> => {
  return axios
    .post<ApiTokenResponse>('/app/admin-ui/oauth2/api-protection-token', {
      ujwt: jwt,
      permissionTag: permissionTag || [],
    })
    .then((response) => response.data)
    .catch((error) => {
      devLogger.error('Problems getting API access token in order to process api calls.', error)
      return -1
    })
}

export const fetchApiTokenWithDefaultScopes = (): Promise<ApiTokenResponse> => {
  return axios
    .post<ApiTokenResponse>(
      '/app/admin-ui/oauth2/api-protection-token',
      {},
      { withCredentials: false },
    )
    .then((response) => response.data)
    .catch((error) => {
      devLogger.error('Problems getting API access token in order to process api calls.', error)
      throw error
    })
}

export const fetchPolicyStore = (
  token?: string,
): Promise<{ status?: number; data?: Record<string, string | number | boolean> }> => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : { withCredentials: true }
  return axios
    .get('/admin-ui/security/policyStore', config)
    .then((response) => ({ status: response.status, data: response.data }))
    .catch((error) => {
      devLogger.error('Problems fetching policy store.', error)
      throw error
    })
}

// Create Admin UI session using UJWT
export const createAdminUiSession = (
  ujwt: string,
  apiProtectionToken: string,
): Promise<unknown> => {
  const headers = { Authorization: `Bearer ${apiProtectionToken}` }
  return axios
    .post('/app/admin-ui/oauth2/session', { ujwt }, { headers, withCredentials: true })
    .then((response) => response.data)
    .catch((error) => {
      devLogger.error('Problems creating Admin UI session.', error)
      throw error
    })
}

// Delete Admin UI session (logout)
export const deleteAdminUiSession = (token?: string): Promise<unknown> => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : { withCredentials: true }
  return axios
    .delete('/app/admin-ui/oauth2/session', config)
    .then((response) => response.data)
    .catch((error) => {
      devLogger.error('Problems deleting Admin UI session.', error)
      throw error
    })
}

import type { AppConfigResponse } from 'JansConfigApi'
import type {
  ApiTokenResponse,
  FetchUserInfoParams,
  FetchUserInfoResult,
  PolicyStoreApiResponse,
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
  FetchUserInfoResult,
  PutServerConfigPayload,
  UserActionPayload,
  UserIpAndLocationResponse,
} from './types/BackendApi'

const ENDPOINTS = {
  CONFIG: '/admin-ui/config',
  AUDIT_LOG: '/admin-ui/logging/audit',
  API_PROTECTION_TOKEN: '/app/admin-ui/oauth2/api-protection-token',
  POLICY_STORE: '/admin-ui/security/policyStore_new',
  SESSION: '/app/admin-ui/oauth2/session',
} as const

const getAuthConfig = (token?: string) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : { withCredentials: true }

export const fetchServerConfiguration = async (token?: string): Promise<AppConfigResponse> => {
  try {
    const response = await axios.get<AppConfigResponse>(ENDPOINTS.CONFIG, getAuthConfig(token))
    return response.data
  } catch (error) {
    devLogger.error('Problems getting configuration in order to process authz code flow.', error)
    throw error
  }
}

export const putServerConfiguration = async (
  payload: PutServerConfigPayload,
): Promise<AppConfigResponse> => {
  try {
    const response = await axios.put<AppConfigResponse>(ENDPOINTS.CONFIG, payload.props, {
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    devLogger.error('Problems updating configuration.', error)
    throw error
  }
}

export const getUserIpAndLocation = async (): Promise<UserIpAndLocationResponse | -1> => {
  try {
    const response = await axios_instance.get<UserIpAndLocationResponse>(
      'https://geolocation-db.com/json/',
    )
    return response.data
  } catch (error) {
    devLogger.error('Error fetching user location and ip address', error)
    return -1
  }
}

export const fetchUserInformation = async ({
  userInfoEndpoint,
  token_type,
  access_token,
}: FetchUserInfoParams): Promise<FetchUserInfoResult> => {
  try {
    const headers = { Authorization: `${token_type} ${access_token}` }
    const response = await axios.get<string>(userInfoEndpoint, { headers })
    return response.data
  } catch (error) {
    devLogger.error('Problems fetching user information with the provided code.', error)
    return -1
  }
}

export const postUserAction = async (
  userAction: UserActionPayload,
): Promise<{ status?: number; data?: Record<string, string | number | boolean> }> => {
  try {
    const payload = { ...userAction }
    delete payload.headers
    const response = await axios.post(
      ENDPOINTS.AUDIT_LOG,
      {
        headers: { 'Content-Type': 'application/json' },
        userAction: payload,
      },
      { withCredentials: true },
    )
    return { status: response.status, data: response.data }
  } catch (error) {
    devLogger.error('Problems posting user action audit log.', error)
    throw error
  }
}

export const fetchApiAccessToken = async (
  jwt: string,
  permissionTag: string[],
): Promise<ApiTokenResponse | -1> => {
  try {
    const response = await axios.post<ApiTokenResponse>(ENDPOINTS.API_PROTECTION_TOKEN, {
      ujwt: jwt,
      permissionTag: permissionTag || [],
    })
    return response.data
  } catch (error) {
    devLogger.error('Problems getting API access token in order to process api calls.', error)
    return -1
  }
}

export const fetchApiTokenWithDefaultScopes = async (): Promise<ApiTokenResponse> => {
  try {
    const response = await axios.post<ApiTokenResponse>(
      ENDPOINTS.API_PROTECTION_TOKEN,
      {},
      { withCredentials: false },
    )
    return response.data
  } catch (error) {
    devLogger.error('Problems getting API access token in order to process api calls.', error)
    throw error
  }
}

export const fetchPolicyStore = async (
  token?: string,
): Promise<{ status?: number; data?: PolicyStoreApiResponse }> => {
  try {
    const response = await axios.get<PolicyStoreApiResponse>(
      ENDPOINTS.POLICY_STORE,
      getAuthConfig(token),
    )
    return { status: response.status, data: response.data }
  } catch (error) {
    devLogger.error('Problems fetching policy store.', error)
    throw error
  }
}

export const uploadPolicyStore = async (
  file: File,
): Promise<{ status?: number; data?: PolicyStoreApiResponse }> => {
  try {
    const formData = new FormData()
    const document = {
      fileName: file.name,
      description: 'Admin UI Policy Store',
    }
    formData.append('document', new Blob([JSON.stringify(document)], { type: 'application/json' }))
    formData.append('policyStore', file)
    const response = await axios.put<PolicyStoreApiResponse>(ENDPOINTS.POLICY_STORE, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return { status: response.status, data: response.data }
  } catch (error) {
    devLogger.error('Problems uploading policy store.', error)
    throw error
  }
}

export const createAdminUiSession = async (
  ujwt: string,
  apiProtectionToken: string,
): Promise<unknown> => {
  try {
    const headers = { Authorization: `Bearer ${apiProtectionToken}` }
    const response = await axios.post(
      ENDPOINTS.SESSION,
      { ujwt },
      { headers, withCredentials: true },
    )
    return response.data
  } catch (error) {
    devLogger.error('Problems creating Admin UI session.', error)
    throw error
  }
}

export const deleteAdminUiSession = async (token?: string): Promise<unknown> => {
  try {
    const response = await axios.delete(ENDPOINTS.SESSION, getAuthConfig(token))
    return response.data
  } catch (error) {
    devLogger.error('Problems deleting Admin UI session.', error)
    throw error
  }
}

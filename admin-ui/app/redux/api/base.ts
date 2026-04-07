import { getRootState } from '@/redux/hooks'
import type { JansApiClient, JansConfigApiModule } from './types/JansApiClient'

export const getClient = (
  JansConfigApi: JansConfigApiModule,
  r_token: string | null,
  r_issuer: string | null,
): JansApiClient['instance'] => {
  const authState = getRootState().authReducer
  const userInum = authState?.userInum || ''
  const hasSession = authState?.hasSession || false
  const defaultClient = JansConfigApi.ApiClient.instance
  defaultClient.timeout = 60000
  const jansauth = defaultClient.authentications['oauth2']
  defaultClient.basePath =
    window['configApiBaseUrl'] ||
    process.env.CONFIG_API_BASE_URL ||
    'https://admin-ui-test.gluu.org'.replace(/\/+$/, '')

  if (hasSession) {
    defaultClient.enableCookies = true
    jansauth.accessToken = undefined
  } else {
    defaultClient.enableCookies = false
    jansauth.accessToken = r_token || undefined
  }

  const headers = {
    'Content-Type': 'application/json',
    'issuer': r_issuer ?? '',
    'jans-client': 'admin-ui',
    'User-inum': userInum,
  }
  defaultClient.defaultHeaders = headers
  return defaultClient
}

export const getClientWithToken = (
  JansConfigApi: JansConfigApiModule,
  token: string,
): JansApiClient['instance'] => {
  const authState = getRootState().authReducer
  const userInum = authState?.userInum || ''
  const issuer = authState?.issuer || ''
  const hasSession = authState?.hasSession || false
  const defaultClient = JansConfigApi.ApiClient.instance
  defaultClient.timeout = 60000
  const jansauth = defaultClient.authentications['oauth2']
  defaultClient.basePath =
    window['configApiBaseUrl'] ||
    process.env.CONFIG_API_BASE_URL ||
    'https://admin-ui-test.gluu.org'.replace(/\/+$/, '')

  if (hasSession) {
    defaultClient.enableCookies = true
    jansauth.accessToken = undefined
  } else {
    defaultClient.enableCookies = false
    jansauth.accessToken = token
  }

  const headers = {
    'Content-Type': 'application/json',
    'issuer': issuer,
    'jans-client': 'admin-ui',
    'User-inum': userInum,
  }
  defaultClient.defaultHeaders = headers
  return defaultClient
}

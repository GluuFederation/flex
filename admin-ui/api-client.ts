import { AxiosHeaders } from 'axios'
import { getRootState } from './app/redux/hooks'
import { fetchApiTokenWithDefaultScopes, deleteAdminUiSession } from './app/redux/api/backend-api'
import { AXIOS_INSTANCE } from './orval-mutator'
import { devLogger } from './app/utils/devLogger'
import { ROUTES } from './app/helpers/navigation'

export { customInstance, AXIOS_INSTANCE } from './orval-mutator'

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const state = getRootState()
  const authState = state.authReducer
  const issuer = authState?.issuer || null
  const userInum = authState?.userInum || ''
  const hasSession = authState?.hasSession || false

  config.withCredentials = hasSession

  if (config.headers instanceof AxiosHeaders) {
    if (issuer) config.headers.set('issuer', issuer)
    config.headers.set('jans-client', 'admin-ui')
    if (userInum) config.headers.set('User-inum', userInum)
  } else {
    config.headers = new AxiosHeaders({
      ...(config.headers as Record<string, string>),
      ...(issuer ? { issuer } : {}),
      'jans-client': 'admin-ui',
      ...(userInum ? { 'User-inum': userInum } : {}),
    })
  }
  return config
})

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      try {
        const response = await fetchApiTokenWithDefaultScopes()
        await deleteAdminUiSession(response?.access_token)
      } catch (e) {
        devLogger.error('Failed to cleanup session on 403:', e)
      } finally {
        window.location.href = ROUTES.LOGOUT
      }
    }

    return Promise.reject(error)
  },
)

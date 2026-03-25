import { useCallback, useMemo } from 'react'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { PATCH } from '@/audit/UserActionType'
import { useAppSelector } from '@/redux/hooks'
import type { CacheConfiguration } from 'JansConfigApi'

const API_CACHE = 'api-cache'

function useAuditAuth() {
  const authState = useAppSelector((state) => state.authReducer)

  return useMemo(
    () => ({
      client_id: authState?.config?.clientId,
      userinfo: authState?.userinfo,
    }),
    [authState?.config?.clientId, authState?.userinfo],
  )
}

export function useCacheAudit() {
  const { client_id, userinfo } = useAuditAuth()

  const logCacheUpdate = useCallback(
    async (
      cache: CacheConfiguration,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: PATCH,
          resource: API_CACHE,
          message,
          modifiedFields,
          performedOn: cache.cacheProviderType,
          client_id,
          payload: cache,
        })
      } catch (error) {
        console.error('Failed to log cache update audit:', error)
      }
    },
    [userinfo, client_id],
  )

  return { logCacheUpdate }
}

import { useCallback, useMemo } from 'react'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { PATCH } from '@/audit/UserActionType'
import { useAppSelector } from '@/redux/hooks'
import type { CacheConfiguration } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { devLogger } from '@/utils/devLogger'

const API_CACHE = 'api-cache'

const useAuditAuth = () => {
  const authState = useAppSelector((state) => state.authReducer)

  return useMemo(
    () => ({
      client_id: authState?.config?.clientId,
      userinfo: authState?.userinfo,
    }),
    [authState?.config?.clientId, authState?.userinfo],
  )
}

export const useCacheAudit = () => {
  const { client_id, userinfo } = useAuditAuth()

  const logCacheUpdate = useCallback(
    async (
      cache: CacheConfiguration,
      message: string,
      modifiedFields?: Record<string, JsonValue>,
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
          payload: cache as JsonValue,
        })
      } catch (error) {
        devLogger.error('Failed to log cache update audit:', error)
      }
    },
    [userinfo, client_id],
  )

  return { logCacheUpdate }
}

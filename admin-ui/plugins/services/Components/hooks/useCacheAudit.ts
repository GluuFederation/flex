import { useCallback } from 'react'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { useAuditContext, PATCH } from '@/audit'
import type { CacheConfiguration } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { logger } from '@/utils/logger'

const API_CACHE = 'api-cache'

export const useCacheAudit = () => {
  const { client_id, userinfo } = useAuditContext()

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
        logger.error(
          'dev',
          'Failed to log cache update audit:',
          error instanceof Error ? error : String(error),
        )
      }
    },
    [userinfo, client_id],
  )

  return { logCacheUpdate }
}

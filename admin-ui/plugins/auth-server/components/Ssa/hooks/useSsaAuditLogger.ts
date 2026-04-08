import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { devLogger } from '@/utils/devLogger'
import type { SsaAuditRootState, SsaAuditParams } from '../types'

export const useSsaAuditLogger = () => {
  const authState = useSelector((state: SsaAuditRootState) => state.authReducer)

  const logAudit = useCallback(
    async (params: SsaAuditParams): Promise<void> => {
      const userinfo = authState?.userinfo
      const clientId = authState?.config?.clientId
      const ipAddress = authState?.location?.IPv4

      try {
        await logAuditUserAction({
          userinfo,
          action: params.action,
          resource: params.resource,
          message: params.message,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: params.payload,
        })
      } catch (error) {
        devLogger.error('Failed to log SSA audit action:', error)
      }
    },
    [authState],
  )

  return { logAudit }
}

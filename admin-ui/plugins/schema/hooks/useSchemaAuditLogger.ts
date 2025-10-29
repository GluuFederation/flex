import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from '@/utils/AuditLogger'
import type { SchemaPluginRootState } from '../types/shared'
import type { JansAttribute } from 'JansConfigApi'

interface AuditLogParams {
  action: string
  resource: string
  message: string
  payload: JansAttribute
}

/**
 * Custom hook for audit logging in Schema plugin
 * Automatically extracts auth state from Redux and handles audit logging
 */
export function useSchemaAuditLogger() {
  // Get auth state from Redux using proper selectors
  const authState = useSelector((state: SchemaPluginRootState) => state.authReducer)

  const logAudit = useCallback(
    async (params: AuditLogParams): Promise<void> => {
      const token = authState?.token?.access_token ?? ''
      const userinfo = authState?.userinfo
      const clientId = authState?.config?.clientId
      const ipAddress = authState?.location?.IPv4

      try {
        await logAuditUserAction({
          token: token || undefined,
          userinfo: userinfo ?? undefined,
          action: params.action,
          resource: params.resource,
          message: params.message,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: params.payload,
        })
      } catch (error) {
        console.error('Failed to log audit action:', error)
      }
    },
    [authState],
  )

  return { logAudit }
}

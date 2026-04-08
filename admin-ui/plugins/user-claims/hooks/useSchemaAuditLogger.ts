import { useCallback } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { logAuditUserAction } from '@/utils/AuditLogger'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import type { SchemaAuditLogParams } from '../types'
import { UPDATE } from '@/audit/UserActionType'

export const useSchemaAuditLogger = () => {
  const authState = useAppSelector((state) => state.authReducer)

  const logAudit = useCallback(
    async (params: SchemaAuditLogParams): Promise<void> => {
      const userinfo = authState?.userinfo
      const clientId = authState?.config?.clientId
      const ipAddress = authState?.location?.IPv4

      const isUpdateAction = params.action === UPDATE

      try {
        await logAuditUserAction({
          userinfo,
          action: params.action,
          resource: params.resource,
          message: params.message,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: isUpdateAction ? undefined : (params.payload as JsonValue),
          modifiedFields: params.modifiedFields as Record<string, JsonValue>,
        })
      } catch (error) {
        console.error('Failed to log audit action:', error)
      }
    },
    [authState],
  )

  return { logAudit }
}

import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from '@/utils/AuditLogger'
import type { SchemaPluginRootState } from '../types/shared'
import type { JansAttribute } from 'JansConfigApi'
import type { ModifiedFields } from '../components/types/AttributeListPage.types'
import { UPDATE } from '@/audit/UserActionType'

interface AuditLogParams {
  action: string
  resource: string
  message: string
  payload?: Partial<JansAttribute>
  modifiedFields?: ModifiedFields
}

export function useSchemaAuditLogger() {
  const authState = useSelector((state: SchemaPluginRootState) => state.authReducer)

  const logAudit = useCallback(
    async (params: AuditLogParams): Promise<void> => {
      const token = authState?.token?.access_token ?? ''
      const userinfo = authState?.userinfo
      const clientId = authState?.config?.clientId
      const ipAddress = authState?.location?.IPv4

      const isUpdateAction = params.action === UPDATE

      try {
        await logAuditUserAction({
          token,
          userinfo,
          action: params.action,
          resource: params.resource,
          message: params.message,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: isUpdateAction ? undefined : params.payload,
          modifiedFields: params.modifiedFields,
        })
      } catch (error) {
        console.error('Failed to log audit action:', error)
      }
    },
    [authState],
  )

  return { logAudit }
}

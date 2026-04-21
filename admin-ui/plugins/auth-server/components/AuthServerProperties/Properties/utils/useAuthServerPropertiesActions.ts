import { useCallback } from 'react'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import { AUTH_SERVER_CONFIGURATION } from '@/audit/Resources'
import { useAppSelector } from '@/redux/hooks'
import type { JsonPatch } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/index'
import { devLogger } from '@/utils/devLogger'

export interface ModifiedFields {
  requestBody?: JsonPatch[]
  defaultAcr?: string
}

export const useAuthServerPropertiesActions = () => {
  const authState = useAppSelector((state) => state.authReducer)
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logAuthServerPropertiesUpdate = useCallback(
    async (message: string, modifiedFields?: ModifiedFields) => {
      try {
        await logAuditUserAction({
          userinfo,
          action: UPDATE,
          resource: AUTH_SERVER_CONFIGURATION,
          message,
          modifiedFields: modifiedFields as Record<string, JsonValue>,
          performedOn: 'auth-server-properties',
          client_id,
        })
        return true
      } catch (auditError) {
        devLogger.error(
          'Error logging audit:',
          auditError instanceof Error ? auditError : String(auditError),
        )
        return false
      }
    },
    [userinfo, client_id],
  )

  return {
    logAuthServerPropertiesUpdate,
  }
}

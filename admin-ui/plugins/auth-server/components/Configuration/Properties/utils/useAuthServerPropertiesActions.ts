import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import type { RootState } from '@/redux/sagas/types/audit'
import type { JsonPatch } from 'JansConfigApi'

export interface ModifiedFields extends Record<string, unknown> {
  requestBody?: JsonPatch[]
  defaultAcr?: string
}

export function useAuthServerPropertiesActions() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logAuthServerPropertiesUpdate = useCallback(
    async (message: string, modifiedFields?: ModifiedFields) => {
      try {
        await logAuditUserAction({
          token,
          userinfo,
          action: UPDATE,
          resource: 'Authentication Server Configuration',
          message,
          modifiedFields,
          performedOn: 'auth-server-properties',
          client_id,
        })
        return true
      } catch (auditError) {
        console.error('Error logging audit:', auditError)
        return false
      }
    },
    [token, userinfo, client_id],
  )

  return {
    logAuthServerPropertiesUpdate,
  }
}

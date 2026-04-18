import { useCallback } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import { API_ACRS } from '@/audit/Resources'
import type { AuthenticationMethod } from 'JansConfigApi'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'

export function useAcrAudit() {
  const authState = useAppSelector((state) => state.authReducer)
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logAcrUpdate = useCallback(
    async (
      acr: AuthenticationMethod,
      message: string,
      modifiedFields?: Record<string, JsonValue>,
    ) => {
      await logAuditUserAction({
        userinfo,
        action: UPDATE,
        resource: API_ACRS,
        message,
        modifiedFields,
        performedOn: acr.defaultAcr,
        client_id,
        payload: acr,
      })
    },
    [userinfo, client_id],
  )

  return { logAcrUpdate }
}

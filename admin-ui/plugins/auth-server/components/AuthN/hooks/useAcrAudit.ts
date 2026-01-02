import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import { API_ACRS } from '@/audit/Resources'
import type { AuthenticationMethod } from 'JansConfigApi'

interface AuthState {
  token?: {
    access_token: string
  }
  config?: {
    clientId: string
  }
  userinfo?: {
    inum: string
    name: string
  } | null
}

interface RootState {
  authReducer: AuthState
}

export function useAcrAudit() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logAcrUpdate = useCallback(
    async (
      acr: AuthenticationMethod,
      message: string,
      modifiedFields?: Record<string, unknown>,
    ) => {
      await logAuditUserAction({
        token,
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
    [token, userinfo, client_id],
  )

  return { logAcrUpdate }
}

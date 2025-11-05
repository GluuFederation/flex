import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'

interface AuthState {
  token: {
    access_token: string
  }
  userinfo: {
    inum?: string
    name?: string
  }
  config: {
    clientId: string
  }
  location?: {
    IPv4?: string
  }
}

interface RootState {
  authReducer: AuthState
}

interface SsaAuditParams {
  action: string
  resource: string
  message: string
  payload?: unknown
}

/**
 * Custom hook for SSA audit logging
 * Uses the modern logAuditUserAction utility to maintain audit trail
 */
export function useSsaAuditLogger() {
  const authState = useSelector((state: RootState) => state.authReducer)

  const logAudit = useCallback(
    async (params: SsaAuditParams): Promise<void> => {
      const token = authState?.token?.access_token ?? ''
      const userinfo = authState?.userinfo
      const clientId = authState?.config?.clientId
      const ipAddress = authState?.location?.IPv4

      try {
        await logAuditUserAction({
          token,
          userinfo,
          action: params.action,
          resource: params.resource,
          message: params.message,
          extra: ipAddress ? { ip_address: ipAddress } : {},
          client_id: clientId,
          payload: params.payload,
        })
      } catch (error) {
        console.error('Failed to log SSA audit action:', error)
      }
    },
    [authState],
  )

  return { logAudit }
}

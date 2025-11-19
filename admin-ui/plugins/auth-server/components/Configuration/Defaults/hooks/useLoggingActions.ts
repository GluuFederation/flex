import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { UPDATE } from '@/audit/UserActionType'
import { API_LOGGING } from '@/audit/Resources'
import type { RootState } from '@/redux/sagas/types/audit'

export interface ModifiedFields {
  [key: string]: {
    oldValue: unknown
    newValue: unknown
  }
}

interface AuditLog {
  headers: {
    Authorization: string
  }
  status: string
  performedBy: {
    user_inum: string
    userId: string
  }
  client_id?: string
  action?: string
  resource?: string
  message?: string
  modifiedFields?: ModifiedFields
  date?: Date
}

export function useLoggingActions() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logLoggingUpdate = useCallback(
    async (message: string, modifiedFields?: ModifiedFields) => {
      if (!token) {
        console.error('Cannot log audit action: Missing authorization token')
        throw new Error('Authorization token required for audit logging')
      }

      if (!userinfo?.inum || !userinfo?.name) {
        console.error('Cannot log audit action: Missing user information')
        throw new Error('User information required for audit logging')
      }

      const audit: AuditLog = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        status: 'success',
        performedBy: {
          user_inum: userinfo.inum,
          userId: userinfo.name,
        },
        client_id,
      }

      addAdditionalData(audit, UPDATE, API_LOGGING, {
        omitPayload: true,
        action: {
          action_message: message,
          action_data: {
            modifiedFields,
          },
        },
      })

      try {
        await postUserAction(audit)
      } catch (error) {
        console.error('Failed to post audit action:', error)
        throw error
      }
    },
    [token, userinfo, client_id],
  )

  return {
    logLoggingUpdate,
  }
}

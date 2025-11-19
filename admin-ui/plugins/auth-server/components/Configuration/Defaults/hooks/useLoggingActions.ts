/**
 * Custom hooks for Logging configuration actions
 * Handles audit logging for logging configuration updates
 */

import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { addAdditionalData } from 'Utils/TokenController'
import { postUserAction } from 'Redux/api/backend-api'
import { UPDATE } from '@/audit/UserActionType'
import { API_LOGGING } from '@/audit/Resources'
import type { Logging } from 'JansConfigApi'
import type { RootState } from '@/redux/sagas/types/audit'

export interface ModifiedFields {
  [key: string]: {
    oldValue: unknown
    newValue: unknown
  }
}

/**
 * Strongly-typed AuditLog interface for logging configuration updates
 * Note: Using local interface instead of shared one for better type safety
 */
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

/**
 * Hook for logging configuration actions with audit logging
 */
export function useLoggingActions() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  /**
   * Log audit action for logging configuration update
   * Matches the exact behavior of the original saga implementation:
   * - Uses omitPayload: true (no payload in audit)
   * - Only sends modifiedFields in action_data
   */
  const logLoggingUpdate = useCallback(
    async (logging: Logging, message: string, modifiedFields?: ModifiedFields) => {
      // Validate required audit fields
      if (!token) {
        console.error('Cannot log audit action: Missing authorization token')
        throw new Error('Authorization token required for audit logging')
      }

      if (!userinfo?.inum || !userinfo?.name) {
        console.error('Cannot log audit action: Missing user information')
        throw new Error('User information required for audit logging')
      }

      // Build audit log matching the original saga pattern
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

      // Use addAdditionalData exactly as the saga did
      addAdditionalData(audit, UPDATE, API_LOGGING, {
        omitPayload: true,
        action: {
          action_message: message,
          action_data: {
            modifiedFields,
          },
        },
      })

      // Post the audit action with error handling
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

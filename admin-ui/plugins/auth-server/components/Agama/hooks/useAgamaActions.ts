/**
 * Custom hooks for Agama actions
 * Handles audit logging and common Agama operations
 */

import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION } from '../../../../../app/audit/UserActionType'
import { AGAMA_PROJECT } from '../../../redux/audit/Resources'
import type { Deployment } from 'JansConfigApi'
import type { ModifiedFields } from '../types'
import type { RootState } from '@/redux/sagas/types/audit'

/**
 * Hook for Agama project actions with audit logging
 */
export function useAgamaActions() {
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  /**
   * Log audit action for Agama project creation (upload)
   */
  const logAgamaCreation = useCallback(
    async (project: Deployment, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: CREATE,
        resource: AGAMA_PROJECT,
        message,
        modifiedFields,
        performedOn: project.dn || project.id,
        client_id,
        payload: project,
      })
    },
    [token, userinfo, client_id],
  )

  /**
   * Log audit action for Agama project update (config changes)
   */
  const logAgamaUpdate = useCallback(
    async (project: Deployment, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: UPDATE,
        resource: AGAMA_PROJECT,
        message,
        modifiedFields,
        performedOn: project.dn || project.id,
        client_id,
        payload: project,
      })
    },
    [token, userinfo, client_id],
  )

  /**
   * Log audit action for Agama project deletion
   */
  const logAgamaDeletion = useCallback(
    async (project: Deployment, message: string) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: DELETION,
        resource: AGAMA_PROJECT,
        message,
        performedOn: project.dn || project.id,
        client_id,
        payload: { dn: project.dn, id: project.id },
      })
    },
    [token, userinfo, client_id],
  )

  /**
   * Log audit action for ACR mapping changes
   */
  const logAcrMappingUpdate = useCallback(
    async (message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: UPDATE,
        resource: 'json-configuration',
        message,
        modifiedFields,
        performedOn: '/acrMappings',
        client_id,
      })
    },
    [token, userinfo, client_id],
  )

  return {
    logAgamaCreation,
    logAgamaUpdate,
    logAgamaDeletion,
    logAcrMappingUpdate,
  }
}

/**
 * Custom hooks for Scope actions
 * Handles audit logging and common scope operations
 */

import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION } from '../../../../../app/audit/UserActionType'
import { SCOPE } from '../../../redux/audit/Resources'
import type { Scope, ModifiedFields } from '../types'

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
  }
}

interface RootState {
  authReducer: AuthState
}

/**
 * Hook for scope actions with audit logging
 */
export function useScopeActions() {
  const navigate = useNavigate()
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  /**
   * Log audit action for scope creation
   */
  const logScopeCreation = useCallback(
    async (scope: Scope, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: CREATE,
        resource: SCOPE,
        message,
        modifiedFields,
        performedOn: scope.id || scope.inum,
        client_id,
        payload: scope,
      })
    },
    [token, userinfo, client_id],
  )

  /**
   * Log audit action for scope update
   */
  const logScopeUpdate = useCallback(
    async (scope: Scope, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: UPDATE,
        resource: SCOPE,
        message,
        modifiedFields,
        performedOn: scope.id || scope.inum,
        client_id,
        payload: scope,
      })
    },
    [token, userinfo, client_id],
  )

  /**
   * Log audit action for scope deletion
   */
  const logScopeDeletion = useCallback(
    async (scope: Scope, message: string) => {
      await logAuditUserAction({
        token,
        userinfo,
        action: DELETION,
        resource: SCOPE,
        message,
        performedOn: scope.id || scope.inum,
        client_id,
        payload: { inum: scope.inum, id: scope.id },
      })
    },
    [token, userinfo, client_id],
  )

  /**
   * Navigate to scope list page
   */
  const navigateToScopeList = useCallback(() => {
    navigate('/auth-server/scopes')
  }, [navigate])

  /**
   * Navigate to scope add page
   */
  const navigateToScopeAdd = useCallback(() => {
    navigate('/auth-server/scope/new')
  }, [navigate])

  /**
   * Navigate to scope edit page
   */
  const navigateToScopeEdit = useCallback(
    (inum: string) => {
      navigate(`/auth-server/scope/edit/${inum}`)
    },
    [navigate],
  )

  return {
    logScopeCreation,
    logScopeUpdate,
    logScopeDeletion,
    navigateToScopeList,
    navigateToScopeAdd,
    navigateToScopeEdit,
  }
}

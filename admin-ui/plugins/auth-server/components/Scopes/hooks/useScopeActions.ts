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

export function useScopeActions() {
  const navigate = useNavigate()
  const authState = useSelector((state: RootState) => state.authReducer)
  const token = authState?.token?.access_token
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

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

  const navigateToScopeList = useCallback(() => {
    navigate('/auth-server/scopes')
  }, [navigate])

  const navigateToScopeAdd = useCallback(() => {
    navigate('/auth-server/scope/new')
  }, [navigate])

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

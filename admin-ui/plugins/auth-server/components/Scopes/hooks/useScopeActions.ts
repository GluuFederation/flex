import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION } from '../../../../../app/audit/UserActionType'
import { SCOPE } from '../../../redux/audit/Resources'
import type { Scope, ModifiedFields } from '../types'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

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
  const { navigateToRoute } = useAppNavigation()
  const authState = useSelector((state: RootState) => state.authReducer)
  const client_id = authState?.config?.clientId
  const userinfo = authState?.userinfo

  const logScopeCreation = useCallback(
    async (scope: Scope, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
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
    [userinfo, client_id],
  )

  const logScopeUpdate = useCallback(
    async (scope: Scope, message: string, modifiedFields?: ModifiedFields) => {
      await logAuditUserAction({
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
    [userinfo, client_id],
  )

  const logScopeDeletion = useCallback(
    async (scope: Scope, message: string) => {
      await logAuditUserAction({
        userinfo,
        action: DELETION,
        resource: SCOPE,
        message,
        performedOn: scope.id || scope.inum,
        client_id,
        payload: { inum: scope.inum, id: scope.id },
      })
    },
    [userinfo, client_id],
  )

  const navigateToScopeList = useCallback(() => {
    navigateToRoute(ROUTES.AUTH_SERVER_SCOPES_LIST)
  }, [navigateToRoute])

  const navigateToScopeAdd = useCallback(() => {
    navigateToRoute(ROUTES.AUTH_SERVER_SCOPE_ADD)
  }, [navigateToRoute])

  const navigateToScopeEdit = useCallback(
    (inum: string) => {
      navigateToRoute(ROUTES.AUTH_SERVER_SCOPE_EDIT(inum))
    },
    [navigateToRoute],
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

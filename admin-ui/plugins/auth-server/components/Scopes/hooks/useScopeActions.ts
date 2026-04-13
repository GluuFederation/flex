import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { logAuditUserAction } from 'Utils/AuditLogger'
import { CREATE, UPDATE, DELETION } from '../../../../../app/audit/UserActionType'
import { SCOPE } from '../../../redux/audit/Resources'
import type { Scope, ModifiedFields, ScopeRootState } from '../types'
import { toScopeJsonRecord } from '../helper/utils'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

export const useScopeActions = () => {
  const { navigateToRoute } = useAppNavigation()
  const authState = useSelector((state: ScopeRootState) => state.authReducer)
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
        payload: toScopeJsonRecord(scope),
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
        payload: toScopeJsonRecord(scope),
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
        payload: { inum: scope.inum ?? null, id: scope.id ?? null },
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

import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCedarlingPermission } from '../../redux/features/cedarPermissionsSlice'
import { cedarlingClient } from '../client/CedarlingClient'
import { uuidv4 } from '@/utils/Util'
import { constants } from '../../cedarling/constants'
import type {
  RootState,
  UseCedarlingReturn,
  AuthorizationResult,
  AuthorizationRequest,
  Principal,
  Resource,
} from '../types'

export function useCedarling(): UseCedarlingReturn {
  const { APP_ID, APP_NAME, PRINCIPAL_TYPE, RESOURCE_TYPE, ACTION_TYPE } = constants
  const dispatch = useDispatch()

  const scopes = useSelector(
    (state: RootState) => state.authReducer?.token?.scopes ?? state.authReducer?.permissions ?? [],
  )
  const role = useSelector(
    (state: RootState) => state.authReducer?.userinfo?.jansAdminUIRole ?? null,
  )
  const sub = useSelector((state: RootState) => state.authReducer?.userinfo?.sub ?? null)
  const permissions = useSelector((state: RootState) => state.cedarPermissions?.permissions || {})
  const isLoading = useSelector((state: RootState) => state.cedarPermissions?.loading || false)
  const error = useSelector((state: RootState) => state.cedarPermissions?.error)

  const hasReduxPermission = useCallback(
    (url: string): boolean | undefined => {
      if (url in permissions) {
        return permissions[url] // true or false
      }
      return undefined // unknown (not checked or not yet resolved)
    },
    [permissions],
  )

  const cedarRequestBuilder = useCallback(
    (resourceScope: string[]): AuthorizationRequest => {
      const safeScopes: string[] =
        scopes && Array.isArray(scopes) && scopes.length ? scopes : ['stats.readonly']

      const principals: Principal[] = [
        {
          id: uuidv4(),
          role,
          scopes: safeScopes,
          sub,
          type: PRINCIPAL_TYPE,
        },
      ]

      const resource: Resource = {
        app_id: APP_ID,
        id: APP_ID,
        name: APP_NAME,
        role,
        scopes: resourceScope,
        sub,
        type: RESOURCE_TYPE,
      }

      return {
        principals,
        action: ACTION_TYPE,
        resource,
        context: {},
      }
    },
    [role, scopes, sub, APP_ID, APP_NAME, PRINCIPAL_TYPE, RESOURCE_TYPE, ACTION_TYPE],
  )

  const authorize = useCallback(
    async (resourceScope: string[]): Promise<AuthorizationResult> => {
      const url = resourceScope[0]
      if (!url) return { isAuthorized: false }

      const existingPermission = hasReduxPermission(url)
      if (existingPermission !== undefined) {
        return { isAuthorized: existingPermission }
      }

      const request = cedarRequestBuilder(resourceScope)

      try {
        const response = await cedarlingClient.authorize(request)
        const isAuthorized = response?.decision === true

        dispatch(
          setCedarlingPermission({
            url,
            isAuthorized,
          }),
        )

        return { isAuthorized, response }
      } catch (error) {
        return {
          isAuthorized: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
    [dispatch, hasReduxPermission, cedarRequestBuilder],
  )

  return {
    authorize,
    hasCedarPermission: hasReduxPermission,
    isLoading,
    error,
  }
}

import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { setCedarlingPermission } from '@/redux/features/cedarPermissionsSlice'
import { cedarlingClient, buildCedarPermissionKey, CEDARLING_CONSTANTS } from '@/cedarling'
import type {
  RootState,
  UseCedarlingReturn,
  AuthorizationResult,
  ResourceScopeEntry,
  CedarAction,
  AdminUiFeatureResource,
} from '@/cedarling'
import { findPermissionByUrl } from '@/cedarling/utility'
import { OPENID, REVOKE_SESSION, SCIM_BULK, SSA_ADMIN, SSA_DEVELOPER } from '@/utils/PermChecker'
import { updateToast } from '@/redux/features/toastSlice'

export function useCedarling(): UseCedarlingReturn {
  const { ACTION_TYPE, RESOURCE_TYPE } = CEDARLING_CONSTANTS

  const dispatch = useDispatch()

  const {
    userinfo_jwt: userinfo_token,
    idToken: id_token,
    JwtToken: access_token,
  } = useSelector((state: RootState) => state.authReducer)
  const apiPermission = useSelector((state: RootState) => state.apiPermissionReducer.items)

  const {
    permissions: permissionsByResourceId,
    loading: isLoading,
    error,
    initialized: cedarlingInitialized,
    isInitializing,
  } = useSelector((state: RootState) => state.cedarPermissions)
  const executeUrls = new Set([SSA_ADMIN, SSA_DEVELOPER, SCIM_BULK, REVOKE_SESSION, OPENID])

  const getActionLabelFromUrl = (url: string): CedarAction => {
    const lowerUrl = url.toLowerCase()

    if (executeUrls.has(lowerUrl)) {
      return `write`
    }

    if (lowerUrl.includes('write')) {
      return 'write'
    }

    if (lowerUrl.includes('delete')) {
      return 'delete'
    }

    return 'read'
  }
  const buildAuthorizationRequest = useCallback(
    (resourceId: string, actionLabel: CedarAction) => {
      const cacheKey = buildCedarPermissionKey(resourceId as AdminUiFeatureResource, actionLabel)
      const cachedDecision = permissionsByResourceId[cacheKey]
      if (cachedDecision !== undefined) {
        return { cacheKey, cachedDecision }
      }

      // Ensure all tokens are available
      if (!access_token || !id_token || !userinfo_token) {
        throw new Error('Required tokens are missing')
      }

      const tokens = {
        access_token,
        id_token,
        userinfo_token,
      }

      if (!resourceId) {
        throw new Error('Resource id is missing for Cedar authorization request')
      }

      const resource = {
        cedar_entity_mapping: {
          entity_type: RESOURCE_TYPE,
          id: resourceId,
        },
      }

      const requestPayload = {
        tokens,
        action: `${ACTION_TYPE}"${actionLabel}"`,
        resource,
        context: {},
      }

      return { request: requestPayload, cacheKey }
    },
    [access_token, id_token, userinfo_token, RESOURCE_TYPE, permissionsByResourceId, ACTION_TYPE],
  )

  const getCachedDecisionByAction = useCallback(
    (resourceId: string, action: CedarAction): boolean | undefined =>
      permissionsByResourceId[
        buildCedarPermissionKey(resourceId as AdminUiFeatureResource, action)
      ],
    [permissionsByResourceId],
  )

  const getCachedPermission = useCallback(
    (resourceId: string): boolean | undefined => {
      const readKey = buildCedarPermissionKey(resourceId as AdminUiFeatureResource, 'read')
      if (readKey in permissionsByResourceId) {
        return permissionsByResourceId[readKey]
      }
      return permissionsByResourceId[resourceId]
    },
    [permissionsByResourceId],
  )

  const authorize = useCallback(
    async (resourceScope: ResourceScopeEntry[]): Promise<AuthorizationResult> => {
      const scopeEntry = resourceScope[0]
      if (!scopeEntry) return { isAuthorized: false }

      const url = scopeEntry.permission
      const resolvedResourceId = scopeEntry.resourceId

      if (!cedarlingInitialized || isInitializing) {
        return {
          isAuthorized: false,
          error: 'Cedarling is not yet initialized. Please wait...',
        }
      }

      if (!access_token || !id_token || !userinfo_token) {
        return {
          isAuthorized: false,
          error: 'Required tokens are missing',
        }
      }

      if (!resolvedResourceId) {
        return {
          isAuthorized: false,
          error: 'Resource id is missing for the given permission',
        }
      }

      const actionLabel = getActionLabelFromUrl(url)

      const permissionsWithTags = findPermissionByUrl(apiPermission, url)
      if (!permissionsWithTags) {
        return {
          isAuthorized: false,
          error: 'Permission not found for the given URL',
        }
      }

      try {
        const { request, cacheKey, cachedDecision } = buildAuthorizationRequest(
          resolvedResourceId,
          actionLabel,
        )
        if (cachedDecision !== undefined) {
          return { isAuthorized: cachedDecision }
        }
        const response = await cedarlingClient.token_authorize(request)

        const isAuthorized = response?.decision === true

        dispatch(
          setCedarlingPermission({
            resourceId: cacheKey,
            isAuthorized,
          }),
        )
        return { isAuthorized, response }
      } catch (error) {
        const toMessage = (err: unknown): string =>
          err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error'
        const rawMessage = toMessage(error)
        const truncated = rawMessage.length > 25 ? rawMessage.slice(0, 25) + '…' : rawMessage
        dispatch(updateToast(true, 'error', `Authorization error: ${truncated}`))
        return {
          isAuthorized: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
    [
      permissionsByResourceId,
      apiPermission,
      buildAuthorizationRequest,
      dispatch,
      access_token,
      id_token,
      userinfo_token,
      cedarlingInitialized,
      isInitializing,
    ],
  )

  const authorizeHelper = useCallback(
    async (resourceScopes: ResourceScopeEntry[]): Promise<AuthorizationResult[]> => {
      if (!resourceScopes || resourceScopes.length === 0) {
        return []
      }
      const promises = resourceScopes.map((entry) => authorize([entry]))
      const settledResults = await Promise.allSettled(promises)
      return settledResults.map((result) =>
        result.status === 'fulfilled'
          ? result.value
          : {
              isAuthorized: false,
              error:
                result.reason instanceof Error
                  ? result.reason.message
                  : typeof result.reason === 'string'
                    ? result.reason
                    : 'Unknown error',
            },
      )
    },
    [authorize],
  )

  const hasCedarPermission = useCallback(
    (resourceId: string, permission?: string) => {
      if (permission) {
        const actionLabel = getActionLabelFromUrl(permission)
        return getCachedDecisionByAction(resourceId, actionLabel)
      }
      return getCachedPermission(resourceId)
    },
    [getCachedDecisionByAction, getCachedPermission],
  )

  const hasCedarReadPermission = useCallback(
    (resourceId: string) =>
      getCachedDecisionByAction(resourceId, 'read') ?? getCachedPermission(resourceId),
    [getCachedDecisionByAction, getCachedPermission],
  )

  const hasCedarWritePermission = useCallback(
    (resourceId: string) => getCachedDecisionByAction(resourceId, 'write'),
    [getCachedDecisionByAction],
  )

  const hasCedarDeletePermission = useCallback(
    (resourceId: string) => getCachedDecisionByAction(resourceId, 'delete'),
    [getCachedDecisionByAction],
  )

  return {
    authorize,
    authorizeHelper,
    hasCedarPermission,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    isLoading,
    error,
  }
}

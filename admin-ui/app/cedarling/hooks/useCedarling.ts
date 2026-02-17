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
import { OPENID, REVOKE_SESSION, SCIM_BULK, SSA_ADMIN, SSA_DEVELOPER } from '@/utils/PermChecker'
import { updateToast } from '@/redux/features/toastSlice'

export function useCedarling(): UseCedarlingReturn {
  const { ACTION_TYPE, RESOURCE_TYPE } = CEDARLING_CONSTANTS

  const dispatch = useDispatch()

  const {
    userinfo_jwt: userinfo_token,
    idToken: id_token,
    jwtToken: access_token,
  } = useSelector((state: RootState) => state.authReducer)

  const {
    permissions: permissionsByResourceId,
    loading: isLoading,
    error,
    initialized: cedarlingInitialized,
    isInitializing,
  } = useSelector((state: RootState) => state.cedarPermissions)
  const executeUrls = new Set([SSA_ADMIN, SSA_DEVELOPER, SCIM_BULK, REVOKE_SESSION, OPENID])

  const getActionLabelFromUrl = useCallback((url: string): CedarAction => {
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
  }, [])
  const buildAuthorizationRequest = useCallback(
    (resourceId: AdminUiFeatureResource, actionLabel: CedarAction) => {
      const cacheKey = buildCedarPermissionKey(resourceId, actionLabel)
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
    (resourceId: AdminUiFeatureResource, action: CedarAction): boolean | undefined =>
      permissionsByResourceId[buildCedarPermissionKey(resourceId, action)],
    [permissionsByResourceId],
  )

  const getCachedPermission = useCallback(
    (resourceId: AdminUiFeatureResource): boolean | undefined => {
      const readKey = buildCedarPermissionKey(resourceId, 'read')
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

      let cacheKey: string | undefined
      try {
        const buildResult = buildAuthorizationRequest(resolvedResourceId, actionLabel)
        cacheKey = buildResult.cacheKey
        const { request, cachedDecision } = buildResult
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

      // Deduplicate by (resourceId, action) to avoid redundant API calls
      // Map structure: key -> { entry, indices[] }
      const uniqueMap = new Map<string, { entry: ResourceScopeEntry; indices: number[] }>()

      resourceScopes.forEach((entry, index) => {
        const actionLabel = getActionLabelFromUrl(entry.permission)
        const key = `${entry.resourceId}::${actionLabel}`
        const existing = uniqueMap.get(key)
        if (existing) {
          existing.indices.push(index)
        } else {
          uniqueMap.set(key, { entry, indices: [index] })
        }
      })

      // Create promises only for unique (resourceId, action) combinations
      const uniqueEntries = Array.from(uniqueMap.values())
      const uniquePromises = uniqueEntries.map(({ entry }) => authorize([entry]))

      // Wait for all unique authorizations
      const settledResults = await Promise.allSettled(uniquePromises)

      // Map results back to original order
      const results: AuthorizationResult[] = new Array(resourceScopes.length)

      uniqueEntries.forEach(({ indices }, uniqueIndex) => {
        const result = settledResults[uniqueIndex]
        const authorizationResult: AuthorizationResult =
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
              }

        // Assign the same result to all entries that share this key
        indices.forEach((originalIndex) => {
          results[originalIndex] = authorizationResult
        })
      })

      return results
    },
    [authorize, getActionLabelFromUrl],
  )

  const hasCedarReadPermission = useCallback(
    (resourceId: AdminUiFeatureResource) =>
      getCachedDecisionByAction(resourceId, 'read') ?? getCachedPermission(resourceId),
    [getCachedDecisionByAction, getCachedPermission],
  )

  const hasCedarWritePermission = useCallback(
    (resourceId: AdminUiFeatureResource) => getCachedDecisionByAction(resourceId, 'write'),
    [getCachedDecisionByAction],
  )

  const hasCedarDeletePermission = useCallback(
    (resourceId: AdminUiFeatureResource) => getCachedDecisionByAction(resourceId, 'delete'),
    [getCachedDecisionByAction],
  )

  return {
    authorize,
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
    isLoading,
    error,
  }
}

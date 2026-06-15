import { useCallback, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setCedarlingPermission } from '@/redux/features/cedarPermissionsSlice'
import { cedarlingClient } from '@/cedarling/client'
import { buildCedarPermissionKey } from '@/cedarling/utility'
import { CEDAR_ACTIONS, CEDARLING_CONSTANTS } from '@/cedarling/constants'
import type {
  UseCedarlingReturn,
  AuthorizationResult,
  ResourceScopeEntry,
  CedarAction,
  AdminUiFeatureResource,
  ITokenEntry,
} from '@/cedarling/types'
import { updateToast } from '@/redux/features/toastSlice'
import { logger } from '@/utils/logger'

const inFlightAuthorizations = new Map<string, Promise<AuthorizationResult>>()

const MAX_ERROR_MESSAGE_LENGTH = 25
const { ACTION_TYPE, RESOURCE_TYPE, TOKEN_MAPPINGS } = CEDARLING_CONSTANTS

const buildLogPayload = (resourceId: AdminUiFeatureResource, action: CedarAction) => ({
  action: `${ACTION_TYPE}"${action}"`,
  resource: {
    cedar_entity_mapping: {
      entity_type: RESOURCE_TYPE,
      id: resourceId,
    },
  },
  context: {},
})

export const useCedarling = (): UseCedarlingReturn => {
  const dispatch = useAppDispatch()

  const {
    userinfo_jwt: userinfo_token,
    idToken: id_token,
    jwtToken: access_token,
  } = useAppSelector((state) => state.authReducer)

  const {
    permissions: permissionsByResourceId,
    initialized: cedarlingInitialized,
    isInitializing,
  } = useAppSelector((state) => state.cedarPermissions)

  const permissionsRef = useRef(permissionsByResourceId)
  permissionsRef.current = permissionsByResourceId

  const buildAuthorizationRequest = useCallback(
    (resourceId: AdminUiFeatureResource, actionLabel: CedarAction) => {
      const cacheKey = buildCedarPermissionKey(resourceId, actionLabel)
      const cachedDecision = permissionsRef.current[cacheKey]
      if (cachedDecision !== undefined) {
        return { cacheKey, cachedDecision }
      }

      // Ensure all tokens are available
      if (!access_token || !id_token || !userinfo_token) {
        throw new Error('Required tokens are missing')
      }

      const tokens: ITokenEntry[] = [
        { mapping: TOKEN_MAPPINGS.ACCESS_TOKEN, payload: access_token },
        { mapping: TOKEN_MAPPINGS.ID_TOKEN, payload: id_token },
        { mapping: TOKEN_MAPPINGS.USERINFO_TOKEN, payload: userinfo_token },
      ]

      if (!resourceId) {
        throw new Error('Resource id is missing for Cedar authorization request')
      }

      const requestPayload = {
        tokens,
        ...buildLogPayload(resourceId, actionLabel),
      }

      return { request: requestPayload, cacheKey }
    },
    [access_token, id_token, userinfo_token],
  )

  const getCachedDecisionByAction = useCallback(
    (resourceId: AdminUiFeatureResource, action: CedarAction): boolean | undefined =>
      permissionsRef.current[buildCedarPermissionKey(resourceId, action)],
    [],
  )

  const authorize = useCallback(
    async (resourceScope: ResourceScopeEntry[]): Promise<AuthorizationResult> => {
      const scopeEntry = resourceScope[0]
      if (!scopeEntry) return { isAuthorized: false }

      const resolvedResourceId = scopeEntry.resourceId
      const requestedAction = scopeEntry.action

      if (!cedarlingInitialized || isInitializing) {
        logger.debug(
          `Cedarling authorization skipped for "${resolvedResourceId}" (${requestedAction}): Cedarling is not yet initialized.`,
          { payload: buildLogPayload(resolvedResourceId, requestedAction) },
        )
        return {
          isAuthorized: false,
          error: 'Cedarling is not yet initialized. Please wait...',
        }
      }

      if (!access_token || !id_token || !userinfo_token) {
        logger.debug(
          `Cedarling authorization denied for "${resolvedResourceId}" (${requestedAction}): required tokens are missing.`,
          { payload: buildLogPayload(resolvedResourceId, requestedAction) },
        )
        return {
          isAuthorized: false,
          error: 'Required tokens are missing',
        }
      }

      if (!resolvedResourceId) {
        logger.debug(
          `Cedarling authorization denied (${requestedAction}): resource id is missing for the given permission.`,
          { payload: buildLogPayload(resolvedResourceId, requestedAction) },
        )
        return {
          isAuthorized: false,
          error: 'Resource id is missing for the given permission',
        }
      }

      const actionLabel = scopeEntry.action

      try {
        const { request, cacheKey, cachedDecision } = buildAuthorizationRequest(
          resolvedResourceId,
          actionLabel,
        )
        if (cachedDecision !== undefined) {
          return { isAuthorized: cachedDecision }
        }

        const pending = inFlightAuthorizations.get(cacheKey)
        if (pending) {
          return await pending
        }

        const authorizing = cedarlingClient
          .token_authorize(request)
          .then((response): AuthorizationResult => {
            const isAuthorized = response?.decision === true
            if (!isAuthorized) {
              logger.debug(
                `Cedarling authorization denied: "${resolvedResourceId}" (${actionLabel})`,
                {
                  payload: buildLogPayload(resolvedResourceId, actionLabel),
                  response,
                },
              )
            }
            dispatch(setCedarlingPermission({ resourceId: cacheKey, isAuthorized }))
            return { isAuthorized, response }
          })
        inFlightAuthorizations.set(cacheKey, authorizing)

        try {
          return await authorizing
        } finally {
          inFlightAuthorizations.delete(cacheKey)
        }
      } catch (error) {
        const toMessage = (err: Error | string): string =>
          err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error'
        const rawMessage = toMessage(error as Error | string)
        logger.error(
          `Cedarling authorization failed for "${resolvedResourceId}" (${actionLabel}): ${rawMessage}`,
          {
            payload: buildLogPayload(resolvedResourceId, actionLabel),
            error,
          },
        )
        const truncated =
          rawMessage.length > MAX_ERROR_MESSAGE_LENGTH
            ? rawMessage.slice(0, MAX_ERROR_MESSAGE_LENGTH) + '…'
            : rawMessage
        dispatch(updateToast(true, 'error', `Authorization error: ${truncated}`))
        return {
          isAuthorized: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    },
    [
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

      const uniqueMap = new Map<string, { entry: ResourceScopeEntry; indices: number[] }>()

      resourceScopes.forEach((entry, index) => {
        const actionLabel = entry.action
        const key = buildCedarPermissionKey(entry.resourceId, actionLabel)
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
    [authorize],
  )

  const hasCedarReadPermission = useCallback(
    (resourceId: AdminUiFeatureResource) =>
      getCachedDecisionByAction(resourceId, CEDAR_ACTIONS.READ),
    [getCachedDecisionByAction],
  )

  const hasCedarWritePermission = useCallback(
    (resourceId: AdminUiFeatureResource) =>
      getCachedDecisionByAction(resourceId, CEDAR_ACTIONS.WRITE),
    [getCachedDecisionByAction],
  )

  const hasCedarDeletePermission = useCallback(
    (resourceId: AdminUiFeatureResource) =>
      getCachedDecisionByAction(resourceId, CEDAR_ACTIONS.DELETE),
    [getCachedDecisionByAction],
  )

  return {
    authorizeHelper,
    hasCedarReadPermission,
    hasCedarWritePermission,
    hasCedarDeletePermission,
  }
}

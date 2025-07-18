import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { setCedarlingPermission } from '../../redux/features/cedarPermissionsSlice'
import { cedarlingClient } from '../client/CedarlingClient'
import { constants } from '../../cedarling/constants'
import type {
  RootState,
  UseCedarlingReturn,
  AuthorizationResult,
  IPermissionWithTags,
} from '../types'
import { findPermissionByUrl } from '../utility/mapRolePermissions'
import { uuidv4 } from '@/utils/Util'
import {
  OPENID,
  REVOKE_SESSION,
  SCIM_BULK,
  SSA_ADMIN,
  SSA_DEVELOPER,
  SSA_PORTAL,
} from '@/utils/PermChecker'

export function useCedarling(): UseCedarlingReturn {
  const { ACTION_TYPE, RESOURCE_TYPE } = constants

  const dispatch = useDispatch()

  const {
    userinfo_jwt: userinfo_token,
    idToken: id_token,
    JwtToken: access_token,
  } = useSelector((state: RootState) => state.authReducer)
  const apiPermission = useSelector((state: RootState) => state.apiPermissionReducer.items)

  const {
    permissions,
    loading: isLoading,
    error,
    initialized: cedarlingInitialized,
    isInitializing,
  } = useSelector((state: RootState) => state.cedarPermissions)

  const executeUrls = new Set([
    SSA_ADMIN,
    SSA_PORTAL,
    SSA_DEVELOPER,
    SCIM_BULK,
    REVOKE_SESSION,
    OPENID,
  ])
  const getActionFromUrl = useCallback(
    (url: string): string => {
      const lowerUrl = url.toLowerCase()

      if (executeUrls.has(url)) {
        return `${ACTION_TYPE}"Execute"` // Matched known action-based endpoint
      }

      if (lowerUrl.includes('write')) {
        return `${ACTION_TYPE}"Write"` // Detected write operation
      }

      if (lowerUrl.includes('delete')) {
        return `${ACTION_TYPE}"Delete"` // Detected delete operation
      }

      if (lowerUrl.includes('read')) {
        return `${ACTION_TYPE}"Read"` // Detected read operation
      }

      // Default fallback if no specific match — still safe to proceed
      return `${ACTION_TYPE}"Read"`
    },
    [ACTION_TYPE],
  )

  const hasReduxPermission = useCallback(
    (url: string): boolean | undefined => {
      if (url in permissions) {
        return permissions[url]
      } else {
        return undefined
      }
    },
    [permissions],
  )

  const token_authorizeCedarRequestBuilder = useCallback(
    (permissionsWithTags: IPermissionWithTags) => {
      const { permission, tag: id } = permissionsWithTags

      // Ensure all tokens are available
      if (!access_token || !id_token || !userinfo_token) {
        throw new Error('Required tokens are missing')
      }

      const tokens = {
        access_token,
        id_token,
        userinfo_token,
      }

      const resource = {
        app_id: uuidv4(),
        id,
        type: RESOURCE_TYPE,
      }

      const action = getActionFromUrl(permission)

      const req = {
        tokens,
        action,
        resource,
        context: {},
      }

      return req
    },
    [access_token, id_token, userinfo_token, RESOURCE_TYPE, getActionFromUrl],
  )

  const authorize = useCallback(
    async (resourceScope: string[]): Promise<AuthorizationResult> => {
      const url = resourceScope[0]
      if (!url) return { isAuthorized: false }

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

      const existingPermission = hasReduxPermission(url)
      if (existingPermission !== undefined) {
        return { isAuthorized: existingPermission }
      }

      const permissionsWithTags = findPermissionByUrl(apiPermission, url)
      if (!permissionsWithTags) {
        return {
          isAuthorized: false,
          error: 'Permission not found for the given URL',
        }
      }

      try {
        const request = token_authorizeCedarRequestBuilder(permissionsWithTags)
        const response = await cedarlingClient.token_authorize(request)

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
    [
      hasReduxPermission,
      apiPermission,
      token_authorizeCedarRequestBuilder,
      dispatch,
      access_token,
      id_token,
      userinfo_token,
      cedarlingInitialized,
      isInitializing,
    ],
  )

  return {
    authorize,
    hasCedarPermission: hasReduxPermission,
    isLoading,
    error,
  }
}

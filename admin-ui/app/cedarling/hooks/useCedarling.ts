// @ts-nocheck

import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCedarlingPermission } from '../../redux/features/cedarPermissionsSlice'

import { cedarlingClient } from '../client/CedarlingClient'
import { uuidv4 } from '@/utils/Util'
import { constants } from '../../cedarling/constants'

export function useCedarling() {
  const { APP_ID, APP_NAME, PRINCIPAL_TYPE, RESOURCE_TYPE, ACTION_TYPE } = constants
  const dispatch = useDispatch()

  const { scopes, role, sub, permissions, isLoading, error } = useSelector((state) => {
    return {
      scopes: state.authReducer?.token?.scopes ?? state.authReducer?.permissions,
      role: state.authReducer?.userinfo?.jansAdminUIRole,
      sub: state.authReducer?.userinfo?.sub,
      permissions: state.cedarPermissions?.permissions || {},
      isLoading: state.cedarPermissions?.loading || false,
      error: state.cedarPermissions?.error,
    }
  })

  const hasPermission = useCallback(
    (url) => {
      if (url in permissions) {
        return permissions[url] // true or false
      }
      return undefined // unknown (not checked or not yet resolved)
    },
    [permissions],
  )

  const cedarRequestBuilder = useCallback(
    (resourceScope) => {
      const safeScopes =
        scopes && Array.isArray(scopes) && scopes.length ? scopes : ['stats.readonly']

      const principals = [
        {
          id: uuidv4(),
          role,
          scopes: safeScopes,
          sub,
          type: PRINCIPAL_TYPE,
        },
      ]

      const resource = {
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
    [role, scopes, sub],
  )

  const authorize = useCallback(
    async (resourceScope) => {
      if (!resourceScope[0]) {
        return { isAuthorized: false }
      }
      //Mockup testing
      // if (
      //   resourceScope[0] === 'https://jans.io/oauth/jans-auth-server/config/properties.readonly' ||
      //   resourceScope[0] === 'https://jans.io/oauth/config/stats.readonly' ||
      //   resourceScope[0] === 'https://jans.io/oauth/config/acrs.readonly' ||
      //   resourceScope[0] ===
      //     'https://jans.io/oauth/jans-auth-server/config/adminui/webhook.readonly' ||
      //   resourceScope[0] === 'https://jans.io/oauth/config/jans_asset-read'
      // ) {
      //   return Promise.resolve({ isAuthorized: false })
      // }

      const existingPermission = hasPermission(resourceScope[0])

      if (existingPermission !== undefined) {
        return Promise.resolve({ isAuthorized: existingPermission })
      }

      const request = cedarRequestBuilder(resourceScope)

      try {
        const response = await cedarlingClient.authorize(request)

        const isAuthorized = response.decision

        dispatch(
          setCedarlingPermission({
            url: resourceScope[0],
            isAuthorized,
          }),
        )

        return { isAuthorized, response }
      } catch (error) {
        console.error('❌ Authorization Error:', error)

        return { isAuthorized: false, error: error.message }
      }
    },
    [dispatch, hasPermission, cedarRequestBuilder],
  )

  return {
    authorize,
    hasCedarPermission: hasPermission,
    isLoading,
    error,
  }
}

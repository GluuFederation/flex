import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCedarlingPermission } from '../../redux/features/cedarPermissionsSlice'
import { cedarRequestBuilder } from '../utils'
import { cedarlingClient } from '../client/CedarlingClient'

export function useCedarling() {
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

  const cedarRequest = useCallback(
    (resourceScope) => cedarRequestBuilder(role, scopes, sub, resourceScope),
    [role, scopes, sub],
  )

  const authorize = useCallback(
    async (resourceScope) => {
      const existingPermission = hasPermission(resourceScope[0])

      if (existingPermission !== undefined) {
        return Promise.resolve({ isAuthorized: existingPermission })
      }

      const request = cedarRequest(resourceScope)

      try {
        // Call Cedar authorization directly and get immediate response
        const response = await cedarlingClient.authorize(request)
        const isAuthorized = response?.decision

        console.log('⚡ Immediate Response:', resourceScope, '→', isAuthorized)

        // Update Redux state directly (background process)
        dispatch(
          setCedarlingPermission({
            url: resourceScope[0],
            isAuthorized,
          }),
        )

        // Return immediate response
        return { isAuthorized, response }
      } catch (error) {
        console.error('❌ Authorization Error:', error)

        return { isAuthorized: false, error: error.message }
      }
    },
    [dispatch, hasPermission, cedarRequest],
  )

  return {
    authorize,
    hasCedarPermission: hasPermission,
    isLoading,
    error,
  }
}

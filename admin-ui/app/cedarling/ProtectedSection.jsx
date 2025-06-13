import React from 'react'
import { useCedarling } from './hooks/useCedarling'
import { makeUserAuthentication } from '@/frameworks/factories'
import { DEFAULT_ACTION } from '@/frameworks/pages/cedar/policy/PolicyUtils'
import { Alert, AlertTitle } from '@mui/material'

/**
 * ProtectedSection component that conditionally renders based on authorization
 * @param {Object} props - Component props
 * @param {string} [props.actionId] - Action ID for authorization
 * @param {string} props.resourceId - Resource ID for authorization
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {React.ReactNode} [props.fallback] - Component to show when access is denied
 * @param {React.ReactNode} [props.loadingFallback] - Component to show while loading
 */
export function ProtectedSection({
  actionId,
  resourceId,
  children,
  fallback = (
    <Alert severity="error">
      <AlertTitle>Access Denied</AlertTitle>
      {`Please contact your administrator.`}
    </Alert>
  ),
  loadingFallback = <div>Loading...</div>,
}) {
  const { authorize, isLoading, error } = useCedarling()
  const userAuthentication = makeUserAuthentication()
  const [isAuthorized, setIsAuthorized] = React.useState(false)

  React.useEffect(() => {
    const checkAuthorization = async () => {
      const accessToken = await userAuthentication.getAccessToken()
      const idToken = await userAuthentication.getIdToken()
      const userInfo = await userAuthentication.getUserInfoToken()
      const request = {
        tokens: {
          access_token: accessToken,
          id_token: idToken,
          userinfo_token: userInfo,
        },
        action: actionId ? `AgamaLab::Action::"${actionId}"` : DEFAULT_ACTION,
        resource: { type: 'UIComponent', id: resourceId, name: resourceId },
        context: {},
      }
      try {
        const result = await authorize(request)
        setIsAuthorized(typeof result === 'boolean' ? result : result.decision)
      } catch (err) {
        setIsAuthorized(false)
      }
    }
    checkAuthorization()
  }, [authorize, actionId, resourceId])
  if (isLoading) return <>{loadingFallback}</>
  if (error) return <div>Error: {error?.message}</div>
  if (!isAuthorized) return <>{fallback}</>
  return <>{children}</>
}

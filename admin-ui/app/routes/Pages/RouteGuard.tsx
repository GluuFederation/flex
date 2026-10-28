import { useEffect, useMemo, useState, type ReactNode } from 'react'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { useAppSelector } from '@/redux/hooks'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { CEDARLING_BYPASS } from '@/cedarling/constants'
import { buildCedarPermissionKey } from '@/cedarling/utility'
import type { ResourceScopeEntry } from '@/cedarling/types'
import type { PluginRouteAccess } from 'Plugins/internal'

type RouteGuardProps = PluginRouteAccess & {
  children: ReactNode
}

const RouteGuard = ({ resourceKey, action, children }: RouteGuardProps) => {
  const { authorizeHelper } = useCedarling()
  const initialized = useAppSelector((state) => state.cedarPermissions.initialized)
  const isBypass = resourceKey === CEDARLING_BYPASS

  const scope = useMemo<ResourceScopeEntry | null>(
    () =>
      resourceKey && resourceKey !== CEDARLING_BYPASS && action
        ? { resourceId: resourceKey, action }
        : null,
    [resourceKey, action],
  )
  const permissionKey = scope ? buildCedarPermissionKey(scope.resourceId, scope.action) : null
  const decision = useAppSelector((state) =>
    permissionKey ? state.cedarPermissions.permissions[permissionKey] : undefined,
  )
  const [settledKey, setSettledKey] = useState<string | null>(null)

  useEffect(() => {
    if (!initialized || !scope || !permissionKey || decision !== undefined) return
    let cancelled = false
    authorizeHelper([scope]).then(() => {
      if (!cancelled) setSettledKey(permissionKey)
    })
    return () => {
      cancelled = true
    }
  }, [initialized, scope, permissionKey, decision, authorizeHelper])

  if (isBypass || decision === true) return <>{children}</>

  const isDenied =
    !scope || decision === false || (decision === undefined && settledKey === permissionKey)

  return <GluuViewWrapper canShow={isDenied ? false : null}>{null}</GluuViewWrapper>
}

export default RouteGuard

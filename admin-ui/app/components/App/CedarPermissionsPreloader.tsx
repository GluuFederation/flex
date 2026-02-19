import { useEffect, useRef } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { useCedarling, CEDAR_RESOURCE_SCOPES } from '@/cedarling'
import type { ResourceScopeEntry } from '@/cedarling'

const ALL_SCOPES: ResourceScopeEntry[] = Object.values(CEDAR_RESOURCE_SCOPES).flat()

const CedarPermissionsPreloader = () => {
  const didPreload = useRef(false)
  const { initialized } = useAppSelector((state) => state.cedarPermissions)
  const { authorizeHelper } = useCedarling()

  useEffect(() => {
    if (!initialized || didPreload.current) return
    didPreload.current = true

    console.log(
      '[Cedarling] preload all permissions',
      JSON.stringify({ totalScopes: ALL_SCOPES.length }),
    )
    authorizeHelper(ALL_SCOPES).then((results) => {
      const granted = results.filter((r) => r.isAuthorized).length
      console.log(
        '[Cedarling] preload done',
        JSON.stringify({ total: results.length, granted, denied: results.length - granted }),
      )
    })
  }, [initialized, authorizeHelper])

  return null
}

export default CedarPermissionsPreloader

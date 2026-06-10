import { useState, useEffect, useMemo, useCallback } from 'react'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { useAppSelector } from '@/redux/hooks'
import { processMenus } from 'Plugins/PluginMenuResolver'
import { useHealthStatus, useFido2HealthStatus } from 'Plugins/admin/components/Health/hooks'
import type { MenuItem, PluginMenu } from '@/components/Sidebar'
import { filterMenusByHealth, filterMenusByAuth, findFirstLeafPath } from '@/utils/menuFilters'

export const useFirstAuthorizedPath = (): { path: string | null; loading: boolean } => {
  const { authorizeHelper } = useCedarling()
  const { allServices } = useHealthStatus()
  const { data: fido2HealthData } = useFido2HealthStatus()
  const initialized = useAppSelector((state) => state.cedarPermissions?.initialized)

  const combinedServices = useMemo(
    () => (fido2HealthData ? [...allServices, fido2HealthData] : allServices),
    [allServices, fido2HealthData],
  )
  const servicesReady = combinedServices.length > 0

  const [path, setPath] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const resolveFirstPath = useCallback(
    async (menus: MenuItem[]): Promise<string | null> => {
      const authorizedMenus = await filterMenusByAuth(menus, authorizeHelper)
      return findFirstLeafPath(authorizedMenus)
    },
    [authorizeHelper],
  )

  useEffect(() => {
    if (!initialized || !servicesReady) {
      return
    }
    let cancelled = false
    const resolve = async () => {
      const menus: PluginMenu[] = await processMenus()
      const healthVisibleMenus = filterMenusByHealth(menus, combinedServices)
      const firstPath = await resolveFirstPath(healthVisibleMenus)
      if (!cancelled) {
        setPath(firstPath)
        setLoading(false)
      }
    }
    resolve()
    return () => {
      cancelled = true
    }
  }, [initialized, servicesReady, combinedServices, resolveFirstPath])

  return { path, loading }
}

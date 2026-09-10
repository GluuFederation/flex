import { useEffect, useMemo, useState } from 'react'
import { processMenus } from 'Plugins/PluginMenuResolver'
import { useHealthStatus, useFido2HealthStatus } from 'Plugins/admin/components/Health/hooks'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { useAppSelector } from '@/redux/hooks'
import { filterMenusByHealth, filterMenusByAuth, findFirstLeafPath } from '@/utils/menuFilters'
import { logger } from '@/utils/logger'
import { resolveApiErrorMessage } from '@/utils/apiErrorMessage'
import type { MenuItem, PluginMenu } from '@/components/Sidebar'
import type { FilteredMenus } from './types'

const collectPaths = (menus: readonly MenuItem[], paths: Set<string>): void => {
  menus.forEach((menu) => {
    if (menu.path) {
      paths.add(menu.path)
    }
    if (menu.children?.length) {
      collectPaths(menu.children, paths)
    }
  })
}

const useFilteredMenus = (): FilteredMenus => {
  const { allServices } = useHealthStatus()
  const { data: fido2HealthData } = useFido2HealthStatus()
  const { authorizeHelper } = useCedarling()
  const initialized = useAppSelector((state) => state.cedarPermissions?.initialized)

  const [menus, setMenus] = useState<PluginMenu[] | null>(null)

  const combinedServices = useMemo(
    () => (fido2HealthData ? [...allServices, fido2HealthData] : allServices),
    [allServices, fido2HealthData],
  )

  const hasServices = allServices.length > 0

  useEffect(() => {
    if (!hasServices || !initialized) return

    let cancelled = false

    const resolveMenus = async (): Promise<void> => {
      try {
        const all: PluginMenu[] = await processMenus()
        const healthy = filterMenusByHealth(all, combinedServices)
        const authorized = await filterMenusByAuth(healthy, authorizeHelper)
        if (cancelled) return
        setMenus(authorized)
      } catch (error) {
        if (cancelled) return
        logger.error('Failed to load plugin menus: ' + resolveApiErrorMessage(error as Error))
        setMenus([])
      }
    }

    resolveMenus()

    return () => {
      cancelled = true
    }
  }, [hasServices, initialized, combinedServices, authorizeHelper])

  const allowedPaths = useMemo(() => {
    if (!menus) return null
    const paths = new Set<string>()
    collectPaths(menus, paths)
    return paths
  }, [menus])

  const firstPath = useMemo(() => (menus ? findFirstLeafPath(menus) : null), [menus])

  return { menus: menus ?? [], allowedPaths, firstPath, isReady: menus !== null }
}

export default useFilteredMenus

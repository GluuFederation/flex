import { Suspense, useState, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ROUTES } from '@/helpers/navigation'
import { devLogger } from '@/utils/devLogger'
import { useAppSelector } from '@/redux/hooks'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { processRoutes, processRoutesSync } from 'Plugins/PluginMenuResolver'
import type { PluginRoute } from 'Plugins/internal'
import { uuidv4 } from 'Utils/Util'
import ProtectedRoute from './Pages/ProtectRoutes'
import { LazyRoutes } from 'Utils/RouteLoader'
import { buildSafeLogoutUrl } from '@/utils/urlSecurity'

const ALWAYS_MOUNTED_LAZY_ROUTES: ReadonlySet<keyof typeof LazyRoutes> = new Set([
  'GluuToast',
  'DefaultSidebar',
  'GluuNavBar',
  'GluuWebhookExecutionDialog',
])

const schedulePreload = (pluginRoutes: PluginRoute[]) => {
  if (typeof window === 'undefined') return
  const queue: Array<() => Promise<{ default: React.ComponentType }>> = [
    ...Object.entries(LazyRoutes)
      .filter(([key]) => !ALWAYS_MOUNTED_LAZY_ROUTES.has(key as keyof typeof LazyRoutes))
      .map(
        ([, r]) =>
          () =>
            r.preload(),
      ),
    ...pluginRoutes.flatMap((r) => (r.component.preload ? [r.component.preload] : [])),
  ]
  const idle =
    typeof window.requestIdleCallback === 'function'
      ? (cb: () => void) => window.requestIdleCallback(cb)
      : (cb: () => void) => window.setTimeout(cb, 200)
  const next = () => {
    if (queue.length === 0) return
    idle(() => {
      queue.shift()?.()
      next()
    })
  }
  if (document.readyState === 'complete') {
    idle(next)
  } else {
    window.addEventListener('load', () => idle(next), { once: true })
  }
}

export const RoutedContent = () => {
  const [pluginMenus, setPluginMenus] = useState<
    Array<{ path: string; component: React.ComponentType }>
  >([])

  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const routes = await processRoutes()
        setPluginMenus(routes)
        schedulePreload(routes)
      } catch (error) {
        devLogger.error('Failed to load plugins:', error instanceof Error ? error : String(error))
        const fallback = processRoutesSync()
        setPluginMenus(fallback)
        schedulePreload(fallback)
      }
    }

    loadPlugins()
  }, [])

  const { userinfo, config } = useAppSelector((state) => state.authReducer)
  const { initialized, cedarFailedStatusAfterMaxTries } = useAppSelector(
    (state) => state.cedarPermissions,
  )

  useEffect(() => {
    if (!userinfo) return
    const roles = userinfo.jansAdminUIRole
    if (!roles || (Array.isArray(roles) && roles.length === 0)) {
      const state = uuidv4()
      const sessionEndpoint = buildSafeLogoutUrl(
        typeof config.endSessionEndpoint === 'string' ? config.endSessionEndpoint : null,
        typeof config.postLogoutRedirectUri === 'string' ? config.postLogoutRedirectUri : null,
        state,
      )

      window.location.href = sessionEndpoint || '/admin/logout'
    }
  }, [userinfo])

  if (cedarFailedStatusAfterMaxTries && !initialized) {
    return <GluuViewWrapper canShow={false}>{null}</GluuViewWrapper>
  }

  return (
    <Suspense fallback={<GluuLoader blocking />}>
      <Routes>
        <Route
          path={ROUTES.HOME_DASHBOARD}
          element={
            <ProtectedRoute>
              <LazyRoutes.DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.HOME_DASHBOARD} />} />

        {/* -------- Plugins ---------*/}
        {pluginMenus.map((item, key) => (
          <Route key={key} path={item.path} element={<item.component />} />
        ))}

        {/*    Pages Routes    */}
        <Route element={<LazyRoutes.ProfilePage />} path={ROUTES.PROFILE} />

        <Route element={<LazyRoutes.Gluu404Error />} path={ROUTES.ERROR_404} />

        {/*    404    */}
        <Route path={ROUTES.WILDCARD} element={<Navigate to={ROUTES.ERROR_404} />} />
      </Routes>
    </Suspense>
  )
}

//------ Custom Layout Parts --------
export const RoutedNavbars = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path={ROUTES.WILDCARD} element={<LazyRoutes.GluuNavBar />} />
    </Routes>
  </Suspense>
)

export const RoutedSidebars = () => (
  <Suspense fallback={null}>
    <Routes>
      <Route path={ROUTES.WILDCARD} element={<LazyRoutes.DefaultSidebar />} />
    </Routes>
  </Suspense>
)

import React, { Suspense, lazy, ComponentType } from 'react'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'

type LazyRouteWrapper = ComponentType<Record<string, unknown>> & {
  preload: () => void
}

export const createLazyRoute = (
  importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>,
): LazyRouteWrapper => {
  const LazyComponent = lazy(importFn)

  const Wrapper = (props: Record<string, unknown>) => (
    <Suspense fallback={<GluuSuspenseLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  )

  const typedWrapper = Wrapper as LazyRouteWrapper
  typedWrapper.preload = importFn
  return typedWrapper
}

export const LazyRoutes = {
  DashboardPage: createLazyRoute(() => import('../routes/Dashboards/DashboardPage')),
  ProfilePage: createLazyRoute(() => import('../routes/Apps/Profile/ProfilePage')),
  Gluu404Error: createLazyRoute(() => import('../routes/Apps/Gluu/Gluu404Error')),
  ByeBye: createLazyRoute(() => import('../routes/Pages/ByeBye')),
  GluuNavBar: createLazyRoute(() => import('../routes/Apps/Gluu/GluuNavBar')),
  DefaultSidebar: createLazyRoute(() => import('../layout/components/DefaultSidebar')),
  GluuToast: createLazyRoute(() => import('../routes/Apps/Gluu/GluuToast')),
  GluuWebhookErrorDialog: createLazyRoute(
    () => import('../routes/Apps/Gluu/GluuWebhookErrorDialog'),
  ),
}

export const loadPluginRoute = (pluginName: string, routePath?: string): LazyRouteWrapper => {
  const componentPath = routePath || `${pluginName.charAt(0).toUpperCase() + pluginName.slice(1)}`

  return createLazyRoute(() =>
    import(`../../plugins/${pluginName}/components/${componentPath}`).catch(
      () => import(`../../plugins/${pluginName}/components/index`),
    ),
  )
}

export const preloadRoute = (routeName: keyof typeof LazyRoutes): void => {
  const route = LazyRoutes[routeName]
  if (route && 'preload' in route) {
    const lazyRoute = route as LazyRouteWrapper
    lazyRoute.preload()
  }
}

export const preloadRoutes = (routeNames: (keyof typeof LazyRoutes)[]): void => {
  routeNames.forEach(preloadRoute)
}

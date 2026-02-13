import React, { Suspense, lazy, ComponentType } from 'react'

type LazyRouteWrapper<P extends Record<string, unknown> = Record<string, unknown>> =
  ComponentType<P> & {
    preload: () => Promise<{ default: ComponentType<P> }>
  }

export const createLazyRoute = <P extends Record<string, unknown> = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
): LazyRouteWrapper<P> => {
  const LazyComponent = lazy(importFn)

  const Wrapper = (props: P) => (
    <Suspense fallback={null}>
      {/* @ts-expect-error Known TypeScript limitation: React.lazy() doesn't preserve generic type parameters. Runtime safety guaranteed by importFn. */}
      <LazyComponent {...props} />
    </Suspense>
  )

  const typedWrapper = Wrapper as LazyRouteWrapper<P>
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
    import(`../../plugins/${pluginName}/components/${componentPath}`).catch((err) => {
      console.warn(`Failed to load plugin route: ${pluginName}/${componentPath}`, {
        pluginName,
        componentPath,
        error: err,
      })
      return import(`../../plugins/${pluginName}/components/index`).catch((fallbackErr) => {
        console.warn(`Failed to load fallback plugin index for: ${pluginName}`, {
          pluginName,
          componentPath,
          primaryError: err,
          fallbackError: fallbackErr,
        })
        throw fallbackErr
      })
    }),
  )
}

export const preloadRoute = (routeName: keyof typeof LazyRoutes): void => {
  const route = LazyRoutes[routeName]
  if (route && 'preload' in route) {
    const lazyRoute = route as LazyRouteWrapper
    lazyRoute.preload().catch((error) => {
      console.warn(`Failed to preload route: ${routeName}`, error)
    })
  }
}

export const preloadRoutes = (routeNames: (keyof typeof LazyRoutes)[]): void => {
  routeNames.forEach(preloadRoute)
}

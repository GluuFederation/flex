import React, { Suspense, lazy, ComponentType } from 'react'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'

// Route loading utility
export const createLazyRoute = (importFn: () => Promise<{ default: ComponentType<any> }>) => {
  const LazyComponent = lazy(importFn)

  const Wrapper: any = (props: any) => (
    <Suspense fallback={<GluuSuspenseLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  )
  // Allow preloading the chunk ahead of time
  Wrapper.preload = importFn
  return Wrapper
}

// Pre-defined lazy routes for better code splitting
export const LazyRoutes = {
  // Dashboard routes
  DashboardPage: createLazyRoute(() => import('../routes/Dashboards/DashboardPage')),

  // App routes
  ProfilePage: createLazyRoute(() => import('../routes/Apps/Profile/ProfilePage')),
  Gluu404Error: createLazyRoute(() => import('../routes/Apps/Gluu/Gluu404Error')),
  ByeBye: createLazyRoute(() => import('../routes/Pages/ByeBye')),
  GluuNavBar: createLazyRoute(() => import('../routes/Apps/Gluu/GluuNavBar')),

  // Layout routes
  NavbarOnly: createLazyRoute(() => import('../routes/Layouts/NavbarOnly')),
  SidebarDefault: createLazyRoute(() => import('../routes/Layouts/SidebarDefault')),
  SidebarA: createLazyRoute(() => import('../routes/Layouts/SidebarA')),
  SidebarWithNavbar: createLazyRoute(() => import('../routes/Layouts/SidebarWithNavbar')),

  // Layout components
  DefaultSidebar: createLazyRoute(() => import('../layout/components/DefaultSidebar')),

  // Activity routes
  ActivityPage: createLazyRoute(() => import('../routes/Activity/ActivityPage')),
}

// Dynamic route loader for plugins
export const loadPluginRoute = (pluginName: string, routePath?: string) => {
  const componentPath = routePath || `${pluginName.charAt(0).toUpperCase() + pluginName.slice(1)}`

    return createLazyRoute(() =>
        import(
          /* webpackChunkName: "plugin-[request]" */
          /* webpackMode: "lazy" */
          /* webpackInclude: /^[^/]+\/components\/[^/]+$/ */
          `../../plugins/${pluginName}/components/${componentPath}`
        ).catch(() =>
          import(
            /* webpackChunkName: "plugin-[request]" */
            /* webpackMode: "lazy" */
            /* webpackInclude: /^[^/]+\/components\/index(\.(t|j)sx?)?$/ */
            `../../plugins/${pluginName}/components/index`
          ),
        )
      )
}

// Route preloading utility
export const preloadRoute = (routeName: keyof typeof LazyRoutes) => {
  const route = LazyRoutes[routeName]
  if (route && 'preload' in route) {
    ;(route as any).preload()
  }
}

// Batch preload multiple routes
export const preloadRoutes = (routeNames: (keyof typeof LazyRoutes)[]) => {
  routeNames.forEach(preloadRoute)
}

import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

type LazyRouteWrapper = LazyExoticComponent<ComponentType> & {
  preload: () => Promise<{ default: ComponentType }>
}

export const createLazyRoute = (
  importFn: () => Promise<{ default: ComponentType }>,
): LazyRouteWrapper => {
  const LazyComponent = lazy(importFn)

  return Object.assign(LazyComponent, { preload: importFn })
}

export const LazyRoutes = {
  DashboardPage: createLazyRoute(() => import('../routes/Dashboards/DashboardPage')),
  ProfilePage: createLazyRoute(() => import('../routes/Apps/Profile/ProfilePage')),
  Gluu404Error: createLazyRoute(() => import('../routes/Apps/Gluu/Gluu404Error')),
  ByeBye: createLazyRoute(() => import('../routes/Pages/ByeBye')),
  GluuNavBar: createLazyRoute(() => import('../routes/Apps/Gluu/GluuNavBar')),
  DefaultSidebar: createLazyRoute(() => import('../layout/components/DefaultSidebar')),
  GluuToast: createLazyRoute(() => import('../routes/Apps/Gluu/GluuToast')),
  GluuWebhookExecutionDialog: createLazyRoute(
    () => import('../routes/Apps/Gluu/GluuWebhookExecutionDialog'),
  ),
}

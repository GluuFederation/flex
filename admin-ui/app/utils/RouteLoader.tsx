import { Suspense, lazy, type ComponentType } from 'react'
import GluuLoader from '@/routes/Apps/Gluu/GluuLoader'

type LazyRouteWrapper<P extends object = object> = ComponentType<P> & {
  preload: () => Promise<{ default: ComponentType<P> }>
}

const createLazyRoute = <P extends object = object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
): LazyRouteWrapper<P> => {
  const LazyComponent = lazy(importFn)

  const Wrapper = (props: P) => (
    <Suspense fallback={<GluuLoader blocking />}>
      {/* @ts-expect-error lazy() does not preserve generic type params */}
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

import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const Fido = createLazyRoute(() => import('./components/Configuration'))
const MetricsPage = createLazyRoute(() => import('./components/Metrics'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.fido',
      icon: 'fidomanagement',
      path: ROUTES.FIDO_BASE,
      children: [
        {
          title: 'menus.configuration',
          path: ROUTES.FIDO_BASE,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.FIDO,
        },
        {
          title: 'menus.metrics',
          path: ROUTES.FIDO_METRICS,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.FIDO,
        },
      ],
    },
  ],
  routes: [
    {
      component: Fido,
      path: ROUTES.FIDO_BASE,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
    {
      component: MetricsPage,
      path: ROUTES.FIDO_METRICS,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
  ],
  reducers: [],
}

export default pluginMetadata

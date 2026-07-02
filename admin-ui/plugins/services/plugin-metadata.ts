import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const CachePage = createLazyRoute(() => import('./components/CachePage'))
const PersistenceDetail = createLazyRoute(() => import('./components/PersistenceDetail'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.services',
      icon: 'services',
      children: [
        {
          title: 'menus.cache',
          path: ROUTES.SERVICES_CACHE,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Cache,
        },
        {
          title: 'menus.persistence',
          path: ROUTES.SERVICES_PERSISTENCE,
          action: CEDAR_ACTIONS.READ,
          resourceKey: ADMIN_UI_RESOURCES.Persistence,
        },
      ],
    },
  ],
  routes: [
    {
      component: CachePage,
      path: ROUTES.SERVICES_CACHE,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Cache,
    },
    {
      component: PersistenceDetail,
      path: ROUTES.SERVICES_PERSISTENCE,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Persistence,
    },
  ],
  reducers: [],
}

export default pluginMetadata

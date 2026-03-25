import CachePage from './Components/Configuration/CachePage'
import PersistenceDetail from './Components/Configuration/PersistenceDetail'

import { CACHE_READ, PERSISTENCE_DETAIL } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.services',
      icon: 'services',
      children: [
        {
          title: 'menus.cache',
          path: ROUTES.SERVICES_CACHE,
          permission: CACHE_READ,
          resourceKey: ADMIN_UI_RESOURCES.Cache,
        },
        {
          title: 'menus.persistence',
          path: ROUTES.SERVICES_PERSISTENCE,
          permission: PERSISTENCE_DETAIL,
          resourceKey: ADMIN_UI_RESOURCES.Persistence,
        },
      ],
    },
  ],
  routes: [
    {
      component: CachePage,
      path: ROUTES.SERVICES_CACHE,
      permission: CACHE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Cache,
    },
    {
      component: PersistenceDetail,
      path: ROUTES.SERVICES_PERSISTENCE,
      permission: PERSISTENCE_DETAIL,
      resourceKey: ADMIN_UI_RESOURCES.Persistence,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata

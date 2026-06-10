import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const JansLock = createLazyRoute(() => import('./components/JansLock'))

const pluginMetadata = {
  menus: [
    {
      title: 'titles.jans_lock',
      icon: 'jans_lock',
      path: ROUTES.JANS_LOCK_BASE,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Lock,
    },
  ],
  routes: [
    {
      component: JansLock,
      path: ROUTES.JANS_LOCK_BASE,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Lock,
    },
  ],
  reducers: [],
}

export default pluginMetadata

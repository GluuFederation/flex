import { FIDO_READ, FIDO_WRITE } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const Fido = createLazyRoute(() => import('./components/Fido'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.fido',
      icon: 'fidomanagement',
      path: ROUTES.FIDO_BASE,
      permission: FIDO_READ,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
  ],
  routes: [
    {
      component: Fido,
      path: ROUTES.FIDO_BASE,
      permission: FIDO_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
    {
      component: Fido,
      path: ROUTES.FIDO_STATIC_CONFIG,
      permission: FIDO_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
    {
      component: Fido,
      path: ROUTES.FIDO_DYNAMIC_CONFIG,
      permission: FIDO_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.FIDO,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata

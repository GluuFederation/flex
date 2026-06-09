import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const ScimPage = createLazyRoute(() => import('./components/ScimPage'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.scim',
      icon: 'scim',
      path: ROUTES.SCIM_BASE,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.SCIM,
    },
  ],
  routes: [
    {
      component: ScimPage,
      path: ROUTES.SCIM_BASE,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SCIM,
    },
  ],
  reducers: [],
}

export default pluginMetadata

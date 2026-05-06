import { SCIM_CONFIG_READ, SCIM_CONFIG_WRITE } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const ScimPage = createLazyRoute(() => import('./components/ScimPage'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.scim',
      icon: 'scim',
      path: ROUTES.SCIM_BASE,
      permission: SCIM_CONFIG_READ,
      resourceKey: ADMIN_UI_RESOURCES.SCIM,
    },
  ],
  routes: [
    {
      component: ScimPage,
      path: ROUTES.SCIM_BASE,
      permission: SCIM_CONFIG_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.SCIM,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata

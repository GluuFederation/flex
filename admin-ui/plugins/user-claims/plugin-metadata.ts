import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_ACTIONS } from '@/cedarling/constants'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const UserClaimsListPage = createLazyRoute(() => import('./components/UserClaimsListPage'))
const UserClaimsAddPage = createLazyRoute(() => import('./components/UserClaimsAddPage'))
const UserClaimsEditPage = createLazyRoute(() => import('./components/UserClaimsEditPage'))
const UserClaimsViewPage = createLazyRoute(() => import('./components/UserClaimsViewPage'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.user_claims',
      icon: 'user_claims',
      path: ROUTES.ATTRIBUTES_LIST,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
  ],
  routes: [
    {
      component: UserClaimsEditPage,
      path: ROUTES.ATTRIBUTE_EDIT_TEMPLATE,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: UserClaimsViewPage,
      path: ROUTES.ATTRIBUTE_VIEW_TEMPLATE,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: UserClaimsAddPage,
      path: ROUTES.ATTRIBUTE_ADD,
      action: CEDAR_ACTIONS.WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: UserClaimsListPage,
      path: ROUTES.ATTRIBUTES_LIST,
      action: CEDAR_ACTIONS.READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
  ],
  reducers: [],
}

export default pluginMetadata

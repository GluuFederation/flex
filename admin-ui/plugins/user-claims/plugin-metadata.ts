import { ATTRIBUTE_READ, ATTRIBUTE_WRITE } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
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
      permission: ATTRIBUTE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
  ],
  routes: [
    {
      component: UserClaimsEditPage,
      path: ROUTES.ATTRIBUTE_EDIT_TEMPLATE,
      permission: ATTRIBUTE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: UserClaimsViewPage,
      path: ROUTES.ATTRIBUTE_VIEW_TEMPLATE,
      permission: ATTRIBUTE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: UserClaimsAddPage,
      path: ROUTES.ATTRIBUTE_ADD,
      permission: ATTRIBUTE_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
    {
      component: UserClaimsListPage,
      path: ROUTES.ATTRIBUTES_LIST,
      permission: ATTRIBUTE_READ,
      resourceKey: ADMIN_UI_RESOURCES.Attributes,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata

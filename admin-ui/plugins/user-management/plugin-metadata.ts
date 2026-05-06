import { USER_READ, USER_WRITE } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { ROUTES } from '@/helpers/navigation'
import { createLazyRoute } from '@/utils/RouteLoader'

const UserList = createLazyRoute(() => import('./components/UserList'))
const UserAddPage = createLazyRoute(() => import('./components/UserAddPage'))
const UserEditPage = createLazyRoute(() => import('./components/UserEditPage'))

const pluginMetadata = {
  menus: [
    {
      title: 'menus.users',
      icon: 'usersmanagement',
      path: ROUTES.USER_MANAGEMENT,
      permission: USER_READ,
      resourceKey: ADMIN_UI_RESOURCES.Users,
    },
  ],
  routes: [
    {
      component: UserList,
      path: ROUTES.USER_MANAGEMENT,
      permission: USER_READ,
      resourceKey: ADMIN_UI_RESOURCES.Users,
    },
    {
      component: UserAddPage,
      path: ROUTES.USER_ADD,
      permission: USER_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Users,
    },
    {
      component: UserEditPage,
      path: ROUTES.USER_EDIT_TEMPLATE,
      permission: USER_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Users,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata

import UserList from './components/UserList'
import UserAddPage from './components/UserAddPage'
import UserEditPage from './components/UserEditPage'
import { USER_READ, USER_WRITE } from 'Utils/PermChecker'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'

const PLUGIN_BASE_PATH = '/user'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.users',
      icon: 'usersmanagement',
      path: PLUGIN_BASE_PATH + '/usersmanagement',
      permission: USER_READ,
      resourceKey: ADMIN_UI_RESOURCES.Users,
    },
  ],
  routes: [
    {
      component: UserList,
      path: PLUGIN_BASE_PATH + '/usersmanagement',
      permission: USER_READ,
      resourceKey: ADMIN_UI_RESOURCES.Users,
    },
    {
      component: UserAddPage,
      path: PLUGIN_BASE_PATH + '/usermanagement/add',
      permission: USER_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Users,
    },
    {
      component: UserEditPage,
      path: PLUGIN_BASE_PATH + '/usermanagement/edit/:id',
      permission: USER_WRITE,
      resourceKey: ADMIN_UI_RESOURCES.Users,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata

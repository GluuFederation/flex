import UserList from './components/UserList'
import UserAddPage from './components/UserAddPage'
import UserEditPage from './components/UserEditPage'
import { USER_READ, USER_WRITE } from 'Utils/PermChecker'

const PLUGIN_BASE_PATH = '/user'

const pluginMetadata = {
  menus: [
    {
      title: 'menus.users',
      icon: 'usersmanagement',
      path: PLUGIN_BASE_PATH + '/usersmanagement',
      permission: USER_READ,
    },
  ],
  routes: [
    {
      component: UserList,
      path: PLUGIN_BASE_PATH + '/usersmanagement',
      permission: USER_READ,
    },
    {
      component: UserAddPage,
      path: PLUGIN_BASE_PATH + '/usermanagement/add',
      permission: USER_WRITE,
    },
    {
      component: UserEditPage,
      path: PLUGIN_BASE_PATH + '/usermanagement/edit/:id',
      permission: USER_WRITE,
    },
  ],
  reducers: [],
  sagas: [],
}

export default pluginMetadata
